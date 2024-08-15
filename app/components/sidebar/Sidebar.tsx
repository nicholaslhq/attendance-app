"use client";
import React from "react";
import styled from "styled-components";
import { useGlobalState } from "@/app/context/GlobalContextProvider";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import menu from "@/app/utils/menu";
import Button from "@/app/components/button/Button";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut, useSession } from "next-auth/react";

function Sidebar() {
	const { theme, selectedTheme, changeTheme, collapsed, collapseNav } =
		useGlobalState();

	const router = useRouter();
	const pathName = usePathname();

	const { data: session, status } = useSession();

	if (!session || !session.user) {
		return (
			// <SidebarStyled theme={theme} collapsed={collapsed}>
			//   <Loader />
			// </SidebarStyled>
			null
		);
	}

	// useEffect(() => {
	//   const checkSession = async () => {
	//       if (status === 'authenticated' && !session) {
	//         await getSession(); // Assuming you're using next-auth/react
	//         if (!session) {
	//             toast.error("Your session has expired. Please log in again.", {
	//                 id: 'fetchAttendanceError',
	//             });
	//             router.push('/login');
	//         }
	//       }
	//   };

	//   checkSession();
	// }, [session, status, router]);

	const handleClick = (link: string) => {
		router.push(link);
	};

	const userName = session?.user?.name || "{Name Unknown}";
	const userRole = (session.user as { role?: string | null | undefined })?.role || "USER";

	return (
		<SidebarStyled theme={theme} collapsed={collapsed}>
			<button className="toggle-nav" onClick={collapseNav}>
				{collapsed ? <MenuIcon /> : <ArrowBackIcon />}
			</button>
			<div className="profile">
				<div className="profile-icon">
					<AccountCircleIcon />
				</div>
				<h1>{userName}</h1>
			</div>
			<div className="nav-list">
				<ul className="nav-items">
					{menu.map((item) => {
						const link = item.link;
						const allowedRoles = item.roles || [];
						const hasPermission = allowedRoles.includes(userRole);

						if (!hasPermission) {
							return null;
						}

						return (
							<li
								key={item.id}
								className={`nav-item ${
									pathName === link ? "active" : ""
								}`}
								onClick={() => {
									collapseNav();
									handleClick(link);
								}}
							>
								{item.icon}
								<Link href={link}>{item.title}</Link>
							</li>
						);
					})}
				</ul>
			</div>
			<div className="nav-bottom">
				<div className="nav-bottom-items">
					<Button
						name={""}
						type={"submit"}
						padding={"1rem 1.2rem"}
						borderRad={"1rem"}
						fw={"500"}
						fs={"1rem"}
						icon={
							selectedTheme == 0 ? (
								<LightModeIcon />
							) : (
								<DarkModeIcon />
							)
						}
						click={() => {
							changeTheme();
						}}
					/>
				</div>
				<div className="nav-bottom-items">
					<Button
						name={"Sign Out"}
						type={"submit"}
						padding={"1rem 1.2rem"}
						borderRad={"1rem"}
						fw={"500"}
						fs={"1rem"}
						icon={<LogoutIcon />}
						click={() => {
							signOut();
						}}
					/>
				</div>
			</div>
		</SidebarStyled>
	);
}

