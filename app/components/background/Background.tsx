"use client";
import { useGlobalState } from "@/app/context/GlobalContextProvider";
import React from "react";
import styled from "styled-components";

interface Props {
	title: string;
	children: React.ReactNode;
}

function Background({ title, children }: Props) {
	const { theme } = useGlobalState();

	return (
		<BackgroundStyled theme={theme}>
			<h1 className="bg-title">{title}</h1>
			<div className="bg-container">{children}</div>
		</BackgroundStyled>
	);
}

const BackgroundStyled = styled.main`
	position: relative;
	padding: 2rem;
	height: 100%;
	width: 100%;
	background-color: ${(props) => props.theme.colorBg2};
	overflow-y: auto;
	transition: all 0.3s ease;
	display: flex;
	flex-direction: column;
	flex-grow: 1;

	&::-webkit-scrollbar {
		width: 0.5rem;
	}

	/* Mobile screen in portrait mode */
	@media screen and (max-width: 768px) and (max-height: 1024px) {
		padding: 1.5rem;
		border-radius: 0rem;
	}

	.bg-add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		position: fixed;
		top: 4.5rem;
		right: 4.5rem;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background-color: ${(props) => props.theme.colorBg};
		border: 2px solid ${(props) => props.theme.borderColor};
		box-shadow: ${(props) => props.theme.boxShadow};
		color: ${(props) => props.theme.colorGrey2};
		font-size: 1.4rem;

		/* Mobile screen in portrait mode */
		@media screen and (max-width: 768px) and (max-height: 1024px) {
			top: 2.5rem;
			right: 3rem;
		}

		&:hover {
			opacity: 0.8;
		}
	}

	.bg-title {
		color: ${(props) => props.theme.colorGrey0};
		font-size: clamp(1.5rem, 2vw, 2rem);
		font-weight: 800;
		position: relative;
		margin-bottom: 1rem;

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

	.bg-container {
		display: flex;
		flex-direction: column;
	}
`;

export default Background;
