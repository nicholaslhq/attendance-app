import React from "react";
import DashboardCard from "./DashboardCard";
import Grid from "@mui/material/Grid";

interface DashboardCardProps {
	title: string;
	content: string;
	link?: string | null;
	icon?: JSX.Element | null;
}

interface DashboardGridProps {
	cards: DashboardCardProps[];
}

function DashboardGrid({ cards }: DashboardGridProps) {
	return (
		<Grid container spacing={2}>
			{cards.map((card, index) => (
				<Grid item xs={12} sm={6} md={4} lg={3} key={index}>
					<DashboardCard {...card} />
				</Grid>
			))}
		</Grid>
	);
}

export default DashboardGrid;
