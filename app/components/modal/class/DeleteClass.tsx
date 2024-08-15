"use client";
import React, { useState, useEffect } from "react";
import Button from "@/app/components/button/Button";
import styled from "styled-components";
import { useGlobalState } from "@/app/context/GlobalContextProvider";
import axios from "axios";
import toast from "react-hot-toast";
import TextField from "@mui/material/TextField";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

function DeleteClass() {
	const [id, setId] = useState<string[]>([]);
	const [name, setName] = useState<string[]>([]);

	const { theme, setIsLoading, allClasses, modals, closeModal } =
		useGlobalState();

	useEffect(() => {
		const fetchClassDetails = async () => {
			try {
				if (modals.id && modals.id.length > 0) {
					const promise = modals.id.map(async (id: any) => {
						const res = await axios.get(`/api/class/${id}`);
						return res.data;
					});

					const classDetails = await Promise.all(promise);
					const classId = classDetails.map((c) => c.id);
					const className = classDetails.map((c) => c.name);

					setId(classId);
					setName(className);
				}
			} catch (error) {
				toast.error("Something went wrong", {
					id: "fetchClassError",
				});
			}
		};

		fetchClassDetails();
	}, [modals.id]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		setIsLoading(true);

		try {
			const deleteRequests = id.map(async (id) => {
				const res = await axios.delete(`/api/class/${id}`);
				return res.data;
			});

			const responses = await Promise.all(deleteRequests);

			const hasError = responses.some((response) => response.error);

			if (hasError) {
				toast.error("Error deleting class", {
					id: "deleteClassError",
				});
			} else {
				toast.success("Class deleted successfully", {
					id: "deleteClassSuccess",
				});
				allClasses();
				closeModal();
			}
		} catch (error) {
			toast.error("Something went wrong", {
				id: "deleteClassUnknownError",
			});
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<DeleteClassStyled onSubmit={handleSubmit} theme={theme}>
			<div className="modal-title">
				<h1>Delete Class</h1>
				<button
					className="modal-close"
					onClick={() => closeModal("deleteClass")}
				>
					<CloseIcon />
				</button>
			</div>
			<div className="modal-input">
				<label>
					Are you sure you want to delete the following{" "}
					{id.length > 1 ? "classes" : "class"}?
				</label>
				<TextField
					id="name"
					label="Name"
					multiline
					value={Array.isArray(name) ? name.join("\n") : name}
					rows={Math.min(name.length, 5)}
					defaultValue={"Loading..."}
					InputProps={{
						readOnly: true,
						style: {
							color: theme.colorGrey2,
							background: theme.colorBg,
							overflowY: "auto",
						},
					}}
					InputLabelProps={{
						style: {
							color: theme.colorGrey3,
						},
					}}
				/>
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
						click={() => closeModal("deleteClass")}
					/>
				</div>
				<div className="modal-btn-primary">
					<Button
						type="submit"
						name="Confirm"
						icon={<CheckIcon />}
						padding={"0.8rem 1.5rem"}
						borderRad={"0.8rem"}
						fw={"500"}
						fs={"1em"}
						background={theme.colorButtonWarning}
					/>
				</div>
			</div>
		</DeleteClassStyled>
	);
}

const DeleteClassStyled = styled.form``;

export default DeleteClass;
