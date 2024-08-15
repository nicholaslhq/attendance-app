import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { date: string; classId: string; sessionId: string } }
) {
	const { date, classId, sessionId } = params;

	try {
		// Decode the DateTime value from the URL parameter
		const dateTimeValue = new Date(decodeURIComponent(date));

		// Fetch attendance data from the database
		const attendance = await prisma.attendance.findFirst({
			where: {
				date: dateTimeValue,
				classId,
				sessionId,
			},
		});

		// Check if attendance data exists
		if (!attendance || !attendance.id) {
			return NextResponse.json({
				error: "NO ATTENDANCE LIST FOUND",
				status: 500,
			});
		}

		// Fetch attendance list data from the database
		const attendanceList = await prisma.attendanceList.findMany({
			where: {
				attendanceId: attendance.id,
			},
		});

		// Initialize an array to store attendance details
		const attendanceDetails = [];

		// Initialize count variables for present, absent, and on leave
		let presentCount = 0;
		let absentCount = 0;
		let onLeaveCount = 0;

		// Iterate through each item in the attendance list
		for (const item of attendanceList) {
			// Increment the count based on the status
			switch (item.status) {
				case "PRESENT":
					presentCount++;
					break;
				case "ABSENT":
					absentCount++;
					break;
				case "ONLEAVE":
					onLeaveCount++;
					break;
				default:
					break;
			}

			let eName = null;
			let cName = null;
			let bName = null;

			// Fetch student data from the database
			const student = await prisma.student.findUnique({
				where: {
					id: item.studentId,
				},
			});

			// If student data exists, extract relevant fields
			if (student) {
				eName = student.eName || null;
				cName = student.cName || null;
				bName = student.bName || null;
			}

			// Construct attendance item with additional student details
			const attendanceItem = {
				...item,
				eName: eName,
				cName: cName,
				bName: bName,
			};

			// Push attendance item to the attendance details array
			attendanceDetails.push(attendanceItem);
		}

		// Construct response object with attendance details and counts
		const attendanceDetailsWithCount = {
			...attendanceDetails,
			presentCount,
			absentCount,
			onLeaveCount,
		};

		return NextResponse.json(attendanceDetailsWithCount);
	} catch (error) {
		console.log("ERROR GETTING ATTENDANCE LIST: ", error);
		return NextResponse.json({
			error: "ERROR GETTING ATTENDANCE LIST",
			status: 500,
		});
	}
}
