import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{
		params,
	}: {
		params: {
			start: string;
			end: string;
		};
	}
) {
	const { start, end } = params;

	try {
		// Decode the DateTime value from the URL parameter
		const startDate = new Date(decodeURIComponent(start));
		const endDate = new Date(decodeURIComponent(end));

		// Initialize count variables for present, absent, and on leave
		let presentTotalCount = 0;
		let absentTotalCount = 0;
		let onLeaveTotalCount = 0;

		// Fetch all attendance records within the specified date range
		const attendance = await prisma.attendance.findMany({
			where: {
				date: {
					gte: startDate,
					lte: endDate,
				},
			},
		});

		// Check if attendance records exist
		if (!attendance.length) {
			return NextResponse.json({
				error: "NO INSIGHT FOUND",
				status: 500,
			});
		}

		// Map to store student insights
		const studentMap = new Map();

		// Process each attendance record
		for (const a of attendance) {
			// Fetch attendance lists for each attendance record
			const attendanceList = await prisma.attendanceList.findMany({
				where: {
					attendanceId: a.id,
				},
			});

			for (const item of attendanceList) {
				let studentInsight = studentMap.get(item.studentId);

				// If student insight doesn't exist, initialize it
				if (!studentInsight) {
					studentInsight = {
						eName: "",
						cName: "",
						bName: "",
						presentCount: 0,
						absentCount: 0,
						onLeaveCount: 0,
					};
				}

				// Update counts based on status
				switch (item.status) {
					case "PRESENT":
						studentInsight.presentCount++;
						presentTotalCount++;
						break;
					case "ABSENT":
						studentInsight.absentCount++;
						absentTotalCount++;
						break;
					case "ONLEAVE":
						studentInsight.onLeaveCount++;
						onLeaveTotalCount++;
						break;
					default:
						break;
				}

				// Update student data if not already updated
				if (!studentInsight.eName) {
					const student = await prisma.student.findUnique({
						where: {
							id: item.studentId,
							deleted: false,
						},
					});

					if (student) {
						studentInsight.eName = student.eName;
						studentInsight.cName = student.cName || "";
						studentInsight.bName = student.bName || "";
					}
				}

				// Update student insight in the map
				studentMap.set(item.studentId, studentInsight);
			}
		}

		// Convert student map to array of insights
		const insights = Array.from(studentMap.values()).map(
			(studentInsight) => ({
				studentId: studentInsight.studentId,
				eName: studentInsight.eName,
				cName: studentInsight.cName,
				bName: studentInsight.bName,
				totalCount:
					studentInsight.presentCount +
					studentInsight.absentCount +
					studentInsight.onLeaveCount,
				presentCount: studentInsight.presentCount,
				absentCount: studentInsight.absentCount,
				onLeaveCount: studentInsight.onLeaveCount,
			})
		);

		// Construct response object with attendance details and counts
		const insightsWithCount = {
			...insights,
			presentTotalCount,
			absentTotalCount,
			onLeaveTotalCount,
		};

		return NextResponse.json(insightsWithCount);
	} catch (error) {
		console.log("ERROR GETTING ATTENDANCE LIST: ", error);
		return NextResponse.json({
			error: "ERROR GETTING ATTENDANCE LIST",
			status: 500,
		});
	}
}
