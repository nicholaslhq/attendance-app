import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params;

    // Find the user based on the provided ID
	try {
		const user = await prisma.user.findFirst({
			where: {
				id: id,
				deleted: false,
			},
		});

		return NextResponse.json(user);
	} catch (error) {
		console.log("ERROR GETTING USER: ", error);
		return NextResponse.json({ error: "ERROR GETTING USER", status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;

        // Update the user's 'deleted' field to true
		const user = await prisma.user.update({
			where: {
				id,
			},
			data: {
				deleted: true,
			},
		});

		return NextResponse.json(user);
	} catch (error) {
		console.log("ERROR DELETING USER: ", error);
		return NextResponse.json({ error: "ERROR DELETING USER", status: 500 });
	}
}

export async function PUT(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;

        // Find the user based on the provided ID
		const currentUser = await prisma.user.findUnique({
			where: {
				id,
			},
		});

        // Return error response if user not found
		if (!currentUser) {
			return NextResponse.json({ error: "User not found", status: 404 });
		}

        // Toggle the user's mode
		const updatedMode = currentUser.mode == "0" ? "1" : "0";

        // Update the user's mode in the database
		const user = await prisma.user.update({
			where: {
				id,
			},
			data: {
				mode: updatedMode,
			},
		});

		return NextResponse.json(user);
	} catch (error) {
		console.log("ERROR UPDATING MODE: ", error);
		return NextResponse.json({ error: "ERROR UPDATING MODE", status: 500 });
	}
}
