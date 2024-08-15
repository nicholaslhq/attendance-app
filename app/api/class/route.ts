import { usePathname } from "next/navigation";
import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { name, description, createdBy, handleBy } = await req.json();

        // Check if required fields are provided
		if (!name) {
			return NextResponse.json({
				error: "One or more required fields are null or undefined",
				status: 400,
			});
		}

        // Create a new class entry in the database
		const newClass = await prisma.class.create({
			data: {
				name,
				description,
				createdBy,
				handleBy,
				deleted: false,
			},
		});

		return NextResponse.json(newClass);
	} catch (error) {
		console.log("ERROR ADDING CLASS: ", error);
		return NextResponse.json({ error: "ERROR ADDING CLASS", status: 500 });
	}
}

export async function GET(req: Request) {
	try {
        // Fetch all classes from the database
		const classes = await prisma.class.findMany({
			where: {
				deleted: false,
			},
		});

        // Retrieve class details along with student count for each class
		const classesDetails = await Promise.all(
			classes.map(async (classItem) => {
				const studentCount = await prisma.student.count({
					where: {
						deleted: false,
						AND: [{ classId: { equals: classItem.id } }],
					},
				});

                // If class is not handled by anyone, set handleName to null
				if (!classItem.handleBy) {
					return {
						...classItem,
						handleName: null,
						studentCount,
					};
				}

                // Fetch handle name for the class from the database
				const handleData = await prisma.user.findUnique({
					where: {
						deleted: false,
						id: classItem.handleBy,
					},
					select: {
						name: true,
					},
				});

				const handleName = handleData?.name || null;

				return {
					...classItem,
					handleName: handleName,
					studentCount,
				};
			})
		);

		return NextResponse.json(classesDetails);
	} catch (error) {
		console.log("ERROR GETTING CLASS: ", error);
		return NextResponse.json({ error: "ERROR GETTING CLASS", status: 500 });
	}
}

export async function PUT(req: Request) {
	try {
		const { id, name, description, handleBy } = await req.json();

        // Check if required fields are provided
		if (!id || !name) {
			return NextResponse.json({
				error: "One or more required fields are null or undefined",
				status: 400,
			});
		}

        // Update class details in the database
		const updatedClass = await prisma.class.update({
			where: {
				id,
			},
			data: {
				name,
				description,
				handleBy,
			},
		});

		return NextResponse.json(updatedClass);
	} catch (error) {
		console.log("ERROR UPDATING CLASS: ", error);
		return NextResponse.json({
			error: "ERROR UPDATING CLASS",
			status: 500,
		});
	}
}
