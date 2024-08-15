"use client";
import { useGlobalState } from "@/app/context/GlobalContextProvider";
import Link from "next/link";
import styled from "styled-components";

function NotFound() {
	const { theme } = useGlobalState();

	return (
		<NoPermissionErrorStyled theme={theme}>
			<div className="error-container">
				<div className="error-code">404</div>
				<div className="error-message">
					<div>This page could not be found.</div>
					<Link href="/" className="underline">
						Go to Dashboard
					</Link>
				</div>
			</div>
		</NoPermissionErrorStyled>
	);
}

const NoPermissionErrorStyled = styled.div`
	.error-container {
		height: 100vh;
		text-align: center;
		display: flex;
		flex-direction: row;
		vertical-align: middle;
		justify-content: center;
		align-items: center;
		background: ${(props) => props.theme.colorBg2};

		/* Mobile screen in portrait mode */
		@media screen and (max-width: 768px) and (max-height: 1024px) {
			flex-direction: column;
		}
	}

	.error-info {
		display: flex;
		flex-direction: row;
		vertical-align: middle;
		justify-content: center;
		align-items: center;
	}

	.error-code {
		font-size: 2rem;
		line-height: 2rem;
		padding: 1.5rem;
		margin-right: 1.5rem;
		border-right: 1px solid ${(props) => props.theme.colorGrey4};
		color: ${(props) => props.theme.colorGrey1};
		font-weight: bold;

		/* Mobile screen in portrait mode */
		@media screen and (max-width: 768px) and (max-height: 1024px) {
			border-right: 0px;
			border-bottom: 1px solid ${(props) => props.theme.colorGrey4};
			margin-bottom: 1rem;
		}
	}

	.error-message {
		font-size: 0.8rem;
		line-height: 2rem;
		color: ${(props) => props.theme.colorGrey2};
	}
`;

export default NotFound;
