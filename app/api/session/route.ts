import { usePathname } from "next/navigation";
import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { name, description, createdBy } = await req.json();

        // Check if required field is provided
		if (!name) {
			return NextResponse.json({
				error: "One or more required fields are null or undefined",
				status: 400,
			});
		}

        // Create a new session
		const session = await prisma.session.create({
			data: {
				name,
				description,
				createdBy,
				deleted: false,
			},
		});

		return NextResponse.json(session);
	} catch (error) {
		console.log("ERROR ADDING SESSION: ", error);
		return NextResponse.json({
			error: "ERROR ADDING SESSION",
			status: 500,
		});
	}
}

export async function GET(req: Request) {
	try {
        // Fetch all sessions that are not deleted
		const sessions = await prisma.session.findMany({
			where: {
				deleted: false,
			},
		});

		return NextResponse.json(sessions);
	} catch (error) {
		console.log("ERROR GETTING SESSION: ", error);
		return NextResponse.json({
			error: "ERROR GETTING SESSION",
			status: 500,
		});
	}
}

export async function PUT(req: Request) {
	try {
		const { id, name, description } = await req.json();

        // Check if required fields are provided
		if (!id || !name) {
			return NextResponse.json({
				error: "One or more required fields are null or undefined",
				status: 400,
			});
		}

        // Update the session with the provided ID
		const session = await prisma.session.update({
			where: {
				id,
			},
			data: {
				name,
				description,
			},
		});

		return NextResponse.json(session);
	} catch (error) {
		console.log("ERROR UPDATING SESSION: ", error);
		return NextResponse.json({
			error: "ERROR UPDATING SESSION",
			status: 500,
		});
	}
}
