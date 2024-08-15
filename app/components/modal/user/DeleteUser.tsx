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

function DeleteUser() {
	const [id, setId] = useState<string[]>([]);

	const { theme, setIsLoading, allUsers, modals, closeModal } =
		useGlobalState();

	useEffect(() => {
		const fetchUserDetails = async () => {
			try {
				if (modals.id && modals.id.length > 0) {
					const userDetailsPromises = modals.id.map(
						async (id: any) => {
							const res = await axios.get(`/api/user/${id}`);
							return res.data;
						}
					);

					const userDetails = await Promise.all(userDetailsPromises);
					const userIds = userDetails.map((user) => user.id);

					setId(userIds);
				}
			} catch (error) {
				toast.error("Something went wrong", {
					id: "fetchUserError",
				});
			}
		};

		fetchUserDetails();
	}, [modals.id]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		setIsLoading(true);

		try {
			const deleteRequests = id.map(async (id) => {
				const res = await axios.delete(`/api/user/${id}`);
				return res.data;
			});

			const responses = await Promise.all(deleteRequests);

			const hasError = responses.some((response) => response.error);

			if (hasError) {
				toast.error("Error deleting user", {
					id: "deleteUserError",
				});
			} else {
				toast.success("Users deleted successfully", {
					id: "deleteUserSuccess",
				});
				allUsers();
				closeModal();
			}
		} catch (error) {
			toast.error("Something went wrong", {
				id: "deleteUserUnknownError",
			});
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<DeleteUserStyled onSubmit={handleSubmit} theme={theme}>
			<div className="modal-title">
				<h1>Delete User</h1>
				<button
					className="modal-close"
					onClick={() => closeModal("deleteUser")}
				>
					<CloseIcon />
				</button>
			</div>
			<div className="modal-input">
				<label htmlFor="id">
					Are you sure you want to delete the following{" "}
					{id.length > 1 ? "users" : "user"}?
				</label>
				<TextField
					id="delete-user"
					label="User ID"
					multiline
					value={Array.isArray(id) ? id.join("\n") : id}
					rows={Math.min(id.length, 5)}
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
						click={() => closeModal("deleteUser")}
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
		</DeleteUserStyled>
	);
}

const DeleteUserStyled = styled.form``;

export default DeleteUser;
