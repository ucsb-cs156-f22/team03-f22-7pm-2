import OurTable from "main/components/OurTable";
//import { useBackendMutation } from "main/utils/useBackend";
//import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/UCSBDateUtils"
//import { useNavigate } from "react-router-dom";
//import { hasRole } from "main/utils/currentUser";

export default function RecommendationsTable({ recommendations, _currentUser }) {

    //const navigate = useNavigate();

    //const editCallback = (cell) => {
    //    navigate(`/ucsbdates/edit/${cell.row.values.id}`)
    //}

    // Stryker disable all : hard to test for query caching
    //const deleteMutation = useBackendMutation(
    //    cellToAxiosParamsDelete,
    //    { onSuccess: onDeleteSuccess },
    //    ["/api/ucsbdates/all"]
    //);
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    //const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    //"dateNeeded": "2022-11-10T03:43:31.454Z",
    //"dateRequested": "2022-11-10T03:43:31.454Z",
    //"done": true,
    //"explanation": "string",
    //"id": 0,
    //"professorEmail": "string",
    //"requesterEmail": "string"

    const columns = [
        {
            Header: 'Date Needed',
            accessor: 'dateNeeded', // accessor is the "key" in the data
        },
        {
            Header: 'Date Requested',
            accessor: 'dateRequested',
        },
        {
            Header: 'Done?',
            accessor: 'done',
            accessor: (row, _rowIndex) => String(row.done),
        },
        {
            Header: 'Explanation',
            accessor: 'explanation',
        },
        {
            Header: 'Id',
            accessor: 'id',
        },
        {
            Header: 'Professor Email',
            accessor: 'professorEmail',
        },
        {
            Header: 'Requester Email',
            accessor: 'requesterEmail',
        }
    ];

    //const columnsIfAdmin = [
    //    ...columns,
    //    ButtonColumn("Edit", "primary", editCallback, "UCSBDatesTable"),
    //    ButtonColumn("Delete", "danger", deleteCallback, "UCSBDatesTable")
    //];

    //const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN") ? columnsIfAdmin : columns;
    const columnsToDisplay = columns;

    return <OurTable
        data={recommendations}
        columns={columnsToDisplay}
        testid={"RecommendationsTable"}
    />;
};