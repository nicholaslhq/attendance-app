"use client";
import React, { useState } from "react";
import Background from "../components/background/Background";
import menu from "@/app/utils/menu";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import NoPermissionError from "../components/error/NoPermissionError";
import Loader from "../components/loader/Loader";
import InsightTable from "../components/table/InsightTable";

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
			accessorKey: "totalCount",
			id: "totalCount",
			header: "Total Count",
		},
		{
			accessorKey: "presentCount",
			id: "presentCount",
			header: "Present Count",
		},
		{
			accessorKey: "absentCount",
			id: "absentCount",
			header: "Absent Count",
		},
		{
			accessorKey: "onLeaveCount",
			id: "onLeaveCount",
			header: "On Leave Count",
		},
	];

	return (
		<Background title="Insight">
			<InsightTable
				title="Insight"
				cols={cols}
				refreshTable={refreshTable}
			/>
		</Background>
	);
}

export default page;
