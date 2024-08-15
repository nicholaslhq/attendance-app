import { useGlobalState } from "@/app/context/GlobalContextProvider";
import React from "react";
import styled from "styled-components";

function Loader() {
	const { theme } = useGlobalState();

	return (
		<LoaderStyled theme={theme}>
			<span className="loader"></span>
		</LoaderStyled>
	);
}

const LoaderStyled = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${(props) => props.theme.colorBg2};
`;

export default Loader;
