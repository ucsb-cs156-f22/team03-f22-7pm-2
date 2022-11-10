import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { onDeleteSuccess } from "main/utils/HelpRequestsUtils"
// import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";
import { cellToAxiosParamsDelete } from "main/utils/HelpRequestsUtils";


export default function HelpRequestsTable({ helpRequests, currentUser }) {

    // const navigate = useNavigate();

    // const editCallback = (cell) => {
    //     navigate(`/helpRequest/edit/${cell.row.values.id}`)
    // }

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/helprequest/all"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const columns = [
        {
            Header: 'ID',
            accessor: 'id', 
        },
        {
            Header: 'Email',
            accessor: 'requesterEmail',
        },
        {
            Header: "Explanation",
            accessor: "explanation",
        },
        {
            Header: "Table or breakout room",
            accessor: "tableOrBreakoutRoom",
        },
        {
            Header: "Team ID",
            accessor: "teamId",
        },
        {
            Header: 'Date',
            accessor: 'requestTime',
        },
        {
            Header: 'Solved?',
            id: 'solved', // needed for tests
            accessor: (row, _rowIndex) => String(row.solved) // hack needed for boolean values to show up
        }
    ];

    // const testid = "HelpRequestsTable";

    const columnsIfAdmin = [
        ...columns,
        // ButtonColumn("Edit", "primary", editCallback, testid),
        ButtonColumn("Delete", "danger", deleteCallback, "HelpRequestsTable")
    ];

    const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN") ? columnsIfAdmin : columns;

    return <OurTable
        data={helpRequests}
        columns={columnsToDisplay}
        testid={"HelpRequestsTable"}
    />;
};