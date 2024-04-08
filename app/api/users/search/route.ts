import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text");

  const currentAuthenticatedUser = await currentUser();
  if (!currentAuthenticatedUser) {
    return NextResponse.json([]);
  }

  // Implement your own logic to search for users based on the `text` query parameter
  // For simplicity, this example returns only the current user's ID
  const userIds = [currentAuthenticatedUser.id];

  return NextResponse.json(userIds);
}
