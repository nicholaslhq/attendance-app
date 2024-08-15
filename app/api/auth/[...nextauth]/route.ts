import NextAuth from "next-auth";
import { authOptions } from "@/app/utils/authOptions";

// Create NextAuth handler with defined authentication options
const handler = NextAuth(authOptions);

// Export NextAuth handler for both GET and POST requests
export { handler as GET, handler as POST };
