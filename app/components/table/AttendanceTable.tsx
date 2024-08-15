"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useGlobalState } from "@/app/context/GlobalContextProvider";
import {
	MaterialReactTable,
	useMaterialReactTable,
} from "material-react-table";
import toast from "react-hot-toast";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import CircleIcon from "@mui/icons-material/Circle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import styled from "styled-components";
import {
	Autocomplete,
	Chip,
	createTheme,
	Paper,
	ThemeProvider,
} from "@mui/material";
import axios from "axios";
import EditNoteIcon from "@mui/icons-material/EditNote";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { useSession } from "next-auth/react";

interface Props {
	title: string;
	cols: any[];
	refreshTable: any;
}

function AttendanceTable({ title, cols, refreshTable }: Props) {
	const {
		theme,
		setIsLoading,
		selectedTheme,
		classes,
		allClasses,
		sessions,
		allSessions,
		openModal,
	} = useGlobalState();

	const [classId, setClassId] = useState<string | null>(null);
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(
		dayjs()
	);
	const [attendanceDetails, setAttendanceDetails] = useState<any[]>([]);
	const [presentCount, setPresentCount] = useState<number>(0);
	const [absentCount, setAbsentCount] = useState<number>(0);
	const [onLeaveCount, setOnLeaveCount] = useState<number>(0);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	useEffect(() => {
		handleSelectorChange(selectedDate, classId, sessionId);
	}, [selectedDate, classId, sessionId, refreshTable]);

	useEffect(() => {
		allClasses();
	}, []);

	useEffect(() => {
		allSessions();
	}, []);

	useEffect(() => {
		console.log('useEffect');
		console.log(pagination);
		table.setPagination(pagination);
	  }, [attendanceDetails]);

	const classOptions = classes.map((obj: { id: string; name: string }) => ({
		label: obj.name,
		value: obj.id,
	}));

	const sessionOptions = sessions.map(
		(obj: { id: string; name: string }) => ({
			label: obj.name,
			value: obj.id,
		})
	);

	const { data: session } = useSession();

	const createdBy = (session?.user as { id?: string | null | undefined })?.id ?? "UNKNOWN";

	const isOptionEqualToValue = (option: any, value: any) =>
		option.value === value.value;

	const tableTheme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: selectedTheme == 0 ? "dark" : "light",
				},
			}),
		[selectedTheme]
	);

	const handleDateChange = (date: Dayjs | null) => {
		setSelectedDate(date);
		handleSelectorChange(date, classId, sessionId);
	};

	const handleClassChange = (event: any, newValue: any) => {
		if (newValue) {
			setClassId(newValue.value);
			handleSelectorChange(selectedDate, newValue.value, sessionId);
		} else {
			setClassId(null);
			handleSelectorChange(selectedDate, null, sessionId);
		}
	};

	const handleClassInputChange = (
		event: any,
		newInputValue: React.SetStateAction<string | null>
	) => {
		setClassId(newInputValue);
	};

	const handleSessionChange = (event: any, newValue: any) => {
		if (newValue) {
			setSessionId(newValue.value);
			handleSelectorChange(selectedDate, classId, newValue.value);
		} else {
			setSessionId(null);
			handleSelectorChange(selectedDate, classId, null);
		}
	};

	const handleSessionInputChange = (
		event: any,
		newInputValue: React.SetStateAction<string | null>
	) => {
		setSessionId(newInputValue);
	};

	const handleSelectorChange = async (
		selectedDate: Dayjs | null,
		classId: any,
		sessionId: any
	) => {
		setIsLoading(true);

		let date = null;

		if (selectedDate && selectedDate.isValid()) {
			date = encodeURIComponent(
				selectedDate.startOf("day").toISOString()
			);
		} else {
			toast.error("Invalid selected date", {
				id: "selectInvalidDateError",
			});
			return;
		}

		//Get latest attendance list based on selected date, classId, and sessionId
		if (date && classId && sessionId) {
			try {
				const res = await axios.get(
					`/api/attendanceList/attendanceListByDateClassSession/${date}/${classId}//${sessionId}`
				);

				const {
					presentCount,
					absentCount,
					onLeaveCount,
					...attendanceDetails
				} = res.data;

				// Check if details is not null and has length more than 0
				if (
					attendanceDetails &&
					Object.values(attendanceDetails).length > 0 &&
					!res.data.error
				) {
					setAttendanceDetails(Object.values(attendanceDetails));
				} else {
					setAttendanceDetails([]);
				}

				const currentPageIndex = pagination.pageIndex;
				setPagination((prevPagination) => ({
					...prevPagination,
					pageIndex: currentPageIndex, // Restore the current page
				  }));

				console.log('currentPageIndex');
				console.log(currentPageIndex);

				setPresentCount(presentCount || 0);
				setAbsentCount(absentCount || 0);
				setOnLeaveCount(onLeaveCount || 0);

				const total =
					(presentCount || 0) +
					(absentCount || 0) +
					(onLeaveCount || 0);
				setTotalCount(total);
			} catch (error) {
				toast.error("Something went wrong", {
					id: "getAttendanceListUnknownError",
				});
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		}

		setIsLoading(false);
	};

	const handleAddBtnClick = async () => {
		setIsLoading(true);

		let date = null;

		if (selectedDate && selectedDate.isValid()) {
			date = encodeURIComponent(
				selectedDate.startOf("day").toISOString()
			);
		} else {
			toast.error("Invalid selected date", {
				id: "selectInvalidDateError",
			});
			return;
		}

		const attendance = {
			date,
			classId,
			sessionId,
		};

		console.log(attendance);

		try {
			const res = await axios.post("/api/attendance", attendance);

			if (res.data.error) {
				toast.error(res.data.error, {
					id: "createAttendanceError",
				});
			}

			if (!res.data.error) {
				// If the attendance record was created successfully, get the attendance ID
				const attendanceId = res.data.id;

				// Call the post function for the AttendanceList model using the attendance ID
				await postAttendanceList(attendanceId);

				refetch();
			}
		} catch (error) {
			toast.error("Something went wrong", {
				id: "createAttendanceUnknownError",
			});
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	// Function to post data to AttendanceList model
	const postAttendanceList = async (attendanceId: string) => {
		try {
			const data = {
				attendanceId,
				classId,
				sessionId,
				createdBy,
			};

			// Call the post function for AttendanceList model
			const res = await axios.post("/api/attendanceList", data);

			if (res.data.error) {
				toast.error(res.data.error, {
					id: "createAttendanceListError",
				});
			} else {
				toast.success("Attendance created successfully", {
					id: "createAttendanceSuccess",
				});
			}
		} catch (error) {
			toast.error("Something went wrong", {
				id: "createAttendanceListUnknownError",
			});
			console.log(error);
		}
	};

	const refetch = async () => {
		try {
			setIsLoading(true);
			handleSelectorChange(selectedDate, classId, sessionId);
		} catch (error) {
			console.error("Error refetching data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRefresh = async () => {
		try {
			await refetch();
			toast.success("Data refreshed successfully", {
				id: "dataRefreshSuccess",
			});
		} catch (error) {
			toast.error("Something went wrong", {
				id: "dataRefreshError",
			});
		}
	};

	const getStatusButtonColor = (
		buttonIndex?: number | null,
		status?: string | null
	) => {
		if (status === "PRESENT" && buttonIndex === 0) {
			return theme.colorGreen4;
		} else if (status === "ABSENT" && buttonIndex === 1) {
			return theme.colorRed4;
		} else if (status === "ONLEAVE" && buttonIndex === 2) {
			return theme.colorOrange4;
		} else if (buttonIndex === 3) {
			return theme.colorGrey5;
		} else {
			return theme.colorGrey4;
		}
	};

	const handleStatusUpdate = async (status: string, id: string) => {
		const attendanceStatus = {
			id,
			status,
		};

		try {
			const res = await axios.put(
				"/api/attendanceList",
				attendanceStatus
			);

			if (res.data.error) {
				toast.error(res.data.error, {
					id: "editAttendanceStatusError",
				});
			}

			if (!res.data.error) {
				toast.success("Status updated successfully", {
					id: "editAttendanceStatusSuccess",
				});

				await refetch();
			}
		} catch (error) {
			toast.error("Something went wrong", {
				id: "editAttendanceStatusUnknownError",
			});
			console.log(error);
		}
	};

	const handleEditBtnClick = (id: string) => {
		const editBtn = "editAttendance";
		openModal(editBtn, id);
	};

	const csvConfig = mkConfig({
		fieldSeparator: ",",
		decimalSeparator: ".",
		useKeysAsHeaders: true,
	});

	const handleExportData = () => {
		const visibleColumnKeys = columns.map((column) => column.accessorKey);
		const formattedDate = dayjs(selectedDate).format("YYYYMMDD");
		const selectedClass = classes.find(
			(cls: { id: string | null }) => cls.id === classId
		);
		const className = selectedClass ? selectedClass.name : "Unknown Class";
		const selectedSession = sessions.find(
			(sess: { id: string | null }) => sess.id === sessionId
		);
		const sessionName = selectedSession
			? selectedSession.name
			: "Unknown Session";

		const rowData = attendanceDetails.map((row) => {
			const rowData: Record<string, any> = {};
			visibleColumnKeys.forEach((key) => {
				rowData[key] = row[key];
			});
			return rowData;
		});

		if (rowData && rowData.length > 0) {
			const fileName = `attendance_${formattedDate}_${className}_${sessionName}`;
			const csv = generateCsv({ ...csvConfig, filename: fileName })(
				rowData
			);
			download({ ...csvConfig, filename: fileName })(csv);
		} else {
			toast.error("No data available to export", {
				id: "exportTableError",
			});
		}
	};

	const handlePaginationChange = (newPagination: React.SetStateAction<{ pageIndex: number; pageSize: number; }>) => {
		console.log('handlePaginationChange');
		console.log(pagination);
		setPagination(newPagination);
		console.log(pagination);
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
		data: attendanceDetails || [],
		columns,
		getRowId: (row) => row.id,
		enableRowNumbers: true,
		// enableRowSelection: true,
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
		displayColumnDefOptions: {
			"mrt-row-actions": {
				header: "Status",
			},
		},
		renderRowActions: ({ row }) => (
			<Box sx={{ display: "flex", gap: "0.5rem" }}>
				<Tooltip title="Present">
					<IconButton
						onClick={() => handleStatusUpdate("PRESENT", row.id)}
					>
						<CheckCircleIcon
							style={{
								color: getStatusButtonColor(
									0,
									row.original.status
								),
							}}
						/>
					</IconButton>
				</Tooltip>
				<Tooltip title="Absent">
					<IconButton
						onClick={() => handleStatusUpdate("ABSENT", row.id)}
					>
						<CancelIcon
							style={{
								color: getStatusButtonColor(
									1,
									row.original.status
								),
							}}
						/>
					</IconButton>
				</Tooltip>
				<Tooltip title="On Leave">
					<IconButton
						onClick={() => handleStatusUpdate("ONLEAVE", row.id)}
					>
						<RemoveCircleIcon
							style={{
								color: getStatusButtonColor(
									2,
									row.original.status
								),
							}}
						/>
					</IconButton>
				</Tooltip>
				<Tooltip title="Remark">
					<IconButton onClick={() => handleEditBtnClick(row.id)}>
						<EditNoteIcon
							style={{ color: getStatusButtonColor(3) }}
						/>
					</IconButton>
				</Tooltip>
			</Box>
		),
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
				<Tooltip arrow title="Export as csv">
					<IconButton onClick={() => handleExportData()} size="small">
						<FileDownloadIcon />
					</IconButton>
				</Tooltip>
			</div>
		),
		onPaginationChange: handlePaginationChange,
		state: { pagination },
	});

	//console.log(pagination);

	return (
		<AttendanceTableStyled theme={theme}>
			<ThemeProvider theme={tableTheme}>
				<div className="attendance-container">
					<div className="attendance-selector">
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								label="Date"
								value={selectedDate}
								onChange={handleDateChange}
								format="DD/MM/YYYY"
								maxDate={dayjs()}
								sx={{
									width: "100%",
									backgroundColor: theme.colorBg,
								}}
							/>
						</LocalizationProvider>
					</div>
					<div className="attendance-selector">
						<Autocomplete
							disablePortal
							id="attend-class"
							options={classOptions}
							noOptionsText={
								<span style={{ color: theme.colorGrey2 }}>
									No options
								</span>
							}
							isOptionEqualToValue={isOptionEqualToValue}
							sx={{
								width: "100%",
								".MuiAutocomplete-inputRoot": {
									color: theme.colorGrey2,
									background: theme.colorBg,
								},
								".MuiSvgIcon-root": {
									color: theme.colorGrey2,
								},
							}}
							renderInput={(params: any) => (
								<TextField
									{...params}
									label="Class"
									InputLabelProps={{
										style: {
											color: theme.colorGrey2,
											opacity: "0.7",
										},
									}}
								/>
							)}
							PaperComponent={(props: any) => (
								<Paper
									{...props}
									sx={{
										color: theme.colorGrey2,
										background: theme.colorBg,
									}}
								/>
							)}
							onChange={handleClassChange}
							onInputChange={handleClassInputChange}
						/>
					</div>
					<div className="attendance-selector">
						<Autocomplete
							disablePortal
							id="attend-session"
							options={sessionOptions}
							noOptionsText={
								<span style={{ color: theme.colorGrey2 }}>
									No options
								</span>
							}
							isOptionEqualToValue={isOptionEqualToValue}
							sx={{
								width: "100%",
								".MuiAutocomplete-inputRoot": {
									color: theme.colorGrey2,
									background: theme.colorBg,
								},
								".MuiSvgIcon-root": {
									color: theme.colorGrey2,
								},
							}}
							renderInput={(params: any) => (
								<TextField
									{...params}
									label="Session"
									InputLabelProps={{
										style: {
											color: theme.colorGrey2,
											opacity: "0.7",
										},
									}}
								/>
							)}
							PaperComponent={(props: any) => (
								<Paper
									{...props}
									sx={{
										color: theme.colorGrey2,
										background: theme.colorBg,
									}}
								/>
							)}
							onChange={handleSessionChange}
							onInputChange={handleSessionInputChange}
						/>
					</div>
				</div>
				<MaterialReactTable table={table} />
				<div className="attendance-summary">
					{totalCount > 0 && (
						<Chip
							icon={<CircleIcon />}
							label={`Total Attendance: ${totalCount}`}
							variant="outlined"
						/>
					)}
					{presentCount > 0 && (
						<Chip
							icon={<CheckCircleIcon />}
							label={`Total Present: ${presentCount} (${parseFloat(
								((presentCount / totalCount) * 100).toFixed(1)
							)}%)`}
							variant="outlined"
						/>
					)}
					{absentCount > 0 && (
						<Chip
							icon={<CancelIcon />}
							label={`Total Absent: ${absentCount} (${parseFloat(
								((absentCount / totalCount) * 100).toFixed(1)
							)}%)`}
							variant="outlined"
						/>
					)}
					{onLeaveCount > 0 && (
						<Chip
							icon={<RemoveCircleIcon />}
							label={`Total On Leave: ${onLeaveCount} (${parseFloat(
								((onLeaveCount / totalCount) * 100).toFixed(1)
							)}%)`}
							variant="outlined"
						/>
					)}
				</div>
			</ThemeProvider>
		</AttendanceTableStyled>
	);
}

const AttendanceTableStyled = styled.div`
	.attendance-container {
		display: flex;
		flex-direction: row;
		flex-wrap: no-wrap;
		gap: 2rem;
		margin: 0.5rem 0rem;
		justify-content: space-between;
	}

	.attendance-selector {
		width: 100%;
	}

	/* Mobile screen in portrait mode */
	@media screen and (max-width: 768px) and (max-height: 1024px) {
		.attendance-container {
			flex-wrap: wrap;
			gap: 1rem;
		}
	}

	.attendance-summary {
		display: flex;
		flex-direction: row;
		margin-top: 1rem;
		width: 100%;
		overflow-x: auto;

		> div {
			margin-right: 1rem;
		}
	}
`;

export default AttendanceTable;
