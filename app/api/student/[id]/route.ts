import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params;

	try {
        // Fetch student with the specified ID
		const student = await prisma.student.findFirst({
			where: {
				id: id,
				deleted: false,
			},
		});

        // Check if student exists
		if (!student) {
			return NextResponse.json({
				error: "Student not found",
				status: 404,
			});
		}

		let className = null;

        // If student is associated with a class, fetch class data
		if (student.classId) {
			const classData = await prisma.class.findUnique({
				where: {
					deleted: false,
					id: student.classId,
				},
				select: {
					name: true,
				},
			});

			className = classData?.name || null;
		}

        // Construct student details with class name
		const studentDetails = {
			...student,
			className: className,
		};

		return NextResponse.json(studentDetails);
	} catch (error) {
		console.log("ERROR GETTING STUDENT: ", error);
		return NextResponse.json({
			error: "ERROR GETTING STUDENT",
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

        // Update student with the specified ID to set deleted flag to true
		const student = await prisma.student.update({
			where: {
				id,
			},
			data: {
				deleted: true,
			},
		});

		return NextResponse.json(student);
	} catch (error) {
		console.log("ERROR DELETING STUDENT: ", error);
		return NextResponse.json({
			error: "ERROR DELETING STUDENT",
			status: 500,
		});
	}
}
