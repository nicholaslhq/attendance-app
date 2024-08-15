import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";
import dayjs from 'dayjs';

export async function POST(req: Request) {
	try {
		const { date, classId, sessionId } = await req.json();

        // Check if any required fields are missing
		if (!date || !classId || !sessionId) {
			return NextResponse.json({
				error: "Please select a date, class, and session",
				status: 400,
			});
		}

		// Parse the provided date string into a Day.js object
        const selectedDate = dayjs(date);

        // Check if the selected date is after today's date
        if (selectedDate.isAfter(dayjs(), 'day')) {
            return NextResponse.json({
                error: "The selected date cannot be in the future",
                status: 400,
            });
        }

		// Decode the DateTime value from the URL parameter
		const dateTimeValue = new Date(decodeURIComponent(date));

		// Check if the attendance record already exists
		const existingAttendance = await prisma.attendance.findFirst({
			where: {
				date: dateTimeValue,
				classId,
				sessionId,
			},
		});

		// If the attendance record already exists, return an error message
		if (existingAttendance) {
			return NextResponse.json({
				error: "Attendance record already exists for the selected date, class, and session",
				status: 409,
			});
		}

		// If the attendance record does not exist, create a new one
		const attendance = await prisma.attendance.create({
			data: {
				date: dateTimeValue,
				classId,
				sessionId,
			},
		});

		return NextResponse.json(attendance);
	} catch (error) {
		console.log("ERROR ADDING ATTENDANCE: ", error);
		return NextResponse.json({
			error: "ERROR ADDING ATTENDANCE",
			status: 500,
		});
	}
}

export async function GET(req: Request) {
	try {
        // Retrieve all attendance records from the database
		const attendances = await prisma.attendance.findMany();

		return NextResponse.json(attendances);
	} catch (error) {
		console.log("ERROR GETTING ATTENDANCE: ", error);
		return NextResponse.json({
			error: "ERROR GETTING ATTENDANCE",
			status: 500,
		});
	}
}
