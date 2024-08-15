import { usePathname } from "next/navigation";
import prisma from "@/app/utils/connect";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(req: Request) {
	try {
		const { id, password, name, role, createdBy } = await req.json();

		// Check if required fields are provided
		if (!id || !password || !name || !role) {
			return NextResponse.json({
				error: "One or more required fields are null or undefined",
				status: 400,
			});
		}

		// Validate the user ID format using a regular expression
		const idRegex = /^[a-zA-Z0-9]+$/;
		if (!idRegex.test(id)) {
			return NextResponse.json({
				error: "User ID cannot contain spaces or special characters",
				status: 400,
			});
		}

		// Check if the password is at least 6 characters long
		if (password.length < 6) {
			return NextResponse.json({
				error: "Password must be at least 6 characters long",
				status: 400,
			});
		}

		// Check if the password contains any spaces
		if (password.includes(" ")) {
			return NextResponse.json({
				error: "Password cannot contain spaces",
				status: 400,
			});
		}

		const hashedPassword = await hash(password, 10);

		// Check if the user ID already exists
		const existingUser = await prisma.user.findUnique({
			where: { id },
		});

		if (existingUser) {
			// User with the given ID exists
			if (!existingUser.deleted) {
				// If the user exists and is not deleted, do not create a new user
				return NextResponse.json({
					error: "User with the specified ID already exists",
					status: 400,
				});
			} else {
				// If the user exists but is deleted, update deleted to false
				const updatedUser = await prisma.user.update({
					where: { id },
					data: {
						deleted: false,
						password: hashedPassword,
						name,
						role,
					},
				});
				return NextResponse.json(updatedUser);
			}
		} else {
			// User with the given ID does not exist, create a new user
			const newUser = await prisma.user.create({
				data: {
					id,
					password: hashedPassword,
					name,
					role,
					createdBy,
				},
			});
			return NextResponse.json(newUser);
		}
	} catch (error) {
		console.log("ERROR ADDING USER: ", error);
		return NextResponse.json({ error: "ERROR ADDING USER", status: 500 });
	}
}

export async function GET(req: Request) {
	try {
        // Fetch users excluding the 'sysadmin' user
		const users = await prisma.user.findMany({
			where: {
				deleted: false,
				NOT: {
					id: "sysadmin",
				},
			},
		});

		return NextResponse.json(users);
	} catch (error) {
		console.log("ERROR GETTING USER: ", error);
		return NextResponse.json({ error: "ERROR GETTING USER", status: 500 });
	}
}

export async function PUT(req: Request) {
	try {
		const { id, password, name, role } = await req.json();

        // Check if required fields are provided
		if (!id || !name || !role) {
			return NextResponse.json({
				error: "One or more required fields are null or undefined",
				status: 400,
			});
		}

		// Initialize an object to store the updated user data
        const updateData: any = {
            name,
            role,
        };

        // Check if the password is provided and not null
        if (password) {
            // Check if the password is at least 6 characters long
            if (password.length < 6) {
                return NextResponse.json({
                    error: "Password must be at least 6 characters long",
                    status: 400,
                });
            }

            // Check if the password contains any spaces
            if (password.includes(" ")) {
                return NextResponse.json({
                    error: "Password cannot contain spaces",
                    status: 400,
                });
            }

            const hashedPassword = await hash(password, 10);

            // Update the password in the update data object
            updateData.password = hashedPassword;
        }

        // Update the user details
        const user = await prisma.user.update({
            where: {
                id,
            },
            data: updateData,
        });

		return NextResponse.json(user);
	} catch (error) {
		console.log("ERROR UPDATING USER: ", error);
		return NextResponse.json({ error: "ERROR UPDATING USER", status: 500 });
	}
}
