import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params;

	try {
        // Attempt to find the attendance record with the specified id
		const attendance = await prisma.attendance.findFirst({
			where: {
				id: id,
			},
		});

		return NextResponse.json(attendance);
	} catch (error) {
		console.log("ERROR GETTING ATTENDANCE: ", error);
		return NextResponse.json({
			error: "ERROR GETTING ATTENDANCE",
			status: 500,
		});
	}
}
