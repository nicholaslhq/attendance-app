"use client";
import React, { useState } from "react";
import { useGlobalState } from "../context/GlobalContextProvider";
import Background from "../components/background/Background";
import AttendanceTable from "../components/table/AttendanceTable";
import EditAttendance from "../components/modal/attendance/EditAttendance";
import Modal from "../components/modal/Modal";
import menu from "@/app/utils/menu";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import NoPermissionError from "../components/error/NoPermissionError";
import Loader from "../components/loader/Loader";

function page() {
	const [refreshTable, setRefreshTable] = useState(false);

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

	const handleRefreshTable = () => {
		setRefreshTable((prevState) => !prevState);
	};

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
			accessorKey: "status",
			accessorFn: (row: { status: string }) => {
				switch (row.status) {
					case "PRESENT":
						return "Present";
					case "ABSENT":
						return "Absent";
					case "ONLEAVE":
						return "On Leave";
					default:
						return row.status;
				}
			},
			id: "status",
			header: "Status",
		},
		{
			accessorKey: "remark",
			id: "remark",
			header: "Remark",
		},
	];

	const { modals } = useGlobalState();

	return (
		<Background title="Attendance">
			{modals.editAttendance && (
				<Modal
					content={
						<EditAttendance refreshTable={handleRefreshTable} />
					}
				/>
			)}
			<AttendanceTable
				title="Attendance"
				cols={cols}
				refreshTable={refreshTable}
			/>
		</Background>
	);
}

export default page;
