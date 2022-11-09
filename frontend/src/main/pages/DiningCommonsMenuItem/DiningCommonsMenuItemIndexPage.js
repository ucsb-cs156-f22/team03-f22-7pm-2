// import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

// export default function DiningCommonsMenuItemIndexPage() {
//   return (
//     <BasicLayout>
//       <div className="pt-2">
//         <h1>Dining Commons Menu Item</h1>
//         <p>
//           This is where the index page will go
//         </p>
//       </div>
//     </BasicLayout>
//   )
// }

import React from 'react'
import { useBackend } from 'main/utils/useBackend'; // use prefix indicates a React Hook

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import DiningCommonsMenuItemTable from 'main/components/DiningCommonsMenuItem/DiningCommonsMenuItemTable';
import { useCurrentUser } from 'main/utils/currentUser' // use prefix indicates a React Hook

export default function DiningCommonsMenuItemIndexPage() {

  const currentUser = useCurrentUser();

  const { data: dates, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/diningcommonsmenuitem/all"],
            // Stryker disable next-line StringLiteral,ObjectLiteral : since "GET" is default, "" is an equivalent mutation
            { method: "GET", url: "/api/diningcommsmenuitem/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>UCSBDates</h1>
        <DiningCommonsMenuItemTable dates={dates} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}