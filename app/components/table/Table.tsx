"use client";
import React, { useEffect, useMemo } from "react";
import { useGlobalState } from "@/app/context/GlobalContextProvider";
import {
	MRT_ActionMenuItem,
	MaterialReactTable,
	useMaterialReactTable,
	MRT_Row,
} from "material-react-table";
import { createTheme, ThemeProvider } from "@mui/material";
import toast from "react-hot-toast";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv";

interface Props {
	title: string;
	cols: any[];
	rows: any[];
	addBtn?: string | null;
	editBtn?: string | null;
	deleteBtn?: string | null;
	refetch: () => void;
}

function Table({
	title,
	cols,
	rows,
	addBtn = null,
	editBtn = null,
	deleteBtn = null,
	refetch,
}: Props) {
	const { theme, setIsLoading, selectedTheme, modals, openModal } =
		useGlobalState();

	useEffect(() => {
		refetch();
	}, []);

	const tableTheme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: selectedTheme == 0 ? "dark" : "light",
				},
			}),
		[selectedTheme]
	);

	const handleAddBtnClick = () => {
		if (addBtn) {
			openModal(addBtn);
		}
	};

	const handleEditBtnClick = (id: string) => {
		if (editBtn) {
			openModal(editBtn, id);
		}
	};

	const handleDeleteBtnClick = (id: string[]) => {
		if (deleteBtn) {
			openModal(deleteBtn, [id]);
		}
	};

	const handleDeleteMultipleBtnClick = () => {
		const ids = table.getSelectedRowModel().flatRows.map((row) => row.id);
		if (ids.length > 0) {
			openModal(deleteBtn, ids);
		} else {
			toast.error("Please select at least 1 row", {
				id: "deleteMultipleError",
			});
		}
	};

	const handleRefresh = async () => {
		try {
			setIsLoading(true);
			await refetch();
			toast.success("Data refreshed successfully", {
				id: "dataRefreshSuccess",
			});
		} catch (error) {
			toast.error("Something went wrong", {
				id: "dataRefreshError",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const csvConfig = mkConfig({
		fieldSeparator: ",",
		decimalSeparator: ".",
		useKeysAsHeaders: true,
	});

	const handleExportData = (selectedRows: MRT_Row<any>[] | null) => {
		const visibleColumnKeys = columns.map((column) => column.accessorKey);
		const currentDate = new Date();
		const formattedDate = currentDate
			.toISOString()
			.split("T")[0]
			.replace(/-/g, "");

		if (selectedRows && selectedRows.length > 0) {
			const rowData = selectedRows.map((row) => {
				const rowData: Record<string, any> = {};
				if (row.original) {
					visibleColumnKeys.forEach((key) => {
						if (row.original[key] !== undefined) {
							rowData[key] = row.original[key];
						}
					});
				}
				return rowData;
			});

			if (rowData && rowData.length > 0) {
				const fileName = `selected_data_${formattedDate}`;
				const csv = generateCsv({ ...csvConfig, filename: fileName })(
					rowData
				);
				download({ ...csvConfig, filename: fileName })(csv);
			} else {
				toast.error("No data available to export", {
					id: "exportTableError",
				});
			}
		} else {
			const rowData = rows.map((row) => {
				const rowData: Record<string, any> = {};
				visibleColumnKeys.forEach((key) => {
					rowData[key] = row[key];
				});
				return rowData;
			});

			if (rowData && rowData.length > 0) {
				const fileName = `full_data_${formattedDate}`;
				const csv = generateCsv({ ...csvConfig, filename: fileName })(
					rowData
				);
				download({ ...csvConfig, filename: fileName })(csv);
			} else {
				toast.error("No data available to export", {
					id: "exportTableError",
				});
			}
		}
	};

	const columns = useMemo(() => {
		return cols.map((col) => ({
			accessorKey: col.accessorKey,
			accessorFn: col.accessorFn,
			id: col.id,
			header: col.header,
			muiTableHeadCellProps: col.muiTableHeadCellProps,
			Header: col.Header,
		}));
	}, [cols]);

	const table = useMaterialReactTable({
		data: rows || [],
		columns,
		getRowId: (row) => row.id,
		// enableRowNumbers: true,
		enableRowSelection: true,
		positionActionsColumn: "last",
		enableColumnOrdering: true,
		enableColumnPinning: true,
		initialState: { columnPinning: { right: ["mrt-row-actions"] } },
		enableStickyHeader: true,
		paginationDisplayMode: "pages",
		mrtTheme: {
			baseBackgroundColor: theme.colorBg,
			matchHighlightColor: theme.matchHighlightColor,
		},
		enableRowActions: true,
		renderRowActionMenuItems: ({ closeMenu, row, table }) => [
			<MRT_ActionMenuItem
				icon={<EditIcon />}
				key="edit"
				label="Edit"
				onClick={() => {
					handleEditBtnClick(row.id);
					closeMenu();
				}}
				table={table}
			/>,
			<MRT_ActionMenuItem
				icon={<DeleteIcon />}
				key="delete"
				label="Delete"
				onClick={() => {
					handleDeleteBtnClick([row.id]);
					closeMenu();
				}}
				table={table}
			/>,
		],
		positionToolbarAlertBanner: "bottom",
		renderTopToolbarCustomActions: ({ table }) => (
			<div className="flex flex-row gap-1 align-middle justify-center p-1">
				<Tooltip arrow title="Refresh">
					<IconButton onClick={handleRefresh} size="small">
						<RefreshIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title="Add">
					<IconButton onClick={handleAddBtnClick} size="small">
						<AddIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title="Delete">
					<IconButton
						onClick={handleDeleteMultipleBtnClick}
						disabled={table.getSelectedRowModel().rows.length === 0}
						size="small"
					>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
				<Tooltip arrow title="Export as csv">
					<IconButton
						onClick={() =>
							handleExportData(table.getSelectedRowModel().rows)
						}
						size="small"
					>
						<FileDownloadIcon />
					</IconButton>
				</Tooltip>
			</div>
		),
	});

	return (
		<ThemeProvider theme={tableTheme}>
			<MaterialReactTable table={table} />
		</ThemeProvider>
	);
}

export default Table;
