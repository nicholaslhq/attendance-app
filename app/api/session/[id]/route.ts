import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params;

	try {
        // Fetch session with the specified ID
		const session = await prisma.session.findFirst({
			where: {
				id: id,
				deleted: false,
			},
		});

		return NextResponse.json(session);
	} catch (error) {
		console.log("ERROR GETTING SESSION: ", error);
		return NextResponse.json({
			error: "ERROR GETTING SESSION",
			status: 500,
		});
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;

		// Update session with the specified ID to set deleted flag to true
		const session = await prisma.session.update({
			where: {
				id,
			},
			data: {
				deleted: true,
			},
		});

		return NextResponse.json(session);
	} catch (error) {
		console.log("ERROR DELETING SESSION: ", error);
		return NextResponse.json({
			error: "ERROR DELETING SESSION",
			status: 500,
		});
	}
}
