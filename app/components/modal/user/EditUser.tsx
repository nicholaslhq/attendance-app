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
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import HistoryIcon from "@mui/icons-material/History";
import MenuItem from "@mui/material/MenuItem";

function EditUser() {
	const [id, setId] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	const [updatedAt, setUpdatedAt] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

	const { theme, allUsers, modals, closeModal } = useGlobalState();

	const handleTogglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	const handleToggleConfirmPasswordVisibility = () => {
		setConfirmPasswordVisible(!confirmPasswordVisible);
	};

	useEffect(() => {
		// Fetch user details based on userId and update the state
		const fetchUserDetails = async () => {
			try {
				const res = await axios.get(`/api/user/${modals.id}`);
				const user = res.data;

				setId(user.id);
				setName(user.name);
				setRole(user.role);
				setUpdatedAt(user.updatedAt);
			} catch (error) {
				toast.error("Something went wrong", {
					id: "fetchUserError",
				});
			}
		};

		fetchUserDetails();
	}, [id]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Passwords don't match", {
				id: "passwordMatchError",
			});
			return;
		}

		const user = {
			id,
			password,
			name,
			role,
		};

		try {
			const res = await axios.put("/api/user", user);

			if (res.data.error) {
				toast.error(res.data.error, {
					id: "editUserError",
				});
			}

			if (!res.data.error) {
				toast.success("User updated successfully", {
					id: "editUserSuccess",
				});
				allUsers();
				closeModal();
			}
		} catch (error) {
			toast.error("Something went wrong", {
				id: "editUserUnknownError",
			});
			console.log(error);
		}
	};

	return (
		<EditUserStyled onSubmit={handleSubmit} theme={theme}>
			<div className="modal-title">
				<h1>Edit User</h1>
				<button
					className="modal-close"
					onClick={() => closeModal("editUser")}
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
						id="userId"
						label="User ID"
						variant="outlined"
						value={id}
						required
						onChange={(
							event: React.ChangeEvent<HTMLInputElement>
						) => {
							setId(event.target.value);
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
					title="Enter a new password only if you want to change it"
					arrow
				>
					<TextField
						id="password"
						label="Password"
						variant="outlined"
						value={password}
						type={passwordVisible ? "text" : "password"}
						onChange={(
							event: React.ChangeEvent<HTMLInputElement>
						) => {
							setPassword(event.target.value);
						}}
						InputProps={{
							style: {
								color: theme.colorGrey2,
							},
							placeholder: "Enter password",
						}}
						InputLabelProps={{
							style: {
								color: theme.colorGrey3,
							},
						}}
					/>
				</Tooltip>
				<button
					type="button"
					className="modal-btn-password"
					onClick={handleTogglePasswordVisibility}
				>
					{passwordVisible ? (
						<VisibilityOffIcon />
					) : (
						<VisibilityIcon />
					)}
				</button>
			</div>
			<div className="modal-input">
				<TextField
					id="confirmPassword"
					label="Confirm Password"
					variant="outlined"
					value={confirmPassword}
					type={confirmPasswordVisible ? "text" : "password"}
					required={!password ? false : true}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setConfirmPassword(event.target.value);
					}}
					InputProps={{
						style: {
							color: theme.colorGrey2,
						},
						placeholder: "Enter password again",
					}}
					InputLabelProps={{
						style: {
							color: theme.colorGrey3,
						},
					}}
				/>
				<button
					type="button"
					className="modal-btn-password"
					onClick={handleToggleConfirmPasswordVisibility}
				>
					{confirmPasswordVisible ? (
						<VisibilityOffIcon />
					) : (
						<VisibilityIcon />
					)}
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
						placeholder: "Enter name",
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
					id="role"
					label="Role"
					variant="outlined"
					select
					required
					value={role}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setRole(event.target.value);
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
						placeholder: "Select user role",
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
					{["Admin", "Auditor", "User"].map((option) => (
						<MenuItem key={option} value={option.toUpperCase()}>
							{option}
						</MenuItem>
					))}
				</TextField>
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
						click={() => closeModal("editUser")}
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
		</EditUserStyled>
	);
}

const EditUserStyled = styled.form``;

export default EditUser;
