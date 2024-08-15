"use client";
import Background from "./components/background/Background";
import DashboardGrid from "./components/dashboard/DashboardGrid";
import Notice from "./components/notice/Notice";
import TodayIcon from "@mui/icons-material/Today";
import GroupsIcon from "@mui/icons-material/Groups";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalState } from "./context/GlobalContextProvider";
import { formatDateMonth } from "@/app/utils/formatDate";
import toast from "react-hot-toast";
import menu from "@/app/utils/menu";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import NoPermissionError from "./components/error/NoPermissionError";
import Loader from "./components/loader/Loader";

export default function page() {
	const { setIsLoading } = useGlobalState();

	const [todayDate, setTodayDate] = useState("");
	const [studentCount, setStudentCount] = useState("0");
	const [classCount, setClassCount] = useState("0");
	const [sessionCount, setSessionCount] = useState("0");
	const [presentCount, setPresentCount] = useState("0");
	const [absentCount, setAbsentCount] = useState("0");
	const [onLeaveCount, setOnLeaveCount] = useState("0");
	const [attendanceCount, setAttendanceCount] = useState("0");

	useEffect(() => {
		fetchData();
		getCurrentDate();
	}, []);

	const fetchData = async () => {
		setIsLoading(true);

		try {
			const response = await axios.get("/api/dashboard");
			const {
				studentCount,
				classCount,
				sessionCount,
				presentCount,
				absentCount,
				onLeaveCount,
			} = response.data;

			setStudentCount(studentCount);
			setClassCount(classCount);
			setSessionCount(sessionCount);
			setPresentCount(presentCount);
			setAbsentCount(absentCount);
			setOnLeaveCount(onLeaveCount);
			setAttendanceCount(presentCount + absentCount + onLeaveCount);
		} catch (error) {
			toast.error("Something went wrong", {
				id: "fetchDashboardError",
			});
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const getCurrentDate = () => {
		const currentDate = new Date();
		const formattedDate = formatDateMonth(currentDate);
		setTodayDate(formattedDate);
	};
	const { data: session } = useSession();

	if (!session || !session.user) {
		return <Loader />;
	}

	const pathName = usePathname();

	const userRole = (session.user as { role?: string | null | undefined })?.role || "USER";

	const allowedRoles = menu
		.filter((item) => item.link === pathName)
		.flatMap((item) => item.roles)
		.map((role) => role);

	const hasPermission = allowedRoles.some((role) => userRole.includes(role));

	if (!hasPermission) {
		return <NoPermissionError />;
	}

	const cards = [
		{
			title: "Today's date",
			content: todayDate,
			icon: <TodayIcon />,
		},
		{
			title: "Present today",
			content: presentCount,
			link: "/attendance",
			icon: <CheckCircleIcon />,
		},
		{
			title: "Absent today",
			content: absentCount,
			link: "/attendance",
			icon: <CancelIcon />,
		},
		{
			title: "On leave today",
			content: onLeaveCount,
			link: "/attendance",
			icon: <RemoveCircleIcon />,
		},
		{
			title: "Attendance today",
			content: attendanceCount,
			link: "/attendance",
			icon: <SupervisedUserCircleIcon />,
		},
		{
			title: "Total students",
			content: studentCount,
			link: "/student",
			icon: <SchoolIcon />,
		},
		{
			title: "Total classes",
			content: classCount,
			link: "/class",
			icon: <GroupsIcon />,
		},
		{
			title: "Total sessions",
			content: sessionCount,
			link: "/session",
			icon: <EventNoteIcon />,
		},
	];

	return (
		<Background title="Dashboard">
			<Notice role={userRole} />
			<DashboardGrid cards={cards} />
		</Background>
	);
}
