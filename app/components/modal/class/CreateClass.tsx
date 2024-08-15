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
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useSession } from "next-auth/react";

function CreateClass() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [handleBy, setHandleBy] = useState<string | null>(null);

	const { data: session } = useSession();

	const createdBy = (session?.user as { id?: string | null | undefined })?.id ?? "UNKNOWN";

	const { theme, users, allUsers, allClasses, closeModal } = useGlobalState();

	useEffect(() => {
		allUsers();
	}, []);

	const userOptions = Array.isArray(users)
		? users.map((obj: { id: string; name: string }) => ({
				label: obj.name,
				value: obj.id,
		  }))
		: [];

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		const classes = {
			name,
			description,
			createdBy,
			handleBy,
		};

		try {
			const res = await axios.post("/api/class", classes);

			if (res.data.error) {
				toast.error(res.data.error, {
					id: "createClassError",
				});
			}

			if (!res.data.error) {
				toast.success("Class created successfully", {
					id: "createClassSuccess",
				});
				allClasses();
				closeModal();
			}
		} catch (error) {
			toast.error("Something went wrong", {
				id: "createClassUnknownError",
			});
			console.log(error);
		}
	};

	return (
		<CreateClassStyled onSubmit={handleSubmit} theme={theme}>
			<div className="modal-title">
				<h1>Create Class</h1>
				<button
					className="modal-close"
					onClick={() => closeModal("createClass")}
				>
					<CloseIcon />
				</button>
			</div>
			<div className="modal-input">
				<TextField
					id="name"
					label="Name"
					variant="outlined"
					required
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setName(event.target.value);
					}}
					InputProps={{
						style: {
							color: theme.colorGrey2,
						},
						placeholder: "Enter class name",
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
					id="description"
					label="Description"
					variant="outlined"
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setDescription(event.target.value);
					}}
					InputProps={{
						style: {
							color: theme.colorGrey2,
						},
						placeholder: "Enter class description",
					}}
					InputLabelProps={{
						style: {
							color: theme.colorGrey3,
						},
					}}
				/>
			</div>
			<div className="modal-input">
				<Autocomplete
					disablePortal
					id="handle-by"
					options={userOptions}
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
							label="Handle By"
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
							setHandleBy(newValue.value);
						} else {
							setHandleBy(null);
						}
					}}
					onInputChange={(event: any, newInputValue: React.SetStateAction<string | null>) => {
						setHandleBy(newInputValue);
					}}
				/>
			</div>
			<div className="modal-btn">
				<div className="modal-btn-primary">
					<Button
						type="submit"
						name="Create Class"
						icon={<AddIcon />}
						padding={"0.8rem 1.5rem"}
						borderRad={"0.8rem"}
						fw={"500"}
						fs={"1em"}
						background={theme.colorButtonPrimary}
					/>
				</div>
			</div>
		</CreateClassStyled>
	);
}

const CreateClassStyled = styled.form``;

export default CreateClass;
