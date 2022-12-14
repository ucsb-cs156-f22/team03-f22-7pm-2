import {  render } from "@testing-library/react";
import { diningCommonsMenuItemFixtures } from "fixtures/diningCommonsMenuItemFixtures";
import DiningCommonsMenuItemTable from "main/components/DiningCommonsMenuItem/DiningCommonsMenuItemTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


// export function cellToAxiosParamsDelete(cell) {
//   return {
//       url: "/api/ucsbdiningcommonsmenuitem",
//       method: "DELETE",
//       params: {
//           id: cell.row.values.id
//       }
//   }
// }


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("DiningCommonsMenuItemTable tests", () => {
  const queryClient = new QueryClient();


  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DiningCommonsMenuItemTable diningCommonsMenuItem={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DiningCommonsMenuItemTable diningCommonsMenuItem={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DiningCommonsMenuItemTable diningCommonsMenuItem={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });


    // test("Delete returns the correct params", () => {
    //     // arrange
    //     const cell = { row: { values: { id: 17 } } };

    //     // act
    //     const result = cellToAxiosParamsDelete(cell);

    //     // assert
    //     expect(result).toEqual({
    //         url: "/api/ucsbdiningcommonsmenuitem",
    //         method: "DELETE",
    //         params: { id: 17 }
    //     });
    // });


  test("Has the expected column headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DiningCommonsMenuItemTable diningCommonsMenuItem={diningCommonsMenuItemFixtures.threediningCommonsMenuItems} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );


    const expectedHeaders = ['id',  'Dining Common Code', 'Name','Station'];
    const expectedFields = ['id', 'diningCommonsCode','name', 'station'];
    const testId = "DiningCommonsMenuItemTable";

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
    expect(getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Burrito");
    expect(getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("Pizza");

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
  //         <UCSBDatesTable diningCommons={ucsbDatesFixtures.threeDates} currentUser={currentUser} />
  //       </MemoryRouter>
  //     </QueryClientProvider>

  //   );

  //   await waitFor(() => { expect(getByTestId(`UCSBDatesTable-cell-row-0-col-id`)).toHaveTextContent("1"); });

  //   const editButton = getByTestId(`UCSBDatesTable-cell-row-0-col-Edit-button`);
  //   expect(editButton).toBeInTheDocument();
    
  //   fireEvent.click(editButton);

  //   await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/ucsbdates/edit/1'));

  // });


});

