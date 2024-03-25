"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { Item } from "./item";
import { Home, User2 } from "lucide-react";

export const List = () => {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (!userMemberships.data?.length) {
    return null;
  }
  return (
    <ul className="space-y-1 space-x-4 mt-4">
      <Item label="Your teamspaces" icon={User2} />{" "}
      {userMemberships.data?.map((membership) => (
        <div key={membership.organization.id}>
          <Item label={membership.organization.name} icon={Home} />
        </div>
      ))}
    </ul>
  );
};
