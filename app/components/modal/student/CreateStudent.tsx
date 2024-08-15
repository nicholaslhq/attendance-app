"use client";
import React, { useEffect, useState } from "react";
import Button from "@/app/components/button/Button";
import styled from "styled-components";
import { useGlobalState } from "@/app/context/GlobalContextProvider";
import axios from "axios";
import toast from "react-hot-toast";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useSession } from "next-auth/react";

function CreateStudent() {
	const [eName, setEName] = useState("");
	const [cName, setCName] = useState("");
	const [bName, setBName] = useState("");
	const [gender, setGender] = useState("");
	const [classId, setClassId] = useState<string | null>(null);

	const { data: session } = useSession();

	const createdBy = (session?.user as { id?: string | null | undefined })?.id ?? "UNKNOWN";

	const { theme, classes, allClasses, allStudents, closeModal } =
		useGlobalState();

	useEffect(() => {
		allClasses();
	}, []);

	const classOptions = classes.map((obj: { id: string; name: string }) => ({
		label: obj.name,
		value: obj.id,
	}));

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		const students = {
			eName,
			cName,
			bName,
			gender,
			createdBy,
			classId,
		};

		try {
			const res = await axios.post("/api/student", students);

			if (res.data.error) {
				toast.error(res.data.error, {
					id: "createStudentError",
				});
			}

			if (!res.data.error) {
				toast.success("Student created successfully", {
					id: "createStudentSuccess",
				});
				allStudents();
				closeModal();
			}
		} catch (error) {
			toast.error("Something went wrong", {
				id: "createStudentUnknownError",
			});
			console.log(error);
		}
	};

	return (
		<CreateStudentStyled onSubmit={handleSubmit} theme={theme}>
			<div className="modal-title">
				<h1>Create Student</h1>
				<button
					className="modal-close"
					onClick={() => closeModal("createStudent")}
				>
					<CloseIcon />
				</button>
			</div>
			<div className="modal-input">
				<TextField
					id="eName"
					label="English Name"
					variant="outlined"
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
					select
					value={gender}
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
					onChange={(event: any, newValue: any) => {
						if (newValue) {
							setClassId(newValue.value);
						} else {
							setClassId(null);
						}
					}}
					onInputChange={(event: any, newInputValue: React.SetStateAction<string | null>) => {
						setClassId(newInputValue);
					}}
				/>
			</div>
			<div className="modal-btn">
				<div className="modal-btn-primary">
					<Button
						type="submit"
						name="Create Student"
						icon={<AddIcon />}
						padding={"0.8rem 1.5rem"}
						borderRad={"0.8rem"}
						fw={"500"}
						fs={"1em"}
						background={theme.colorButtonPrimary}
					/>
				</div>
			</div>
		</CreateStudentStyled>
	);
}

const CreateStudentStyled = styled.form``;

export default CreateStudent;
