import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userIds = searchParams.getAll("userIds");

  if (!userIds || !Array.isArray(userIds)) {
    return new NextResponse("Missing or invalid userIds", { status: 400 });
  }

  const users = await Promise.all(
    userIds.map(async (userId) => {
      try {
        const user = await clerkClient.users.getUser(userId);
        return {
          id: user.id,
          name: user.firstName || "Anonymous",
          avatar: user.imageUrl,
        };
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    })
  );

  return NextResponse.json(users.filter(Boolean));
}
