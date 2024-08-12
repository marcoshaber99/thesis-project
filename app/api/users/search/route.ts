import { NextResponse } from "next/server";
import { clerkClient, auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text");
  const roomId = searchParams.get("roomId");

  if (!roomId) {
    return new NextResponse("Missing roomId", { status: 400 });
  }

  const { orgId } = await auth();

  if (!orgId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const memberships =
      await clerkClient.organizations.getOrganizationMembershipList({
        organizationId: orgId,
      });

    const userIds = memberships
      .filter(
        (membership) =>
          membership.publicUserData?.firstName
            ?.toLowerCase()
            .includes(text?.toLowerCase() || "") ||
          membership.publicUserData?.lastName
            ?.toLowerCase()
            .includes(text?.toLowerCase() || "")
      )
      .map((membership) => membership.publicUserData?.userId as string);

    return NextResponse.json(userIds);
  } catch (error) {
    console.error("Error searching for users:", error);
    return new NextResponse("Error searching for users", { status: 500 });
  }
}
