import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";

export async function GET(request: Request) {
    // Attempt to retrieve the server session
	const session = await getServerSession(authOptions);

    // If no session exists, return an unauthorized response
	if (!session) {
		return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
			status: 401,
		});
	}

    // If a session exists, return a JSON response indicating authentication
	return NextResponse.json({ authenticated: !!session });
}
