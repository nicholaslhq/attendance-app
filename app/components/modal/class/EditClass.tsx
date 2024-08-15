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
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";

function EditClass() {
	const [id, setId] = useState("");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [handleBy, setHandleBy] = useState<string | null>(null);
	const [handleName, setHandleName] = useState<string | null>(null);
	const [updatedAt, setUpdatedAt] = useState("");

	const { theme, users, allUsers, allClasses, modals, closeModal } =
		useGlobalState();

	interface Option {
		label: string;
		value: string;
	}

	useEffect(() => {
		allUsers();
	}, []);

	const userOptions: Option[] = users.map(
		(obj: { id: string; name: string }) => ({
			label: obj.name,
			value: obj.id,
		})
	);

	useEffect(() => {
		// Fetch class details based on classID and update the state
		const fetchClassDetails = async () => {
			try {
				const res = await axios.get(`/api/class/${modals.id}`);
				const classes = res.data;

				setId(classes.id);
				setName(classes.name);
				setDescription(classes.description);
				setHandleBy(classes.handleBy);
				setHandleName(classes.handleName);
				setUpdatedAt(classes.updatedAt);
			} catch (error) {
				toast.error("Something went wrong", {
					id: "fetchClassError",
				});
			}
		};

		fetchClassDetails();
	}, [id]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		const classes = {
			id,
			name,
			description,
			handleBy,
		};

		try {
			const res = await axios.put("/api/class", classes);

			if (res.data.error) {
				toast.error(res.data.error, {
					id: "editClassError",
				});
			}

			if (!res.data.error) {
				toast.success("Class updated successfully", {
					id: "editClassSuccess",
				});
				allClasses();
				closeModal();
			}
		} catch (error) {
			toast.error("Something went wrong", {
				id: "editClassUnknownError",
			});
			console.log(error);
		}
	};

	return (
		<EditClassStyled onSubmit={handleSubmit} theme={theme}>
			<div className="modal-title">
				<h1>Edit Class</h1>
				<button
					className="modal-close"
					onClick={() => closeModal("editClass")}
				>
					<CloseIcon />
				</button>
			</div>
			<div className="modal-input">
				<TextField
					id="name"
					label="Name"
					variant="outlined"
					value={name}
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
					value={description}
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
					id="combo-box-demo"
					options={userOptions}
					value={
						userOptions.find(
							(option) => option.label === handleName
						) || null
					}
					selectOnFocus
					clearOnBlur
					handleHomeEndKeys
					freeSolo={false}
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
							setHandleBy(newValue.value);
							setHandleName(newValue.label);
						} else {
							setHandleBy(null);
							setHandleName(null);
						}
					}}
					onInputChange={(event: any, newInputValue: React.SetStateAction<string | null>) => {
						setHandleBy(newInputValue);
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
						click={() => closeModal("editClass")}
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
		</EditClassStyled>
	);
}

const EditClassStyled = styled.form``;

export default EditClass;
