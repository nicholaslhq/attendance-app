import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params;

	try {
        // Fetch class details from the database based on the provided id
		const classes = await prisma.class.findFirst({
			where: {
				id: id,
				deleted: false,
			},
		});

        // If class details are not found, return an error response
		if (!classes) {
			return NextResponse.json({
				error: "ERROR GETTING CLASS",
				status: 500,
			});
		}

		let handleName = null;

        // If handleBy exists in class details, fetch handle user's name from the database
		if (classes.handleBy) {
			const handleData = await prisma.user.findUnique({
				where: {
					deleted: false,
					id: classes.handleBy,
				},
				select: {
					name: true,
				},
			});

			handleName = handleData?.name || null;
		}

        // Construct class details object with additional handle name
		const classDetails = {
			...classes,
			handleName: handleName,
		};

		return NextResponse.json(classDetails);
	} catch (error) {
		console.log("ERROR GETTING CLASS: ", error);
		return NextResponse.json({ error: "ERROR GETTING CLASS", status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;

        // Mark the class as deleted in the database
		const deleteClass = await prisma.class.update({
			where: {
				id,
			},
			data: {
				deleted: true,
			},
		});

		return NextResponse.json(deleteClass);
	} catch (error) {
		console.log("ERROR DELETING CLASS: ", error);
		return NextResponse.json({
			error: "ERROR DELETING CLASS",
			status: 500,
		});
	}
}
