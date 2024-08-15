"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import themes from "./themes";
import toast from "react-hot-toast";
import axios from "axios";
import { useSession } from "next-auth/react";

export const GlobalContext = createContext();
export const GlobalUpdateContext = createContext();

export const GlobalProvider = ({ children }) => {
	const { data: session } = useSession();

	const mode =
		session?.user?.mode === "0" || session?.user?.mode === "1"
			? session?.user?.mode
			: "0";
	const userId = session?.user?.id;

	const [selectedTheme, setSelectedTheme] = useState(mode);
	const [isLoading, setIsLoading] = useState(false);
	const [collapsed, setCollapsed] = useState(true);
	const [modals, setModals] = useState({
		id: [],
		createUser: false,
		editUser: false,
		deleteUser: false,
		createClass: false,
		editClass: false,
		deleteClass: false,
		createSession: false,
		editSession: false,
		deleteSession: false,
		createStudent: false,
		editStudent: false,
		deleteStudent: false,
		editAttendance: false,
	});
	const [users, setUsers] = useState([]);
	const [classes, setClasses] = useState([]);
	const [sessions, setSessions] = useState([]);
	const [students, setStudents] = useState([]);

	useEffect(() => {
		setSelectedTheme(mode);
	}, [mode]);

	React.useEffect(() => {
		setIsLoading(true);
		allUsers();
		allClasses();
		allStudents();
		allSessions();
		setIsLoading(false);
	}, []);

	const theme = themes[selectedTheme];

	const collapseNav = () => {
		setCollapsed(!collapsed);
	};

	const changeTheme = async () => {
		const selectedMode = selectedTheme == "0" ? "1" : "0";
		await setSelectedTheme(selectedMode);

		if (userId) {
			try {
				const res = await axios.put(
					`/api/user/${userId}`,
					selectedMode
				);
				await setUsers(res.data);
			} catch (error) {
				toast.error("Something went wrong");
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		}
	};

	const openModal = (modalName, id = []) => {
		setModals((prevModals) => ({
			...prevModals,
			[modalName]: true,
			id: id, // Add id to modals if provided
		}));
	};

	const closeModal = (modalName) => {
		if (modalName) {
			setModals((prevModals) => ({
				...prevModals,
				[modalName]: false,
			}));
		} else {
			setModals((prevModals) => {
				const closedModals = {};
				for (const key in prevModals) {
					closedModals[key] = false;
				}
				return closedModals;
			});
		}
	};

	//Get all user
	const allUsers = async () => {
		setIsLoading(true);

		try {
			const res = await axios.get("/api/user");
			setUsers(res.data);
		} catch (error) {
			toast.error("Something went wrong");
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	//Get all classes
	const allClasses = async () => {
		setIsLoading(true);

		try {
			const res = await axios.get("/api/class");
			setClasses(res.data);
		} catch (error) {
			toast.error("Something went wrong");
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	//Get all session
	const allSessions = async () => {
		setIsLoading(true);

		try {
			const res = await axios.get("/api/session");
			setSessions(res.data);
		} catch (error) {
			toast.error("Something went wrong");
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	//Get all students
	const allStudents = async () => {
		setIsLoading(true);

		try {
			const res = await axios.get("/api/student");
			setStudents(res.data);
		} catch (error) {
			toast.error("Something went wrong");
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<GlobalContext.Provider
			value={{
				theme,
				selectedTheme,
				changeTheme,
				isLoading,
				setIsLoading,
				collapsed,
				collapseNav,
				modals,
				openModal,
				closeModal,
				users,
				allUsers,
				classes,
				allClasses,
				sessions,
				allSessions,
				students,
				allStudents,
			}}
		>
			<GlobalUpdateContext.Provider value={{}}>
				{children}
			</GlobalUpdateContext.Provider>
		</GlobalContext.Provider>
	);
};

export const useGlobalState = () => useContext(GlobalContext);
export const useGlobalUpdate = () => useContext(GlobalUpdateContext);
