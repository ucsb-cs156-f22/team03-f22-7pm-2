// import { render } from "@testing-library/react";
import { fireEvent, render, waitFor } from "@testing-library/react";

import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import DiningCommonsMenuItemIndexPage from "main/pages/DiningCommonsMenuItem/DiningCommonsMenuItemIndexPage";


import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { diningCommonsMenuItemFixtures } from "fixtures/diningCommonsMenuItemFixtures";
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

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("DiningCommonsMenuItemIndexPage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    const testId = "DiningCommonsMenuItemTable"

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("renders without crashing for regular user", () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        // axiosMock.onGet("/api/DiningCommonsMenuItem/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DiningCommonsMenuItemIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

    });

    test("renders without crashing for admin user", () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        // axiosMock.onGet("/api/ucsbdiningcommonsmenuitem/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DiningCommonsMenuItemIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

    });

    test("test what happens when you click delete, admin", async () => {
        setupAdminUser();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/ucsbdiningcommonsmenuitem/all").reply(200, diningCommonsMenuItemFixtures.threediningCommonsMenuItems);
        axiosMock.onDelete("/api/ucsbdiningcommonsmenuitem", {params: {id: 1}}).reply(200, "DiningCommonsMenuItem with id 1 was deleted");


        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DiningCommonsMenuItemIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

       expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); 


        const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
       
        fireEvent.click(deleteButton);

        await waitFor(() => { expect(mockToast).toBeCalledWith("DiningCommonsMenuItem with id 1 was deleted") });

    });


});