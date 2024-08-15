"use client";
import React from "react";
import Table from "../components/table/Table";
import { useGlobalState } from "../context/GlobalContextProvider";
import Background from "@/app/components/background/Background";
import Modal from "@/app/components/modal/Modal";
import CreateSession from "../components/modal/session/CreateSession";
import EditSession from "../components/modal/session/EditSession";
import DeleteSession from "../components/modal/session/DeleteSession";
import menu from "@/app/utils/menu";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import NoPermissionError from "../components/error/NoPermissionError";
import Loader from "../components/loader/Loader";

function page() {
	const { data: session } = useSession();

	if (!session || !session.user) {
		return <Loader />;
	}

	const pathName = usePathname();

	const userRole = (session.user as { role?: string | null | undefined })?.role || "USER";

	const allowedRoles = menu
		.filter((item) => item.link === pathName)
		.flatMap((item) => item.roles)
		.map((role) => role);

	const hasPermission = allowedRoles.some((role) => userRole.includes(role));

	if (!hasPermission) {
		return <NoPermissionError />;
	}

	const cols = [
		{
			accessorKey: "name",
			id: "name",
			header: "Name",
		},
		{
			accessorKey: "description",
			id: "description",
			header: "Description",
		},
	];

	const { modals, sessions, allSessions } = useGlobalState();

	return (
		<Background title="Session">
			{modals.createSession && <Modal content={<CreateSession />} />}
			{modals.editSession && <Modal content={<EditSession />} />}
			{modals.deleteSession && <Modal content={<DeleteSession />} />}
			<Table
				title="Session"
				cols={cols}
				rows={sessions}
				addBtn="createSession"
				editBtn="editSession"
				deleteBtn="deleteSession"
				refetch={allSessions}
			/>
		</Background>
	);
}

export default page;
