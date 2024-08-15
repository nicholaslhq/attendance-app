export { default } from "next-auth/middleware";

export const config = {
	matcher: [
		"/",
		"/api",
		"/attendance",
		"/class",
		"/session",
		"/student",
		"/user",
	],
};
