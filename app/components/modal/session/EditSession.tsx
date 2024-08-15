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

function EditSession() {
	const [id, setId] = useState("");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [updatedAt, setUpdatedAt] = useState("");

	const { theme, users, allSessions, modals, closeModal } = useGlobalState();

	useEffect(() => {
		// Fetch session details based on ID and update the state
		const fetchSessionDetails = async () => {
			try {
				const res = await axios.get(`/api/session/${modals.id}`);
				const session = res.data;

				setId(session.id);
				setName(session.name);
				setDescription(session.description);
				setUpdatedAt(session.updatedAt);
			} catch (error) {
				toast.error("Something went wrong", {
					id: "fetchSessionError",
				});
			}
		};

		fetchSessionDetails();
	}, [id]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		const session = {
			id,
			name,
			description,
		};

		try {
			const res = await axios.put("/api/session", session);

			if (res.data.error) {
				toast.error(res.data.error, {
					id: "editSessionError",
				});
			}

			if (!res.data.error) {
				toast.success("Session updated successfully", {
					id: "editSessionSuccess",
				});
				allSessions();
				closeModal();
			}
		} catch (error) {
			toast.error("Something went wrong", {
				id: "editSessionUnknownError",
			});
			console.log(error);
		}
	};

	return (
		<EditSessionStyled onSubmit={handleSubmit} theme={theme}>
			<div className="modal-title">
				<h1>Edit Session</h1>
				<button
					className="modal-close"
					onClick={() => closeModal("editSession")}
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
						placeholder: "Enter session name",
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
						placeholder: "Enter session description",
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
						click={() => closeModal("editSession")}
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
		</EditSessionStyled>
	);
}

const EditSessionStyled = styled.form``;

export default EditSession;
