"use client";
import React from "react";
import Table from "../components/table/Table";
import { useGlobalState } from "../context/GlobalContextProvider";
import Background from "@/app/components/background/Background";
import Modal from "@/app/components/modal/Modal";
import CreateUser from "@/app/components/modal/user/CreateUser";
import EditUser from "@/app/components/modal/user/EditUser";
import DeleteUser from "@/app/components/modal/user/DeleteUser";
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
			accessorKey: "id",
			id: "id",
			header: "User ID",
		},
		{
			accessorKey: "name",
			id: "name",
			header: "Name",
		},
		{
			accessorKey: "role",
			accessorFn: (row: { role: string }) => {
				switch (row.role) {
					case "ADMIN":
						return "Admin";
					case "AUDITOR":
						return "Auditor";
					case "USER":
						return "User";
					default:
						return row.role;
				}
			},
			id: "role",
			header: "Role",
		},
	];

	const { modals, users, allUsers } = useGlobalState();

	return (
		<Background title="User">
			{modals.createUser && <Modal content={<CreateUser />} />}
			{modals.editUser && <Modal content={<EditUser />} />}
			{modals.deleteUser && <Modal content={<DeleteUser />} />}
			<Table
				title="Student"
				cols={cols}
				rows={users}
				addBtn="createUser"
				editBtn="editUser"
				deleteBtn="deleteUser"
				refetch={allUsers}
			/>
		</Background>
	);
}

export default page;
