"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Button from "@/app/components/button/Button";
import styled from "styled-components";
import { useGlobalState } from "@/app/context/GlobalContextProvider";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDatetime } from "@/app/utils/formatDate";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import SaveIcon from "@mui/icons-material/Save";

function EditStudent() {
	const [id, setId] = useState("");
	const [eName, setEName] = useState("");
	const [cName, setCName] = useState("");
	const [bName, setBName] = useState("");
	const [gender, setGender] = useState("");
	const [classId, setClassId] = useState<string | null>(null);
	const [className, setClassName] = useState<string | null>(null);
	const [updatedAt, setUpdatedAt] = useState("");

	const { theme, classes, allClasses, allStudents, modals, closeModal } =
		useGlobalState();

	interface Option {
		label: string;
		value: string;
	}

	const classOptions: Option[] = classes.map(
		(obj: { id: string; name: string }) => ({
			label: obj.name,
			value: obj.id,
		})
	);

	useEffect(() => {
		allClasses();
	}, []);

	useEffect(() => {
		// Fetch student details based on studentID and update the state
		const fetchStudentDetails = async () => {
			try {
				const res = await axios.get(`/api/student/${modals.id}`);
				const student = res.data;

				setId(student.id);
				setEName(student.eName);
				setCName(student.cName);
				setBName(student.bName);
				setGender(student.gender);
				setClassId(student.classId);
				setClassName(student.className);
				setUpdatedAt(student.updatedAt);
			} catch (error) {
				toast.error("Something went wrong", {
					id: "fetchStudentError",
				});
			}
		};

		fetchStudentDetails();
	}, [id]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		const student = {
			id,
			eName,
			cName,
			bName,
			gender,
			classId,
		};

		try {
			const res = await axios.put("/api/student", student);

			if (res.data.error) {
				toast.error(res.data.error, {
					id: "editStudentError",
				});
			}

			if (!res.data.error) {
				toast.success("Student updated successfully", {
					id: "editStudentSuccess",
				});
				allStudents();
				closeModal();
			}
		} catch (error) {
			toast.error("Something went wrong", {
				id: "editStudentUnknownError",
			});
			console.log(error);
		}
	};

	return (
		<EditStudentStyled onSubmit={handleSubmit} theme={theme}>
			<div className="modal-title">
				<h1>Edit Student</h1>
				<button
					className="modal-close"
					onClick={() => closeModal("editStudent")}
				>
					<CloseIcon />
				</button>
			</div>
			<div className="modal-input">
				<TextField
					id="eName"
					label="English Name"
					variant="outlined"
					value={eName}
					required
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setEName(event.target.value);
					}}
					InputProps={{
						style: {
							color: theme.colorGrey2,
						},
						placeholder: "Enter english name",
					}}
					InputLabelProps={{
						style: {
							color: theme.colorGrey3,
						},
					}}
				/>
			</div>
			<div className="modal-input">
				<TextField
					id="cName"
					label="Chinese Name"
					variant="outlined"
					value={cName}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setCName(event.target.value);
					}}
					InputProps={{
						style: {
							color: theme.colorGrey2,
						},
						placeholder: "Enter chinese name",
					}}
					InputLabelProps={{
						style: {
							color: theme.colorGrey3,
						},
					}}
				/>
			</div>
			<div className="modal-input">
				<TextField
					id="bName"
					label="Baptismal Name"
					variant="outlined"
					value={bName}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setBName(event.target.value);
					}}
					InputProps={{
						style: {
							color: theme.colorGrey2,
						},
						placeholder: "Enter baptismal name",
					}}
					InputLabelProps={{
						style: {
							color: theme.colorGrey3,
						},
					}}
				/>
			</div>
			<div className="modal-input">
				<TextField
					id="gender"
					label="Gender"
					variant="outlined"
					value={gender}
					select
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setGender(event.target.value);
					}}
					sx={{
						".MuiSvgIcon-root": {
							color: theme.colorGrey2,
						},
					}}
					InputProps={{
						style: {
							color: theme.colorGrey2,
							background: theme.colorBg,
						},
						placeholder: "Enter class description",
					}}
					InputLabelProps={{
						style: {
							color: theme.colorGrey3,
						},
					}}
					SelectProps={{
						MenuProps: {
							PaperProps: {
								style: {
									color: theme.colorGrey2,
									background: theme.colorBg,
								},
							},
						},
					}}
				>
					{["Male", "Female"].map((option) => (
						<MenuItem key={option} value={option}>
							{option}
						</MenuItem>
					))}
				</TextField>
			</div>
			<div className="modal-input">
				<Autocomplete
					disablePortal
					id="attend-class"
					options={classOptions}
					value={
						classOptions.find(
							(option) => option.label === className
						) || null
					}
					noOptionsText={
						<span style={{ color: theme.colorGrey2 }}>
							No options
						</span>
					}
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
							label="Class Attended"
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
					onChange={(event, newValue) => {
						if (newValue && newValue.label) {
							setClassId(newValue.value);
							setClassName(newValue.label);
						} else {
							setClassId(null);
							setClassName(null);
						}
					}}
					onInputChange={(event: any, newInputValue: React.SetStateAction<string | null>) => {
						setClassId(newInputValue);
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
						click={() => closeModal("editStudent")}
					/>
				</div>
				<div className="modal-btn-primary">
					<Button
						type="submit"
						name="Save"
						icon={<SaveIcon />}
						padding={"0.8rem 1.5rem"}
						borderRad={"0.8rem"}
						fw={"500"}
						fs={"1em"}
						background={theme.colorButtonPrimary}
					/>
				</div>
			</div>
		</EditStudentStyled>
	);
}

const EditStudentStyled = styled.form``;

export default EditStudent;
