import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params;

	try {
        // Fetch attendance data from the database using the provided id
		const attendance = await prisma.attendanceList.findFirst({
			where: {
				id: id,
			},
		});

        // If attendance data does not exist, return a JSON response with error message and status code 404
		if (!attendance) {
			return NextResponse.json({
				error: "Attendance not found",
				status: 404,
			});
		}

        // Initialize variables to store student names
		let studentEName = null;
		let studentCName = null;
		let studentBName = null;

        // If studentId exists in attendance data, fetch student details from the database
		if (attendance.studentId) {
			const student = await prisma.student.findUnique({
				where: {
					id: attendance.studentId,
				},
				select: {
					eName: true,
					cName: true,
					bName: true,
				},
			});

            // Assign student names if student data exists, otherwise assign null
			studentEName = student?.eName || null;
			studentCName = student?.cName || null;
			studentBName = student?.bName || null;
		}

        // Construct attendance details object with additional student names
		const attendanceDetails = {
			...attendance,
			eName: studentEName,
			cName: studentCName,
			bName: studentBName,
		};

		return NextResponse.json(attendanceDetails);
	} catch (error) {
		console.log("ERROR GETTING ATTENDANCE LIST: ", error);
		return NextResponse.json({
			error: "ERROR GETTING ATTENDANCE LIST",
			status: 500,
		});
	}
}
