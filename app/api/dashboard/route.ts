import { usePathname } from "next/navigation";
import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";
import dayjs from "dayjs";

export async function GET(req: Request) {
	try {
        // Get the current date using dayjs
		const today = dayjs();
        // Get the start of the current day and convert it to ISO string
		const startOfDayISOString = today.startOf("day").toISOString();

        // Count the total number of non-deleted students
		const studentCount = await prisma.student.count({
			where: {
				deleted: false,
			},
		});

        // Count the total number of non-deleted classes
		const classCount = await prisma.class.count({
			where: {
				deleted: false,
			},
		});

        // Count the total number of non-deleted sessions
		const sessionCount = await prisma.session.count({
			where: {
				deleted: false,
			},
		});

        // Fetch all attendance IDs for the current day
		const attendanceIds = await prisma.attendance.findMany({
			where: {
				date: startOfDayISOString,
			},
			select: {
				id: true,
			},
		});

        // Extract the list of attendance IDs
		const attendanceIdList = attendanceIds.map(
			(attendance) => attendance.id
		);

        // Count the number of students marked as present for the current day
		const presentCount = await prisma.attendanceList.count({
			where: {
				attendanceId: {
					in: attendanceIdList,
				},
				status: "PRESENT",
			},
		});

        // Count the number of students marked as absent for the current day
		const absentCount = await prisma.attendanceList.count({
			where: {
				attendanceId: {
					in: attendanceIdList,
				},
				status: "ABSENT",
			},
		});

        // Count the number of students marked as on leave for the current day
		const onLeaveCount = await prisma.attendanceList.count({
			where: {
				attendanceId: {
					in: attendanceIdList,
				},
				status: "ONLEAVE",
			},
		});

        // Prepare dashboard data
		const dashboard = {
			studentCount,
			classCount,
			sessionCount,
			presentCount,
			absentCount,
			onLeaveCount,
		};

		return NextResponse.json(dashboard);
	} catch (error) {
		console.log("ERROR GETTING DASHBOARD: ", error);
		return NextResponse.json({
			error: "ERROR GETTING DASHBOARD",
			status: 500,
		});
	}
}
