import { render, waitFor, fireEvent } from "@testing-library/react";
import ArticleCreatePage from "main/pages/Article/ArticleCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";


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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});


describe("ArticleCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const article = {
            "id": 17,
            "title": "hello",
            "url": "https://my.sa.ucsb.edu/gold/login.aspx",
            "explanation": "testing url",
            "email": "hansonyu@ucsb.edu",
            "dateAdded": "2022-01-02T00:00"
        };

        axiosMock.onPost("/api/article/post").reply( 202, article );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("ArticleForm-title")).toBeInTheDocument();
        });

        const titleField = getByTestId("ArticleForm-title");
        const urlField = getByTestId("ArticleForm-url");
        const explanationField = getByTestId("ArticleForm-explanation");
        const emailField = getByTestId("ArticleForm-email");
        const dateAddedField = getByTestId("ArticleForm-dateAdded");

        const submitButton = getByTestId("ArticleForm-submit");

        fireEvent.change(titleField, { target: { value: 'hello' } });
        fireEvent.change(urlField, { target: { value: 'https://my.sa.ucsb.edu/gold/login.aspx' } });
        fireEvent.change(explanationField, { target: { value: 'testing url' } });
        fireEvent.change(emailField, { target: { value: 'hansonyu@ucsb.edu' } }); 
        fireEvent.change(dateAddedField, { target: { value: '2022-01-02T00:00' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "title": "hello",
            "dateAdded": "2022-01-02T00:00",
            "email": "hansonyu@ucsb.edu",
            "explanation": "testing url",
            "url": "https://my.sa.ucsb.edu/gold/login.aspx"
        });

        expect(mockToast).toBeCalledWith("New article Created - id: 17 title: hello");
        expect(mockNavigate).toBeCalledWith({ "to": "/article/list" });
    });


});


