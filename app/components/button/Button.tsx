"use client";
import { useGlobalState } from "@/app/context/GlobalContextProvider";

import React from "react";
import styled from "styled-components";

interface Props {
	icon?: React.ReactNode;
	name?: string;
	background?: string;
	padding?: string;
	borderRad?: string;
	fw?: string;
	fs?: string;
	click?: () => void;
	type?: "submit" | "button" | "reset" | undefined;
	border?: string;
	color?: string;
	disabled?: boolean;
}

function Button({
	icon,
	name,
	background,
	padding,
	borderRad,
	fw,
	fs,
	click,
	type,
	border,
	color,
	disabled,
}: Props) {
	const { theme } = useGlobalState();

	return (
		<ButtonStyled
			type={type}
			style={{
				background: background,
				padding: padding || "0.5rem 1rem",
				borderRadius: borderRad || "0.5rem",
				fontWeight: fw || "500",
				fontSize: fs,
				border: border || "none",
				color: color,
			}}
			theme={theme}
			onClick={click}
			disabled={disabled}
		>
			{icon && icon}
			{name}
		</ButtonStyled>
	);
}

const ButtonStyled = styled.button`
	position: relative;
	display: flex;
	align-items: center;
	z-index: 5;
	cursor: pointer;
	transition: all 0.3s ease-in-out;
	gap: 0.5rem;

	/* Mobile screen in portrait mode */
	@media screen and (max-width: 768px) and (max-height: 1024px) {
		gap: 0.2rem;
	}

	svg {
		font-size: 1.2rem;
		transition: all 0.3s ease-in-out;
	}

	&:hover {
		opacity: 0.85;
	}
`;

export default Button;
