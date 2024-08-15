import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";

// Function to retrieve all student IDs from the Student model
const getAllStudentIds = async (classId: string) => {
	try {
        // Fetch all students belonging to the specified class
		const students = await prisma.student.findMany({
			where: {
				deleted: false,
				classId,
			},
		});

		// Extract student IDs from the fetched students
		const studentIds = students.map((student: { id: any }) => student.id);

		return studentIds;
	} catch (error) {
		console.error("ERROR FETCHING STUDENT ID FOR ATTENDANCE LIST:", error);
		throw error;
	}
};

// Function to create AttendanceList entries for each student ID
const createAttendanceListEntries = async (
	studentIds: string[],
	attendanceId: string,
	createdBy: string
) => {
	try {
		// Create AttendanceList entries for each student ID
		const attendanceListEntries = studentIds.map((studentId) => ({
			studentId,
			attendanceId,
			createdBy,
		}));

		// Insert AttendanceList entries into the database
		const createdAttendanceListEntries =
			await prisma.attendanceList.createMany({
				data: attendanceListEntries,
			});

		return createdAttendanceListEntries;
	} catch (error) {
		console.error("ERROR ADDING ATTENDANCE LIST:", error);
		throw error;
	}
};

// Function to process the attendance list for a given class
const processAttendanceList = async (
	classId: string,
	attendanceId: string,
	createdBy: string
) => {
	try {
		// Retrieve all student IDs belonging to the specified class
		const studentIds = await getAllStudentIds(classId);

		// Create AttendanceList entries for each student ID
		const createdEntries = await createAttendanceListEntries(
			studentIds,
			attendanceId,
			createdBy
		);

		return createdEntries;
	} catch (error) {
		console.error("ERROR ADDING ATTENDANCE LIST:", error);
	}
};

export async function POST(req: Request) {
	try {
		const { classId, attendanceId, createdBy } = await req.json();

        // Check if required fields are provided
		if (!classId || !attendanceId) {
			return NextResponse.json({
				error: "One or more required fields are null or undefined",
				status: 400,
			});
		}

		// Process attendance list and get the created entries
		const createdEntries = await processAttendanceList(
			classId,
			attendanceId,
			createdBy
		);

		return NextResponse.json(createdEntries);
	} catch (error) {
		console.log("ERROR ADDING ATTENDANCE LIST: ", error);
		return NextResponse.json({
			error: "ERROR ADDING ATTENDANCE LIST",
			status: 500,
		});
	}
}

export async function PUT(req: Request) {
	try {
		const { id, status, remark } = await req.json();

        // Check if required fields are provided
		if (!id || (status === undefined && remark === undefined)) {
			return NextResponse.json({
				error: "One or more required fields are null or undefined",
				status: 400,
			});
		}

		// Fetch existing attendance data
		const existingAttendance = await prisma.attendanceList.findUnique({
			where: {
				id,
			},
		});

		if (!existingAttendance) {
			return NextResponse.json({
				error: "ERROR GETTING ATTENDANCE LIST",
				status: 404,
			});
		}

		// Determine the new status to update
		let updatedStatus = status;
		if (existingAttendance.status !== null && status === existingAttendance.status) {
			updatedStatus = null; // Set status to null if it's the same as existing status
		}

        // Update the attendance list entry with the provided id
		const updatedAttendance = await prisma.attendanceList.update({
			where: {
				id,
			},
			data: {
				status: updatedStatus,
				remark,
			},
		});

		return NextResponse.json(updatedAttendance);
	} catch (error) {
		console.log("ERROR UPDATING ATTENDANCE LIST: ", error);
		return NextResponse.json({
			error: "ERROR UPDATING ATTENDANCE LIST",
			status: 500,
		});
	}
}
