import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/UCSBOrganizationsUtils"
// import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBOrganizationsTable({ organizations, currentUser }) {

    // const navigate = useNavigate();

    // const editCallback = (cell) => {
    //     navigate(`/UCSBOrganizations/edit/${cell.row.values.id}`)
    // }

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/UCSBOrganization/all"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }



    const columns = [
        {
            Header: 'Code',
            accessor: 'orgCode', // accessor is the "key" in the data
        },
        {
            Header: 'Short Translation',
            accessor: 'orgTranslationShort',
        },
        {
            Header: 'Full Translation',
            accessor: 'orgTranslation',
        },
        {
            Header: 'Inactive?',
            id : 'inactive', // needed for tests
            accessor: (row, _rowIndex) => String(row.inactive) // to show boolean values
        }
    ];

    const testid = "UCSBOrganizationsTable";

    const columnsIfAdmin = [
        ...columns,
        // ButtonColumn("Edit", "primary", editCallback, "UCSBDatesTable")
        ButtonColumn("Delete", "danger", deleteCallback, testid)
    ];

    const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN") ? columnsIfAdmin : columns;


    return <OurTable
        data={organizations}
        columns={columnsToDisplay}
        testid={testid}
    />;
};