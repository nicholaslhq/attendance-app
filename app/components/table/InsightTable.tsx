"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useGlobalState } from "@/app/context/GlobalContextProvider";
import {
	MaterialReactTable,
	useMaterialReactTable,
} from "material-react-table";
import toast from "react-hot-toast";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import RefreshIcon from "@mui/icons-material/Refresh";
import NumbersIcon from "@mui/icons-material/Numbers";
import PercentIcon from "@mui/icons-material/Percent";
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
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv";
import CircleIcon from "@mui/icons-material/Circle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

interface Props {
	title: string;
	cols: any[];
	refreshTable: any;
}

function InsightTable({ title, cols, refreshTable }: Props) {
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
	const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs());
	const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs());
	const [insightDetails, setInsightDetails] = useState<any[]>([]);
	const [displayPercentage, setDisplayPercentage] = useState(false);
	const [presentTotalCount, setPresentTotalCount] = useState<number>(0);
	const [absentTotalCount, setAbsentTotalCount] = useState<number>(0);
	const [onLeaveTotalCount, setOnLeaveTotalCount] = useState<number>(0);
	const [grandTotalCount, setGrandTotalCount] = useState<number>(0);

	useEffect(() => {
		handleSelectorChange(startDate, endDate, classId, sessionId);
	}, [startDate, endDate, classId, sessionId, refreshTable]);

	useEffect(() => {
		allClasses();
	}, []);

	useEffect(() => {
		allSessions();
	}, []);

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

	const handleStartDateChange = (date: Dayjs | null) => {
		setStartDate(date);
		handleSelectorChange(date, endDate, classId, sessionId);
	};

	const handleEndDateChange = (date: Dayjs | null) => {
		setEndDate(date);
		handleSelectorChange(startDate, date, classId, sessionId);
	};

	const handleClassChange = (event: any, newValue: any) => {
		if (newValue) {
			setClassId(newValue.value);
			handleSelectorChange(startDate, endDate, newValue.value, sessionId);
		} else {
			setClassId(null);
			handleSelectorChange(startDate, endDate, null, sessionId);
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
			handleSelectorChange(startDate, endDate, classId, newValue.value);
		} else {
			setSessionId(null);
			handleSelectorChange(startDate, endDate, classId, null);
		}
	};

	const handleSessionInputChange = (
		event: any,
		newInputValue: React.SetStateAction<string | null>
	) => {
		setSessionId(newInputValue);
	};

	const handleSelectorChange = async (
		startDate: Dayjs | null,
		endDate: Dayjs | null,
		classId: any,
		sessionId: any
	) => {
		setIsLoading(true);

		let start = null;
		let end = null;

		if (startDate && startDate.isValid()) {
			start = encodeURIComponent(startDate.startOf("day").toISOString());
		} else {
			toast.error("Invalid selected start date", {
				id: "selectInvalidStartDateError",
			});
			return;
		}

		if (endDate && endDate.isValid()) {
			end = encodeURIComponent(endDate.startOf("day").toISOString());
		} else {
			toast.error("Invalid selected end date", {
				id: "selectInvalidEndDateError",
			});
			return;
		}

		let apiUrl;
		if (classId && sessionId) {
			apiUrl = `/api/insight/insightByDateClassSession/${start}/${end}/${classId}/${sessionId}`;
		} else if (classId) {
			apiUrl = `/api/insight/insightByDateClass/${start}/${end}/${classId}`;
		} else if (sessionId) {
			apiUrl = `/api/insight/insightByDateSession/${start}/${end}/${sessionId}`;
		} else {
			apiUrl = `/api/insight/insightByDate/${start}/${end}`;
		}

		//Get latest insight detail based on selected date, classId, and sessionId
		if (start && end) {
			try {
				const res = await axios.get(apiUrl, { timeout: 600000 }); // Set timeout to 10 minutes

				const {
					presentTotalCount,
					absentTotalCount,
					onLeaveTotalCount,
					...insight
				} = res.data;

				// Check if details is not null and has length more than 0
				if (
					insight &&
					Object.values(insight).length > 0 &&
					!res.data.error
				) {
					setInsightDetails(Object.values(insight));
				} else {
					setInsightDetails([]);
				}

				setPresentTotalCount(presentTotalCount || 0);
				setAbsentTotalCount(absentTotalCount || 0);
				setOnLeaveTotalCount(onLeaveTotalCount || 0);

				const total =
					(presentTotalCount || 0) +
					(absentTotalCount || 0) +
					(onLeaveTotalCount || 0);
				setGrandTotalCount(total);
			} catch (error) {
				toast.error("Something went wrong", {
					id: "getInsightUnknownError",
				});
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		}

		setIsLoading(false);
	};

	const refetch = async () => {
		try {
			setIsLoading(true);
			handleSelectorChange(startDate, endDate, classId, sessionId);
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

	const handleDisplayPercentage = () => {
		setDisplayPercentage((prevState) => !prevState);
	};

	const csvConfig = mkConfig({
		fieldSeparator: ",",
		decimalSeparator: ".",
		useKeysAsHeaders: true,
	});

	const handleExportData = () => {
		const formattedStartDate = dayjs(startDate).format("YYYYMMDD");
		const formattedEndDate = dayjs(endDate).format("YYYYMMDD");
		const selectedClass = classes.find(
			(cls: { id: string | null }) => cls.id === classId
		);
		const className = selectedClass ? selectedClass.name : "AllClass";
		const selectedSession = sessions.find(
			(sess: { id: string | null }) => sess.id === sessionId
		);
		const sessionName = selectedSession
			? selectedSession.name
			: "AllSession";

		const rowData = insightDetailsWithCountAndPercentages.map((row) => ({
			...row,
		}));

		if (rowData && rowData.length > 0) {
			const fileName = `insight_${formattedStartDate}_to_${formattedEndDate}_${className}_${sessionName}`;
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

	const insightDetailsWithCountAndPercentages = useMemo(() => {
		if (insightDetails && insightDetails.length > 0) {
			return insightDetails.map((student) => ({
				...student,
				presentPercent:
					parseFloat(
						(
							(student.presentCount / student.totalCount) *
							100
						).toFixed(1)
					) + "%",
				absentPercent:
					parseFloat(
						(
							(student.absentCount / student.totalCount) *
							100
						).toFixed(1)
					) + "%",
				onleavePercent:
					parseFloat(
						(
							(student.onLeaveCount / student.totalCount) *
							100
						).toFixed(1)
					) + "%",
			}));
		}
		return [];
	}, [insightDetails]);

	const insightDetailsToggle = useMemo(() => {
		if (insightDetails && insightDetails.length > 0) {
			return insightDetails.map((student) => ({
				...student,
				presentCount: displayPercentage
					? `${parseFloat(
							(
								(student.presentCount / student.totalCount) *
								100
							).toFixed(1)
					  )}%`
					: student.presentCount,
				absentCount: displayPercentage
					? `${parseFloat(
							(
								(student.absentCount / student.totalCount) *
								100
							).toFixed(1)
					  )}%`
					: student.absentCount,
				onLeaveCount: displayPercentage
					? `${parseFloat(
							(
								(student.onLeaveCount / student.totalCount) *
								100
							).toFixed(1)
					  )}%`
					: student.onLeaveCount,
			}));
		}
		return [];
	}, [insightDetails, displayPercentage]);

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
		data: insightDetailsToggle || [],
		columns,
		getRowId: (row: { id: any }) => row.id,
		enableRowNumbers: true,
		// enableRowSelection: true,
		enableColumnOrdering: true,
		enableColumnPinning: true,
		enableStickyHeader: true,
		paginationDisplayMode: "pages",
		mrtTheme: {
			baseBackgroundColor: theme.colorBg,
			matchHighlightColor: theme.matchHighlightColor,
		},
		positionToolbarAlertBanner: "bottom",
		renderTopToolbarCustomActions: () => (
			<div className="flex flex-row gap-1 align-middle justify-center p-1">
				<Tooltip arrow title="Refresh">
					<IconButton onClick={handleRefresh} size="small">
						<RefreshIcon />
					</IconButton>
				</Tooltip>
				<Tooltip arrow title="Toggle number/percent">
					<IconButton onClick={handleDisplayPercentage} size="small">
						{displayPercentage ? <NumbersIcon /> : <PercentIcon />}
					</IconButton>
				</Tooltip>
				<Tooltip arrow title="Export as csv">
					<IconButton onClick={() => handleExportData()} size="small">
						<FileDownloadIcon />
					</IconButton>
				</Tooltip>
			</div>
		),
	});

	return (
		<InsightTableStyled theme={theme}>
			<ThemeProvider theme={tableTheme}>
				<div className="attendance-container">
					<div className="attendance-selector">
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								label="Start Date"
								value={startDate}
								onChange={handleStartDateChange}
								format="DD/MM/YYYY"
								sx={{
									width: "100%",
									backgroundColor: theme.colorBg,
								}}
							/>
						</LocalizationProvider>
					</div>
					<div className="attendance-selector">
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								label="End Date"
								value={endDate}
								onChange={handleEndDateChange}
								format="DD/MM/YYYY"
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
					{grandTotalCount > 0 && (
						<Chip
							icon={<CircleIcon />}
							label={`Total Attendance: ${grandTotalCount}`}
							variant="outlined"
						/>
					)}
					{presentTotalCount > 0 && (
						<Chip
							icon={<CheckCircleIcon />}
							label={`Total Present: ${presentTotalCount} (${parseFloat(
								(
									(presentTotalCount / grandTotalCount) *
									100
								).toFixed(1)
							)}%)`}
							variant="outlined"
						/>
					)}
					{absentTotalCount > 0 && (
						<Chip
							icon={<CancelIcon />}
							label={`Total Absent: ${absentTotalCount} (${parseFloat(
								(
									(absentTotalCount / grandTotalCount) *
									100
								).toFixed(1)
							)}%)`}
							variant="outlined"
						/>
					)}
					{onLeaveTotalCount > 0 && (
						<Chip
							icon={<RemoveCircleIcon />}
							label={`Total On Leave: ${onLeaveTotalCount} (${parseFloat(
								(
									(onLeaveTotalCount / grandTotalCount) *
									100
								).toFixed(1)
							)}%)`}
							variant="outlined"
						/>
					)}
				</div>
			</ThemeProvider>
		</InsightTableStyled>
	);
}

const InsightTableStyled = styled.div`
	width: 100%;
	overflow-x: auto;

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
		max-width: 100%;

		.attendance-container {
			flex-wrap: wrap;
			gap: 1rem;
		}
	}

	/* Mobile screen in landscape mode */
	@media screen and (max-width: 1024px) and (max-height: 768px) {
		max-width: 100%;
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

export default InsightTable;
