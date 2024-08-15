"use client";
import React from "react";
import styled from "styled-components";
import { useGlobalState } from "@/app/context/GlobalContextProvider";
import Sidebar from "../components/sidebar/Sidebar";

interface Props {
	children: React.ReactNode;
}

function GlobalStyleProvider({ children }: Props) {
	const { collapsed, collapseNav } = useGlobalState();
	const isSignInPage = typeof window !== 'undefined' && window.location.pathname === "/login";

	return (
		<GlobalStyled collapsed={collapsed}>
			{!isSignInPage && (
				<div className="nav-overlay" onClick={collapseNav}></div>
			)}
			{!isSignInPage && <Sidebar />}
			{children}
		</GlobalStyled>
	);
}

const GlobalStyled = styled.div<{ collapsed: boolean }>`
	display: flex;
	height: 100%;
	transition: all 0.3s ease-in-out;

	/* Mobile screen in portrait mode */
	@media screen and (max-width: 768px) and (max-height: 1024px) {
		.nav-overlay {
			display: ${(props) =>
				props.collapsed ? "none" : "block"} !important;
		}
	}

	/* Mobile screen in landscape mode */
	@media screen and (max-width: 1024px) and (max-height: 768px) {
		.nav-overlay {
			display: ${(props) =>
				props.collapsed ? "none" : "block"} !important;
		}
	}

	.nav-overlay {
		display: none;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.75);
		z-index: 10;
	}
`;

export default GlobalStyleProvider;
