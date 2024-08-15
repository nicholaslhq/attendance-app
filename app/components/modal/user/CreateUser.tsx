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
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import MenuItem from "@mui/material/MenuItem";
import { useSession } from "next-auth/react";

function CreateUser() {
	const [id, setId] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

	const { theme, allUsers, closeModal } = useGlobalState();

	const { data: session } = useSession();

	const createdBy = (session?.user as { id?: string | null | undefined })?.id ?? "UNKNOWN";

	const handleTogglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	const handleToggleConfirmPasswordVisibility = () => {
		setConfirmPasswordVisible(!confirmPasswordVisible);
	};

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
			createdBy,
		};

		try {
			const res = await axios.post("/api/user", user);

			if (res.data.error) {
				toast.error(res.data.error, {
					id: "createUserError",
				});
			}

			if (!res.data.error) {
				toast.success("User created successfully", {
					id: "createUserSuccess",
				});
				allUsers();
				closeModal();
			}
		} catch (error) {
			toast.error("Something went wrong", {
				id: "createUserUnknownError",
			});
			console.log(error);
		}
	};

	return (
		<CreateUserStyled onSubmit={handleSubmit} theme={theme}>
			<div className="modal-title">
				<h1>Create User</h1>
				<button
					className="modal-close"
					onClick={() => closeModal("createUser")}
				>
					<CloseIcon />
				</button>
			</div>
			<div className="modal-input">
				<TextField
					id="userId"
					label="User ID"
					variant="outlined"
					required
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setId(event.target.value);
					}}
					InputProps={{
						style: {
							color: theme.colorGrey2,
						},
						placeholder: "Enter user ID",
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
					id="password"
					label="Password"
					variant="outlined"
					type={passwordVisible ? "text" : "password"}
					required
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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
					type={confirmPasswordVisible ? "text" : "password"}
					required
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
			<div className="modal-btn">
				<div className="modal-btn-primary">
					<Button
						type="submit"
						name="Create User"
						icon={<AddIcon />}
						padding={"0.8rem 1.5rem"}
						borderRad={"0.8rem"}
						fw={"500"}
						fs={"1em"}
						background={theme.colorButtonPrimary}
					/>
				</div>
			</div>
		</CreateUserStyled>
	);
}

const CreateUserStyled = styled.form``;

export default CreateUser;
