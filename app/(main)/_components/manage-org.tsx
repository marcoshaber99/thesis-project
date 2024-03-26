"use client";

import { OrganizationSwitcher } from "@clerk/nextjs";

export const ManageOrganizations = () => {
  return (
    <OrganizationSwitcher
      afterLeaveOrganizationUrl="/documents"
      afterCreateOrganizationUrl="/documents"
      hidePersonal
      appearance={{
        elements: {
          rootBox: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "10px",
            marginTop: "10px",
          },
          organizationSwitcherTrigger: {
            borderRadius: "10px",
            border: "1px solid #E5E7EB",
            justifyContent: "space-between",
            backgroundColor: "white",
          },
        },
      }}
    />
  );
};
