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

function DeleteStudent() {
	const [id, setId] = useState<string[]>([]);
	const [name, setName] = useState<string[]>([]);

	const { theme, setIsLoading, allStudents, modals, closeModal } =
		useGlobalState();

	useEffect(() => {
		const fetchStudentDetails = async () => {
			try {
				if (modals.id && modals.id.length > 0) {
					const studentDetailsPromises = modals.id.map(
						async (id: any) => {
							const res = await axios.get(`/api/student/${id}`);
							return res.data;
						}
					);

					const studentDetails = await Promise.all(
						studentDetailsPromises
					);
					const studentId = studentDetails.map((c) => c.id);
					const studentName = studentDetails.map((c) => c.eName);

					setId(studentId);
					setName(studentName);
				}
			} catch (error) {
				toast.error("Something went wrong", {
					id: "fetchStudentError",
				});
			}
		};

		fetchStudentDetails();
	}, [modals.id]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		setIsLoading(true);

		try {
			const deleteRequests = id.map(async (id) => {
				const res = await axios.delete(`/api/student/${id}`);
				return res.data;
			});

			const responses = await Promise.all(deleteRequests);
			const hasError = responses.some((response) => response.error);

			if (hasError) {
				toast.error("Error deleting student", {
					id: "deleteStudentError",
				});
			} else {
				toast.success("Student deleted successfully", {
					id: "deleteStudentSuccess",
				});
				allStudents();
				closeModal();
			}
		} catch (error) {
			toast.error("Something went wrong", {
				id: "deleteStudentUnknownError",
			});
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<DeleteStudentStyled onSubmit={handleSubmit} theme={theme}>
			<div className="modal-title">
				<h1>Delete Student</h1>
				<button
					className="modal-close"
					onClick={() => closeModal("deleteStudent")}
				>
					<CloseIcon />
				</button>
			</div>
			<div className="modal-input">
				<label>
					Are you sure you want to delete the following{" "}
					{id.length > 1 ? "students" : "student"}?
				</label>
				<TextField
					id="delete-student"
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
						click={() => closeModal("deleteStudent")}
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
		</DeleteStudentStyled>
	);
}

const DeleteStudentStyled = styled.form``;

export default DeleteStudent;
