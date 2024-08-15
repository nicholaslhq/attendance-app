import { usePathname } from "next/navigation";
import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
        // Update all notices to set deleted flag to true
		await prisma.notice.updateMany({
			where: { deleted: false },
			data: { deleted: true },
		});

		const { title, content, createdBy } = await req.json();

        // Return if title is not provided
		if (!title) {
			return;
		}

        // Create a new notice
		const notice = await prisma.notice.create({
			data: {
				title,
				content,
				createdBy,
				deleted: false, // Set deleted flag to false for the new notice
			},
		});

		return NextResponse.json(notice);
	} catch (error) {
		console.log("ERROR ADDING NOTICE: ", error);
		return NextResponse.json({ error: "ERROR ADDING NOTICE", status: 500 });
	}
}

export async function GET(req: Request) {
	try {
        // Fetch the first non-deleted notice
		const session = await prisma.notice.findFirst({
			where: {
				deleted: false,
			},
		});

		return NextResponse.json(session);
	} catch (error) {
		console.log("ERROR GETTING NOTICE: ", error);
		return NextResponse.json({
			error: "ERROR GETTING NOTICE",
			status: 500,
		});
	}
}
