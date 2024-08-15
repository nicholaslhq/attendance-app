"use client";
import React, { useState } from "react";
import Button from "@/app/components/button/Button";
import styled from "styled-components";
import { useGlobalState } from "@/app/context/GlobalContextProvider";
import axios from "axios";
import toast from "react-hot-toast";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useSession } from "next-auth/react";

function CreateSession() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	const { data: session } = useSession();

	const createdBy = (session?.user as { id?: string | null | undefined })?.id ?? "UNKNOWN";

	const { theme, allSessions, closeModal } = useGlobalState();

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		const sessions = {
			name,
			description,
			createdBy,
		};

		try {
			const res = await axios.post("/api/session", sessions);

			if (res.data.error) {
				toast.error(res.data.error, {
					id: "createSessionError",
				});
			}

			if (!res.data.error) {
				toast.success("Session created successfully", {
					id: "createSessionSuccess",
				});
				allSessions();
				closeModal();
			}
		} catch (error) {
			toast.error("Something went wrong", {
				id: "createSessionUnknownError",
			});
			console.log(error);
		}
	};

	return (
		<CreateSessionStyled onSubmit={handleSubmit} theme={theme}>
			<div className="modal-title">
				<h1>Create Session</h1>
				<button
					className="modal-close"
					onClick={() => closeModal("createSession")}
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
			<div className="modal-btn">
				<div className="modal-btn-primary">
					<Button
						type="submit"
						name="Create Session"
						icon={<AddIcon />}
						padding={"0.8rem 1.5rem"}
						borderRad={"0.8rem"}
						fw={"500"}
						fs={"1em"}
						background={theme.colorButtonPrimary}
					/>
				</div>
			</div>
		</CreateSessionStyled>
	);
}

const CreateSessionStyled = styled.form``;

export default CreateSession;
