import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { eName, cName, bName, gender, createdBy, classId } =
			await req.json();

		// Check if required fields are provided
		if (!eName) {
			return NextResponse.json({
				error: "One or more required fields are null or undefined",
				status: 400,
			});
		}

		// Create a new student record in the database
		const student = await prisma.student.create({
			data: {
				eName,
				cName,
				bName,
				gender,
				createdBy,
				classId,
				deleted: false,
			},
		});

		return NextResponse.json(student);
	} catch (error) {
		console.log("ERROR ADDING STUDENT: ", error);
		return NextResponse.json({
			error: "ERROR ADDING STUDENT",
			status: 500,
		});
	}
}

export async function GET(req: Request) {
	try {
		// Fetch all students from the database
		const students = await prisma.student.findMany({
			where: {
				deleted: false,
			},
		});

		// Retrieve class details for each student and construct student details with class name
		const studentDetails = await Promise.all(
			students.map(async (student) => {
				if (!student.classId) return { ...student, className: null };

				// Fetch class data for the student
				const classData = await prisma.class.findUnique({
					where: {
						deleted: false,
						id: student.classId,
					},
					select: {
						name: true,
					},
				});

				const className = classData?.name || null;

				return {
					...student,
					className: className,
				};
			})
		);

		return NextResponse.json(studentDetails);
	} catch (error) {
		console.log("ERROR GETTING STUDENT: ", error);
		return NextResponse.json({
			error: "ERROR GETTING STUDENT",
			status: 500,
		});
	}
}

export async function PUT(req: Request) {
	try {
		const { id, eName, cName, bName, gender, createdBy, classId } =
			await req.json();

		// Check if required fields are provided
		if (!id || !eName) {
			return NextResponse.json({
				error: "One or more required fields are null or undefined",
				status: 400,
			});
		}

		// Update student record in the database
		const student = await prisma.student.update({
			where: {
				id,
			},
			data: {
				eName,
				cName,
				bName,
				gender,
				createdBy,
				classId,
			},
		});

		return NextResponse.json(student);
	} catch (error) {
		console.log("ERROR UPDATING STUDENT: ", error);
		return NextResponse.json({
			error: "ERROR UPDATING STUDENT",
			status: 500,
		});
	}
}
