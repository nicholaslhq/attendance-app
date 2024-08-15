"use client";
import React from "react";
import styled from "styled-components";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useGlobalState } from "@/app/context/GlobalContextProvider";
import { createTheme, ThemeProvider } from "@mui/material";
import Button from "../button/Button";
import { useRouter } from "next/navigation";

interface DashboardCardProps {
	title: string;
	content: string;
	link?: string | null;
	icon?: JSX.Element | null;
}

function DashboardCard({ title, content, link, icon }: DashboardCardProps) {
	const { theme, selectedTheme } = useGlobalState();

	const cardTheme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: selectedTheme == 0 ? "dark" : "light",
				},
			}),
		[selectedTheme]
	);

	const router = useRouter();

	const handleButtonClick = () => {
		if (link) {
			router.push(link);
		}
	};

	return (
		<DashboardCardStyled theme={theme}>
			<ThemeProvider theme={cardTheme}>
				<Card>
					<CardContent>
						<div className="card-container">
							{icon && link && (
								<div className="card-icon">
									<Button
										type="button"
										name=""
										icon={icon}
										padding={"0.5rem"}
										borderRad={"1rem"}
										fw={"500"}
										fs={"1em"}
										click={handleButtonClick}
									/>
								</div>
							)}
							{icon && !link && (
								<div className="card-icon">
									{icon && (
										<span style={{ padding: "0.5rem" }}>
											{icon}
										</span>
									)}
								</div>
							)}
							<div className="card-info">
								<div className="card-title">{title}</div>
								<div className="card-content">{content}</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</ThemeProvider>
		</DashboardCardStyled>
	);
}

const DashboardCardStyled = styled.div`
	.card-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		min-height: 10rem;

		/* Mobile screen in portrait mode */
		@media screen and (max-width: 768px) and (max-height: 1024px) {
			min-height: 6rem;
		}

		/* Mobile screen in landscape mode */
		@media screen and (max-width: 1024px) and (max-height: 768px) {
			min-height: 6rem;
		}
	}

	.card-icon {
		margin-left: 0.5rem;
		margin-right: 1.5rem;

		svg {
			width: 2.5rem;
			height: 2.5rem;
			color: ${(props) => props.theme.colorGrey2};
		}
	}

	.card-info {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.card-title {
		color: ${(props) => props.theme.colorGrey4};
	}

	.card-content {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		font-size: 2.5rem;
		color: ${(props) => props.theme.colorGrey2};
		line-height: 1;
		margin-top: 1rem;
	}
`;

export default DashboardCard;
