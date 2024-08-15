"use client";
import React from "react";
import Table from "../components/table/Table";
import { useGlobalState } from "../context/GlobalContextProvider";
import Background from "@/app/components/background/Background";
import Modal from "@/app/components/modal/Modal";
import CreateClass from "../components/modal/class/CreateClass";
import EditClass from "../components/modal/class/EditClass";
import DeleteClass from "../components/modal/class/DeleteClass";
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
		{
			accessorKey: "handleName",
			id: "handleName",
			header: "Handle By",
		},
		{
			accessorKey: "studentCount",
			id: "studentCount",
			header: "Student Count",
		},
	];

	const { modals, classes, allClasses } = useGlobalState();

	return (
		<Background title="Class">
			{modals.createClass && <Modal content={<CreateClass />} />}
			{modals.editClass && <Modal content={<EditClass />} />}
			{modals.deleteClass && <Modal content={<DeleteClass />} />}
			<Table
				title="Class"
				cols={cols}
				rows={classes}
				addBtn="createClass"
				editBtn="editClass"
				deleteBtn="deleteClass"
				refetch={allClasses}
			/>
		</Background>
	);
}

export default page;
