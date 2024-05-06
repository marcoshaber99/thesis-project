"use client";

import { connectionIdToColor } from "@/lib/utils";
import { useOthers, useSelf } from "@/liveblocks.config";
import { UserAvatar } from "./avatar";

const MAX_SHOWN_USERS = 2;

export const Participants = ({
  organizationId,
}: {
  organizationId?: string;
}) => {
  const users = useOthers();
  const currentUser = useSelf();

  // Filter users based on the organization ID
  const organizationMembers = users.filter(
    (user) => user.info?.organizationId === organizationId
  );

  const hasMoreUsers = organizationMembers.length > MAX_SHOWN_USERS;

  return (
    <div className="flex items-center gap-x-2">
      {organizationMembers
        .slice(0, MAX_SHOWN_USERS)
        .map(({ connectionId, info }) => {
          return (
            <UserAvatar
              borderColor={connectionIdToColor(connectionId)}
              key={connectionId}
              src={info?.picture}
              name={info?.name}
              fallback={info?.name?.[0] || "T"}
            />
          );
        })}

      {currentUser && currentUser.info?.organizationId === organizationId && (
        <UserAvatar
          borderColor={connectionIdToColor(currentUser.connectionId)}
          src={currentUser.info?.picture}
          name={`${currentUser.info?.name} (You)`}
          fallback={currentUser.info?.name?.[0]}
        />
      )}

      {hasMoreUsers && (
        <UserAvatar
          name={`${organizationMembers.length - MAX_SHOWN_USERS} more`}
          fallback={`+${organizationMembers.length - MAX_SHOWN_USERS}`}
        />
      )}
    </div>
  );
};

// ...
