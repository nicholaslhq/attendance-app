"use client";
import React, { useEffect } from "react";
import { GlobalProvider } from "../context/GlobalContextProvider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

interface Props {
	children: React.ReactNode;
}

function ContextProvider({ children }: Props) {
	const [isReady, setIsReady] = React.useState(false);

	useEffect(() => {
		setIsReady(true);
	}, []);

	if (!isReady) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<span className="loader"></span>
			</div>
		);
	}

	return (
		<SessionProvider>
			<GlobalProvider>
				<Toaster />
				{children}
			</GlobalProvider>
		</SessionProvider>
	);
}

export default ContextProvider;
