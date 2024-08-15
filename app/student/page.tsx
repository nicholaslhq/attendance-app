"use client";
import React from "react";
import Table from "../components/table/Table";
import { useGlobalState } from "../context/GlobalContextProvider";
import Background from "../components/background/Background";
import Modal from "../components/modal/Modal";
import CreateStudent from "../components/modal/student/CreateStudent";
import EditStudent from "../components/modal/student/EditStudent";
import DeleteStudent from "../components/modal/student/DeleteStudent";
import menu from "@/app/utils/menu";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import NoPermissionError from "../components/error/NoPermissionError";

function page() {
	const { data: session } = useSession();

	if (!session || !session.user) {
		return null;
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
			accessorKey: "eName",
			id: "eName",
			header: "E. Name",
		},
		{
			accessorKey: "cName",
			id: "cName",
			header: "C. Name",
		},
		{
			accessorKey: "bName",
			id: "bName",
			header: "B. Name",
		},
		{
			accessorKey: "gender",
			id: "gender",
			header: "Gender",
		},
		{
			accessorKey: "className",
			id: "className",
			header: "Class",
		},
	];

	const { modals, students, allStudents } = useGlobalState();

	return (
		<Background title="Student">
			{modals.createStudent && <Modal content={<CreateStudent />} />}
			{modals.editStudent && <Modal content={<EditStudent />} />}
			{modals.deleteStudent && <Modal content={<DeleteStudent />} />}
			<Table
				title="Student"
				cols={cols}
				rows={students}
				addBtn="createStudent"
				editBtn="editStudent"
				deleteBtn="deleteStudent"
				refetch={allStudents}
			/>
		</Background>
	);
}

export default page;
