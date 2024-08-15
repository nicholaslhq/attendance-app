import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient, User } from "@prisma/client";
import { compare } from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt", // Use JWT strategy for sessions
		maxAge: 2 * 60 * 60, // Set session expiration time to 2 hours
	},
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				id: { label: "User ID", type: "text", placeholder: "" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				if (!credentials) {
					return null;
				}

                // Find user in the database based on provided credentials
				const user = await prisma.user.findUnique({
					where: {
						id: credentials.id,
						deleted: false,
					},
				});

				if (!user) {
					return null;
				}

                // Compare provided password with hashed password stored in the database
				const isPasswordValid = await compare(
					credentials.password,
					user.password
				);

				if (!isPasswordValid) {
					return null;
				}

                // Return user data if authentication is successful
				return {
					id: user.id,
					name: user.name,
					role: user.role,
					mode: user.mode,
				};
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET, // Use secret from environment variable for JWT encryption
	pages: {
		signIn: "/login",
		signOut: "/login",
		error: "/login",
	},
	callbacks: {
		redirect: ({ url, baseUrl }) => {
			return baseUrl;
		},
		session: async ({ session, token }) => {
			return Promise.resolve({
				...session,
				user: {
					...session.user,
					id: token.id,
					role: token.role,
					mode: token.mode,
				},
			});
		},
		jwt: async ({ token, user }) => {
			if (user) {
				const u = user as unknown as User;
				return Promise.resolve({
					...token,
					id: u.id,
					role: u.role,
					mode: u.mode,
				});
			}
			return Promise.resolve(token);
		},
	},
};