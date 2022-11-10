import React from 'react';

import UCSBOrganizationsTable from "main/components/UCSBOrganizations/UCSBOrganizationsTable";
import { ucsbOrganizationsFixtures } from 'fixtures/ucsbOrganizationsFixtures';

export default {
    title: 'components/UCSBOranizations/UCSBOrganizationsTable',
    component: UCSBOrganizationsTable
};

const Template = (args) => {
    return (
        <UCSBOrganizationsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    organizations: []
};

export const threeOrganizations = Template.bind({});

threeOrganizations.args = {
    organizations: ucsbOrganizationsFixtures.threeOrganizations
};