const SidebarStyled = styled.nav<{ collapsed: boolean }>`
	position: relative;
	width: ${(props) => props.theme.sidebarWidth};
	min-width: ${(props) => props.theme.sidebarWidth};
	background-color: ${(props) => props.theme.colorBg2};
	border-right: 2px solid ${(props) => props.theme.borderColor};
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	color: ${(props) => props.theme.colorGrey3};
	transition: all 0.3s ease-in-out;

	/* Mobile screen in portrait mode */
	@media screen and (max-width: 768px) and (max-height: 1024px) {
		position: fixed;
		height: 100%;
		z-index: 100;
		transition: all 0.3s cubic-bezier(0.53, 0.21, 0, 1);
		transform: ${(props) =>
			props.collapsed ? "translateX(-100%)" : "translateX(0)"};

		.toggle-nav {
			display: block !important;
		}
	}

	/* Mobile screen in landscape mode */
	@media screen and (max-width: 1024px) and (max-height: 768px) {
		position: fixed;
		height: 100vh;
		z-index: 100;
		transition: all 0.3s cubic-bezier(0.53, 0.21, 0, 1);
		transform: ${(props) =>
			props.collapsed ? "translateX(-100%)" : "translateX(0)"};

		.toggle-nav {
			display: block !important;
		}
	}

	.toggle-nav {
		display: none;
		padding: 0.8rem 0.9rem;
		position: absolute;
		right: -78px;
		top: 1.8rem;
		border-top-right-radius: 1rem;
		border-bottom-right-radius: 1rem;
		background-color: ${(props) => props.theme.colorBg2};
		border-right: 2px solid ${(props) => props.theme.borderColor};
		border-top: 2px solid ${(props) => props.theme.borderColor};
		border-bottom: 2px solid ${(props) => props.theme.borderColor};
	}

	.profile {
		margin: 1.5rem;
		position: relative;
		border-radius: 1rem;
		font-weight: 500;
		color: ${(props) => props.theme.colorGrey0};
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;

		h1 {
			display: flex;
			flex-direction: column;
			line-height: 1.4rem;
		}

		.profile-icon,
		h1 {
			position: relative;
			z-index: 1;
		}

		.profile-icon {
			flex-shrink: 0;
			display: inline-block;
			overflow: hidden;
			border-radius: 100%;
			font-size: 1.5em;
		}

		> h1 {
			font-size: 1rem;
			line-height: 1.4rem;
			word-break: break-word;
		}
	}

	.nav-list {
		max-height: 600px;
		overflow-y: auto;

		&::-webkit-scrollbar {
			width: 0.5rem;
		}

		&::-webkit-scrollbar-track {
			background: ${(props) => props.theme.colorBg2};
		}

		&::-webkit-scrollbar-thumb {
			background: ${(props) => props.theme.colorBg};
			border-radius: 1rem;
		}

		/* Mobile screen in portrait mode */
		@media screen and (max-width: 768px) and (max-height: 1024px) {
			max-height: 500px;
		}

		/* Mobile screen in landscape mode */
		@media screen and (max-width: 1024px) and (max-height: 768px) {
			max-height: 120px;
		}
	}

	.nav-item {
		position: relative;
		padding: 1rem 1.5rem;
		margin: 1rem 0;
		display: grid;
		grid-template-columns: 40px 1fr;
		cursor: pointer;
		align-items: center;
		gap: 1rem;

		&::after {
			position: absolute;
			content: "";
			left: 0;
			top: 0;
			width: 0;
			height: 100%;
			background-color: ${(props) => props.theme.activeNavLinkHover};
			z-index: 1;
			transition: all 0.3s ease-in-out;
		}

		&::before {
			position: absolute;
			content: "";
			right: 0;
			top: 0;
			width: 0%;
			height: 100%;
			background-color: ${(props) => props.theme.colorGreenPrimary};
			border-bottom-left-radius: 5px;
			border-top-left-radius: 5px;
		}

		a {
			font-weight: 500;
			z-index: 2;
			line-height: 0;
		}

		svg {
			display: flex;
			align-items: center;
			justify-self: center;
		}

		&:hover {
			&::after {
				width: 100%;
			}
		}
	}

	.active {
		background-color: ${(props) => props.theme.activeNavLink};

		svg,
		a {
			color: ${(props) => props.theme.colorIcons2};
		}
	}

	.active::before {
		width: 0.3rem;
	}

	> button {
		margin: 1.5rem;
	}

	.nav-bottom {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 1rem;

		svg {
			display: flex;
			align-items: center;
			justify-self: center;
			color: ${(props) => props.theme.colorIcons2};
		}
	}

	.nav-bottom-items {
		margin: 0.5rem 0rem;
		color: ${(props) => props.theme.colorGrey2};
	}
`;

export default Sidebar;
