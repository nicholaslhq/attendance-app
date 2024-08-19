"use client";
import { useGlobalState } from "@/app/context/GlobalContextProvider";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import Button from "../../button/Button";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function Login() {
	const { theme } = useGlobalState();
	const { data: session, status } = useSession();
	const router = useRouter();

	const [id, setId] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);

	const handleTogglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!id || !password) {
			toast.error("One or more required fields are null or undefined", {
				id: "loginError",
			});
			return;
		}

		try {
			const result = await signIn("credentials", {
				id,
				password,
				redirect: false,
			});

			if (!result) {
				toast.error("Something went wrong", {
					id: "loginUnknownError",
				});
				console.error("signIn result undefined");
				return;
			}

			if (result.error) {
				toast.error("Login failed. Please check your credentials.", {
					id: "loginError",
				});
				return;
			}

			router.push("/");
		} catch (error) {
			toast.error("Something went wrong", {
				id: "loginUnknownError",
			});
			console.error("Login error:", error);
		}
	};

	useEffect(() => {
		if (status === "authenticated" && session) {
			router.push("/");
		}
	}, [status, session, router]);

	return (
		<LoginStyled onSubmit={handleSubmit} theme={theme}>
			<div className="modal-content">
				<div className="modal-title">
					<h1>Attendance App</h1>
				</div>
				<div className="modal-input">
					<TextField
						id="userId"
						label="User ID"
						variant="outlined"
						required
						onChange={(
							event: React.ChangeEvent<HTMLInputElement>
						) => {
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
				<div className="modal-btn">
					<div className="modal-btn-primary">
						<Button
							type="submit"
							name="Login"
							icon={<LoginIcon />}
							padding={"0.8rem 1.5rem"}
							borderRad={"0.8rem"}
							fw={"500"}
							fs={"1em"}
							background={theme.colorButtonPrimary}
						/>
					</div>
				</div>
			</div>
		</LoginStyled>
	);
}

const LoginStyled = styled.form`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: center;
	color: ${(props) => props.theme.colorGrey0};
	background: ${(props) => props.theme.colorBg3};

	.modal-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.75);
	}

	.modal-content {
		margin: 0 1rem;

		padding: 2rem;
		position: relative;
		max-width: 630px;
		width: 100%;

		border-radius: 1rem;
		background-color: ${(props) => props.theme.colorBg2};
		box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);

		@media screen and (max-width: 450px) {
			font-size: 90%;
		}

		/* Mobile screen in landscape mode */
		@media screen and (max-width: 1024px) and (max-height: 768px) {
			margin: 1.5rem 0;
			max-height: 90%;
			overflow-y: auto;
		}
	}

	.modal-title {
		display: flex;
		justify-content: space-between;

		h1 {
			font-size: clamp(1.2rem, 2vw, 2rem);
			font-weight: 800;
			position: relative;

			&::after {
				content: "";
				position: absolute;
				bottom: -0.1rem;
				left: 0;
				width: 5rem;
				height: 0.2rem;
				background-color: ${(props) => props.theme.colorGreenPrimary};
				border-radius: 0.5rem;
			}
		}
	}

	.modal-close {
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background-color: ${(props) => props.theme.colorBg};
		border: 2px solid ${(props) => props.theme.borderColor};
		box-shadow: ${(props) => props.theme.boxShadow};
		font-size: 1.4rem;

		/* Mobile screen in portrait mode */
		@media screen and (max-width: 768px) and (max-height: 1024px) {
			top: 3rem;
			right: 3.5rem;
		}

		&:hover {
			opacity: 0.8;
		}
	}

	.modal-input {
		display: flex;
		flex-direction: column;
		position: relative;
		margin: 2rem 0;
		font-weight: 500;

		/* Mobile screen in portrait mode */
		@media screen and (max-width: 768px) and (max-height: 1024px) {
			margin: 1.5rem 0;

			label {
				font-size: 0.8rem !important;
			}

			.asterisk {
				font-size: 0.6rem !important;
			}

			input {
				padding: 0.5rem 1rem !important;
			}
		}

		label {
			margin-bottom: 1rem;
			display: inline-block;
			font-size: clamp(0.8rem, 5vw, 1rem);
		}

		input,
		textarea {
			width: 100%;
			resize: none;
			background-color: ${(props) => props.theme.colorBg};
			border-radius: 0.5rem;
		}

		::placeholder {
			color: ${(props) => props.theme.colorGrey6};
			opacity: 0.8;
		}

		.modal-input-asterisk {
			color: ${(props) => props.theme.colorRed8} !important;
			font-size: 0.6rem;
			position: absolute;
			top: 0;
			margin-left: 0.2rem;
		}
	}

	.modal-btn {
		display: flex;
		flex-direction: row;
		justify-content: end;
		margin-top: 1rem;
		color: ${(props) => props.theme.colorButtonFont};

		.modal-btn-primary button {
			transition: all 0.3s ease-in-out;

			@media screen and (max-width: 500px) {
				font-size: 0.9rem !important;
				padding: 0.6rem 1rem !important;

				svg {
					font-size: 1.2rem !important;
					margin-right: 0.5rem !important;
				}
			}
		}

		.modal-btn-secondary button {
			transition: all 0.3s ease-in-out;
			margin-right: 1rem;

			@media screen and (max-width: 500px) {
				font-size: 0.9rem !important;
				padding: 0.6rem 1rem !important;

				svg {
					font-size: 1.2rem !important;
					margin-right: 0.5rem !important;
				}
			}
		}
	}

	.modal-input-password {
		position: relative;
	}

	.modal-btn-password {
		position: absolute;
		top: 50%;
		right: 1rem;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
	}

	.modal-last-modified-date {
		padding: 0rem 0.8rem;
		color: ${(props) => props.theme.colorGrey3};
	}
`;

export default Login;
