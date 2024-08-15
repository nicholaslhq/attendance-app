import HomeIcon from "@mui/icons-material/Home";
import ChecklistIcon from "@mui/icons-material/Checklist";
import GroupsIcon from "@mui/icons-material/Groups";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SchoolIcon from "@mui/icons-material/School";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import InsightsIcon from "@mui/icons-material/Insights";

// menu.js
const menu = [
	{
		id: 1,
		title: "Dashboard",
		icon: <HomeIcon />,
		link: "/",
		roles: ["ADMIN", "AUDITOR", "USER"],
	},
	{
		id: 2,
		title: "Attendance",
		icon: <ChecklistIcon />,
		link: "/attendance",
		roles: ["ADMIN", "USER"],
	},
	{
		id: 3,
		title: "Class",
		icon: <GroupsIcon />,
		link: "/class",
		roles: ["ADMIN", "AUDITOR"],
	},
	{
		id: 4,
		title: "Session",
		icon: <EventNoteIcon />,
		link: "/session",
		roles: ["ADMIN", "AUDITOR"],
	},
	{
		id: 5,
		title: "Student",
		icon: <SchoolIcon />,
		link: "/student",
		roles: ["ADMIN", "AUDITOR"],
	},
	{
		id: 6,
		title: "User",
		icon: <ManageAccountsIcon />,
		link: "/user",
		roles: ["ADMIN"],
	},
	{
		id: 7,
		title: "Insight",
		icon: <InsightsIcon />,
		link: "/insight",
		roles: ["ADMIN", "AUDITOR", "USER"],
	},
];

export default menu;
