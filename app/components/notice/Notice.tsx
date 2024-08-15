"use client";
import React, { useEffect, useState } from "react";
import { useGlobalState } from "@/app/context/GlobalContextProvider";
import { createTheme, Skeleton, TextField, ThemeProvider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CampaignIcon from "@mui/icons-material/Campaign";
import Button from "../button/Button";
import styled from "styled-components";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";

function Notice({ role }: { role: string }) {
	const { theme, selectedTheme, isLoading, setIsLoading } = useGlobalState();

	const noticeTheme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: selectedTheme == 0 ? "dark" : "light",
				},
			}),
		[selectedTheme]
	);

	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [createdAt, setCreatedAt] = useState("");

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get("/api/notice");
			const { title, content, createdAt } = response.data || {
				title: "",
				content: "",
			};
			await setTitle(title);
			await setContent(content);
			await setCreatedAt(createdAt);
		} catch (error) {
			console.error("Error fetching notice: ", error);
		} finally {
			setIsLoading(false);
		}
	};

	const { data: session } = useSession();

	const createdBy = (session?.user as { id?: string | null | undefined })?.id ?? "UNKNOWN";

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
		fetchData();
	};

	const handleSave = async () => {
		if (title.length === 0 && content.length > 0) {
			toast.error("Title cannot be empty", {
				id: "emptyNoticeTitleError",
			});
			return;
		}

		const notice = {
			title,
			content,
			createdBy,
		};

		try {
			const res = await axios.post("/api/notice", notice);

			if (res.data.error) {
				toast.error(res.data.error, {
					id: "updateNoticeError",
				});
			}

			if (!res.data.error) {
				toast.success("Notice updated successfully", {
					id: "updateNoticeSuccess",
				});
			}
		} catch (error: any) {
			if (
				error.response &&
				error.response.status === 500 &&
				error.response.data === ""
			) {
				// Empty response, do nothing
				toast.success("Notice updated successfully", {
					id: "updateNoticeSuccess",
				});
			} else {
				toast.error("Something went wrong", {
					id: "updateNoticeUnknownError",
				});
				console.log(error);
			}
		} finally {
			fetchData();
			setIsEditing(false);
		}
	};

	return (
		<NoticeStyled theme={theme}>
			<ThemeProvider theme={noticeTheme}>
				<Tooltip
					title={!isEditing && createdAt ? `Created on ${dayjs(createdAt).format("DD/MM/YYYY")}` : ""}
					placement="bottom-start"
					arrow
				>
					<div className="notice-container">
						<div className="notice-info">
							<div className="notice-icon">
								<CampaignIcon />
							</div>
							<div className="notice-content">
								{isEditing ? (
									<>
										<TextField
											id="notice-title"
											label="Title"
											value={title}
											onChange={(e: {
												target: {
													value: React.SetStateAction<string>;
												};
											}) => setTitle(e.target.value)}
											required
											fullWidth
											className="notice-title"
										/>
										<TextField
											id="notice-body"
											label="Body"
											multiline
											rows={Math.min(
												Math.ceil(content.length / 100),
												5
											)}
											value={content}
											onChange={(e: {
												target: {
													value: React.SetStateAction<string>;
												};
											}) => setContent(e.target.value)}
											fullWidth
											className="notice-body"
										/>
									</>
								) : isLoading ? (
									<>
										<Skeleton animation="wave" />
										<Skeleton animation="wave" />
									</>
								) : (
									<>
										<div
											className={`notice-title ${
												!title && "notice-title-default"
											}`}
										>
											{title || "No notice available"}
										</div>
										<div className="notice-body">
											{content}
										</div>
									</>
								)}
							</div>
						</div>
						{role === "ADMIN" ? (
							<div className="notice-button">
								{isEditing ? (
									<>
										<Button
											type="button"
											name=""
											icon={<CloseIcon />}
											padding={"0.5rem"}
											borderRad={"1rem"}
											fw={"500"}
											fs={"1em"}
											click={handleCancel}
										/>
										<Button
											type="button"
											name=""
											icon={<CheckIcon />}
											padding={"0.5rem"}
											borderRad={"1rem"}
											fw={"500"}
											fs={"1em"}
											click={handleSave}
										/>
									</>
								) : (
									<Button
										type="button"
										name=""
										icon={<EditIcon />}
										padding={"0.5rem"}
										borderRad={"1rem"}
										fw={"500"}
										fs={"1em"}
										click={handleEdit}
									/>
								)}
							</div>
						) : null}
					</div>
				</Tooltip>
			</ThemeProvider>
		</NoticeStyled>
	);
}

const NoticeStyled = styled.div`
	.notice-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: ${(props) => props.theme.colorBg4};
		border-radius: 1rem;
		margin-bottom: 1rem;
		color: ${(props) => props.theme.colorGrey1};
	}

	.notice-info {
		display: flex;
		flex-direction: row;
		width: 100%;
	}

	.notice-icon {
		margin-right: 0.5rem;
	}

	.notice-content {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 0.1rem;
	}

	.notice-title {
		margin-bottom: 0.5rem;
	}

	.notice-title-default {
		font-style: italic;
		color: ${(props) => props.theme.colorGrey4};
	}

	.notice-body {
		color: ${(props) => props.theme.colorGrey3};
	}

	.notice-button {
		margin-left: 1rem;
	}
`;

export default Notice;
