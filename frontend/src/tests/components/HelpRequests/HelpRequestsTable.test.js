import { fireEvent, render, waitFor } from "@testing-library/react";
import { helpRequestsFixtures } from "fixtures/helpRequestsFixtures";
import HelpRequestsTable from "main/components/HelpRequests/HelpRequestsTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

const mockToast = jest.fn();

jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("HelpRequestsTable tests", () => {
  const queryClient = new QueryClient();
  const axiosMock = new AxiosMockAdapter(axios);


  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsTable helpRequests={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsTable helpRequests={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsTable helpRequests={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("Has the expected column headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsTable helpRequests={helpRequestsFixtures.threeRequests} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ['ID', 'Email', 'Explanation', 'Table or breakout room', 'Team ID', 'Date', 'Solved?'];
    const expectedFields = ['id', 'requesterEmail', 'explanation', 'tableOrBreakoutRoom', 'teamId', 'requestTime', 'solved'];

    const testId = "HelpRequestsTable";

    expectedHeaders.forEach((headerText) => {
      const header = getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
    expect(getByTestId(`${testId}-cell-row-0-col-requesterEmail`)).toHaveTextContent("dgaucho@ucsb.edu");
    expect(getByTestId(`${testId}-cell-row-1-col-requesterEmail`)).toHaveTextContent("egaucho@ucsb.edu");

    // const editButton = getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    // expect(editButton).toBeInTheDocument();
    // expect(editButton).toHaveClass("btn-primary");

    const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  // test("Edit button navigates to the edit page for admin user", async () => {

  //   const currentUser = currentUserFixtures.adminUser;

  //   const { getByTestId } = render(
  //     <QueryClientProvider client={queryClient}>
  //       <MemoryRouter>
  //         <HelpRequestsTable helpRequests={helpRequestsFixtures.threeRequests} currentUser={currentUser} />
  //       </MemoryRouter>
  //     </QueryClientProvider>

  //   );

  //   await waitFor(() => { expect(getByTestId(`HelpRequestsTable-cell-row-0-col-id`)).toHaveTextContent("1"); });

  //   const editButton = getByTestId(`HelpRequestsTable-cell-row-0-col-Edit-button`);
  //   expect(editButton).toBeInTheDocument();
    
  //   fireEvent.click(editButton);

  //   await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/helpRequest/edit/1'));

  // });

  test("Delete button properly calls callback", async () => {

    const currentUser = currentUserFixtures.adminUser;

    axiosMock.onGet("/api/helprequest/all").reply(200, helpRequestsFixtures.threeRequests);
    axiosMock.onDelete("/api/helprequest").reply(200, "HelpRequest with id 1 was deleted");

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsTable helpRequests={helpRequestsFixtures.threeRequests} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(getByTestId(`HelpRequestsTable-cell-row-0-col-id`)).toHaveTextContent("1"); });

    const deleteButton = getByTestId(`HelpRequestsTable-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    
    fireEvent.click(deleteButton);

    await waitFor(() => { expect(mockToast).toBeCalledWith("HelpRequest with id 1 was deleted") });
  });

});

