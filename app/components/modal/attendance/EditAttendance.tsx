"use client";
import React, { useState, useEffect } from "react";
import Button from "@/app/components/button/Button";
import styled from "styled-components";
import { useGlobalState } from "@/app/context/GlobalContextProvider";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDatetime } from "@/app/utils/formatDate";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";

interface Props {
	refreshTable: () => void;
}

function EditAttendance({ refreshTable }: Props) {
	const [id, setId] = useState("");
	const [name, setName] = useState("");
	const [status, setStatus] = useState("");
	const [remark, setRemark] = useState("");
	const [updatedAt, setUpdatedAt] = useState("");

	const { theme, modals, closeModal } = useGlobalState();

	useEffect(() => {
		// Fetch attendance remark based on attendanceID and update the state
		const fetchAttendanceDetails = async () => {
			try {
				const res = await axios.get(
					`/api/attendanceList/attendanceListById/${modals.id}`
				);
				const attendance = res.data;

				setId(attendance.id);
				setName(attendance.eName);
				setStatus(attendance.status);
				setRemark(attendance.remark);
				setUpdatedAt(attendance.updatedAt);
			} catch (error) {
				toast.error("Something went wrong", {
					id: "fetchAttendanceError",
				});
				console.log(error);
			}
		};

		fetchAttendanceDetails();
	}, [id]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		const attendance = {
			id,
			remark,
		};

		try {
			const res = await axios.put("/api/attendanceList", attendance);

			if (res.data.error) {
				toast.error(res.data.error, {
					id: "editAttendanceRemarkError",
				});
			}

			if (!res.data.error) {
				toast.success("Remark updated successfully", {
					id: "editAttendanceRemarkSuccess",
				});

				refreshTable();
				closeModal();
			}
		} catch (error) {
			toast.error("Something went wrong", {
				id: "editAttendanceRemarkUnknownError",
			});
			console.log(error);
		}
	};

	const getStatusString = (status: string) => {
		switch (status) {
			case "PRESENT":
				return "Present";
			case "ABSENT":
				return "Absent";
			case "ONLEAVE":
				return "On Leave";
			default:
				return " ";
		}
	};

	return (
		<EditAttendanceStyled onSubmit={handleSubmit} theme={theme}>
			<div className="modal-title">
				<h1>Edit Attendance</h1>
				<button
					className="modal-close"
					onClick={() => closeModal("editAttendance")}
				>
					<CloseIcon />
				</button>
			</div>
			<div className="modal-input">
				<Tooltip
					title="This field is read-only and cannot be edited"
					arrow
				>
					<TextField
						id="name"
						label="E. Name"
						variant="outlined"
						value={name}
						onChange={(
							event: React.ChangeEvent<HTMLInputElement>
						) => {
							setName(event.target.value);
						}}
						InputProps={{
							readOnly: true,
							style: {
								color: theme.colorGrey2,
							},
						}}
						InputLabelProps={{
							style: {
								color: theme.colorGrey3,
							},
						}}
					/>
				</Tooltip>
			</div>
			<div className="modal-input">
				<Tooltip
					title="This field is read-only and cannot be edited"
					arrow
				>
					<TextField
						id="status"
						label="Status"
						variant="outlined"
						value={getStatusString(status)}
						onChange={(
							event: React.ChangeEvent<HTMLInputElement>
						) => {
							setStatus(event.target.value);
						}}
						InputProps={{
							readOnly: true,
							style: {
								color: theme.colorGrey2,
							},
						}}
						InputLabelProps={{
							style: {
								color: theme.colorGrey3,
							},
						}}
					/>
				</Tooltip>
			</div>
			<div className="modal-input">
				<TextField
					id="remark"
					label="Remark"
					variant="outlined"
					value={remark}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setRemark(event.target.value);
					}}
					InputProps={{
						style: {
							color: theme.colorGrey2,
						},
						placeholder: "Enter attendance remark",
					}}
					InputLabelProps={{
						style: {
							color: theme.colorGrey3,
						},
					}}
				/>
			</div>
			<div className="modal-last-modified-date">
				<Tooltip title="Last modified date" arrow>
					<span>
						<HistoryIcon /> {formatDatetime(updatedAt)}
					</span>
				</Tooltip>
			</div>
			<div className="modal-btn">
				<div className="modal-btn-secondary">
					<Button
						type="button"
						name="Cancel"
						icon={<CloseIcon />}
						padding={"0.8rem 1.5rem"}
						borderRad={"0.8rem"}
						fw={"500"}
						fs={"1em"}
						background={theme.colorButtonSecondary}
						click={() => closeModal("editAttendance")}
					/>
				</div>
				<div className="modal-btn-primary">
					<Button
						type="submit"
						name="Save"
						icon={<CheckIcon />}
						padding={"0.8rem 1.5rem"}
						borderRad={"0.8rem"}
						fw={"500"}
						fs={"1em"}
						background={theme.colorButtonPrimary}
					/>
				</div>
			</div>
		</EditAttendanceStyled>
	);
}

const EditAttendanceStyled = styled.form``;

export default EditAttendance;
