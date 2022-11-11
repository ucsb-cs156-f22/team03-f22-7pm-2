import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticleEditPage from "main/pages/Article/ArticleEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import _mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("ArticleEditPage tests", () => {

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/article", { params: { id: 17 } }).reply(200, {  
                id: 17,
                title: "salon",
                url: "https://my.sa.ucsb.edu/gold/login.aspx  C C C",
                explanation: "testing url  C C",
                email: "hansonyu@ucsb.edu  C C",
                dateAdded: "2022-01-02T00:11"
            });
            axiosMock.onPut('/api/article').reply(200, {
                id: 17,
                title: "pls",
                url: "https://my.sa.ucsb.edu/gold/login.aspx",
                explanation: "testing url  C C",
                email: "hansonyu@ucsb.edu  C C",
                dateAdded: "2022-01-00T00:00"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticleEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticleEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("ArticleForm-id")).toBeInTheDocument());

            const idField = getByTestId("ArticleForm-id");
            const titleField = getByTestId("ArticleForm-title");
            const urlField = getByTestId("ArticleForm-url");
            const explanationField = getByTestId("ArticleForm-explanation");
            const emailField = getByTestId("ArticleForm-email");
            const dateAddedField = getByTestId("ArticleForm-dateAdded");

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("salon");
            expect(urlField).toHaveValue("https://my.sa.ucsb.edu/gold/login.aspx  C C C");
            expect(explanationField).toHaveValue("testing url  C C");
            expect(emailField).toHaveValue("hansonyu@ucsb.edu  C C");
            expect(dateAddedField).toHaveValue("2022-01-02T00:11");
        });

        test("Changes when you click Update", async () => {

            const { getByTestId, getByText } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticleEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("ArticleForm-id")).toBeInTheDocument());

            const idField = getByTestId("ArticleForm-id");
            const titleField = getByTestId("ArticleForm-title");
            const urlField = getByTestId("ArticleForm-url");
            const explanationField = getByTestId("ArticleForm-explanation");
            const emailField = getByTestId("ArticleForm-email");
            const dateAddedField = getByTestId("ArticleForm-dateAdded");

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("salon");
            expect(urlField).toHaveValue("https://my.sa.ucsb.edu/gold/login.aspx  C C C");
            expect(explanationField).toHaveValue("testing url  C C");
            expect(emailField).toHaveValue("hansonyu@ucsb.edu  C C");
            expect(dateAddedField).toHaveValue("2022-01-02T00:11");
           
            const submitButton = getByText("Update");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(titleField, { target: { value: 'pls' } })
            fireEvent.change(urlField, { target: { value: 'https://my.sa.ucsb.edu/gold/login.aspx' } })
            fireEvent.change(explanationField, { target: { value: 'testing url  C C'  } })
            fireEvent.change(emailField, { target: { value: 'hansonyu@ucsb.edu  C C'  } })
            fireEvent.change(dateAddedField, { target: { value: '2022-01-00T00:00'  } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Article Updated - id: 17 title: pls");
            expect(mockNavigate).toBeCalledWith({ "to": "/article/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                title: "pls",
                url: "https://my.sa.ucsb.edu/gold/login.aspx",
                explanation: "testing url  C C",
                email: "hansonyu@ucsb.edu  C C",
                dateAdded: "2022-01-00T00:00"
            })); // posted object

        });

       
    });
});