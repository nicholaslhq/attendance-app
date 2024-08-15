const themes = [
	{
		//Dark mode
		name: "default",

		//Attributes
		fontSizeBody: "15px",
		fontSizeBody2: "14px",
		fontSizeTitle: "18px",
		fontSizeTitle2: "16px",
		activeNavLink: "rgba(249,249,249, 0.08)",
		activeNavLinkHover: "rgba(249,249,249, 0.03)",
		sidebarWidth: "15rem",

		//Background
		colorBg: "#252525",
		colorBg2: "#212121",
		colorBg3: "#181818",
		colorBg4: "#1A1A1A",

		//Button
		colorButtonPrimary: "#27AE60",
		colorButtonSecondary: "#808080",
		colorButtonWarning: "#F44336",
		colorButtonFont: "#FFFFFF",
		colorButtonFont2: "#212121",

		//Text
		colorTextPrimary: "#e5e7eb",
		colorTextSecondary: "#B0B3B8",
		colorTextPrimary: "#FFFFFF",
		colorTextLight: "#f8f8f8",

		//Icons
		colorIcons: "rgba(249,249,249, 0.35)",
		colorIcons2: "rgba(249,249,249, 0.75)",
		colorIcons3: "rgba(249,249,249, 0.08)",
		colorIcons4: "rgba(0,0,0, 0.3)",

		//Other
		borderColor: "rgba(249,249,249, 0.08)",
		matchHighlightColor: "#595215",
		boxShadow: "0 3px 15px rgba(0, 0, 0, 0.3)",

		//Black & White
		colorBlack: "#000000",
		colorWhite: "#FFFFFF",

		//Grey
		colorGrey0: "#F5F5F5",
		colorGrey1: "#EEEEEE",
		colorGrey2: "#E0E0E0",
		colorGrey3: "#BDBDBD",
		colorGrey4: "#9E9E9E",
		colorGrey5: "#757575",
		colorGrey6: "#616161",
		colorGrey7: "#424242",
		colorGrey8: "#212121",
		colorGrey9: "#171717",

		//Red
		colorRed0: "#FFEBEE",
		colorRed1: "#FFCDD2",
		colorRed2: "#EF9A9A",
		colorRed3: "#E57373",
		colorRed4: "#EF5350",
		colorRed5: "#F44336",
		colorRed6: "#E53935",
		colorRed7: "#D32F2F",
		colorRed8: "#C62828",
		colorRed9: "#B71C1C",

		//Green
		colorGreenPrimary: "#27AE60",
		colorGreenSecondary: "#6FCF97",
		colorGreen0: "#E8F5E9",
		colorGreen1: "#C8E6C9",
		colorGreen2: "#A5D6A7",
		colorGreen3: "#81C784",
		colorGreen4: "#66BB6A",
		colorGreen5: "#4CAF50",
		colorGreen6: "#43A047",
		colorGreen7: "#388E3C",
		colorGreen8: "#2E7D32",
		colorGreen9: "#1B5E20",

		//Blue
		colorBlue0: "#E3F2FD",
		colorBlue1: "#BBDEFB",
		colorBlue2: "#90CAF9",
		colorBlue3: "#64B5F6",
		colorBlue4: "#42A5F5",
		colorBlue5: "#2196F3",
		colorBlue6: "#1E88E5",
		colorBlue7: "#1976D2",
		colorBlue8: "#1565C0",
		colorBlue9: "#0D47A1",

		//Yellow
		colorYellow0: "#FFFDE7",
		colorYellow1: "#FFF9C4",
		colorYellow2: "#FFF59D",
		colorYellow3: "#FFF176",
		colorYellow4: "#FFEE58",
		colorYellow5: "#FFEB3B",
		colorYellow6: "#FDD835",
		colorYellow7: "#FBC02D",
		colorYellow8: "#F9A825",
		colorYellow9: "#F57F17",

		//Orange
		colorOrange0: "#FFF3E0",
		colorOrange1: "#FFE0B2",
		colorOrange2: "#FFCC80",
		colorOrange3: "#FFB74D",
		colorOrange4: "#FFA726",
		colorOrange5: "#FF9800",
		colorOrange6: "#FB8C00",
		colorOrange7: "#F57C00",
		colorOrange8: "#EF6C00",
		colorOrange9: "#E65100",

		//Purple
		colorPurple0: "#F3E5F5",
		colorPurple1: "#E1BEE7",
		colorPurple2: "#CE93D8",
		colorPurple3: "#BA68C8",
		colorPurple4: "#AB47BC",
		colorPurple5: "#9C27B0",
		colorPurple6: "#8E24AA",
		colorPurple7: "#7B1FA2",
		colorPurple8: "#6A1B9A",
		colorPurple9: "#4A148C",

		//Teal
		colorTeal0: "#E0F2F1",
		colorTeal1: "#B2DFDB",
		colorTeal2: "#80CBC4",
		colorTeal3: "#4DB6AC",
		colorTeal4: "#26A69A",
		colorTeal5: "#009688",
		colorTeal6: "#00897B",
		colorTeal7: "#00796B",
		colorTeal8: "#00695C",
		colorTeal9: "#004D40",
	},
	{
		//Light mode
		name: "light",

		//Attributes
		fontSizeBody: "15px",
		fontSizeBody2: "14px",
		fontSizeTitle: "18px",
		fontSizeTitle2: "16px",
		activeNavLink: "rgba(0,0,0, 0.08)",
		activeNavLinkHover: "rgba(0,0,0, 0.03)",
		sidebarWidth: "15rem",

		//Background
		colorBg: "#F5F5F5",
		colorBg2: "#EEEEEE",
		colorBg3: "#E0E0E0",
		colorBg4: "#F5F5F5",

		//Button
		colorButtonPrimary: "#27AE60",
		colorButtonSecondary: "#808080",
		colorButtonWarning: "#F44336",
		colorButtonFont: "#FFFFFF",
		colorButtonFont2: "#212121",

		//Text
		colorTextPrimary: "#000000",
		colorTextSecondary: "#B0B3B8",
		colorTextPrimary: "#000000",
		colorTextLight: "#000000",

		//Icons
		colorIcons: "rgba(0,0,0, 0.35)",
		colorIcons2: "rgba(0,0,0, 0.75)",
		colorIcons3: "rgba(0,0,0, 0.08)",
		colorIcons4: "rgba(0,0,0, 0.3)",

		//Other
		borderColor: "rgba(0,0,0, 0.08)",
		matchHighlightColor: "#FCE938",
		boxShadow: "0 3px 15px rgba(200, 200, 200, 0.3)",

		//Black & White
		colorBlack: "#000000",
		colorWhite: "#FFFFFF",

		//Grey
		colorGrey0: "#171717",
		colorGrey1: "#212121",
		colorGrey2: "#424242",
		colorGrey3: "#616161",
		colorGrey4: "#757575",
		colorGrey5: "#9E9E9E",
		colorGrey6: "#BDBDBD",
		colorGrey7: "#E0E0E0",
		colorGrey8: "#EEEEEE",
		colorGrey9: "#F5F5F5",

		//Red
		colorRed0: "#B71C1C",
		colorRed1: "#C62828",
		colorRed2: "#D32F2F",
		colorRed3: "#E57373",
		colorRed4: "#EF5350",
		colorRed5: "#F44336",
		colorRed6: "#E53935",
		colorRed7: "#D32F2F",
		colorRed8: "#C62828",
		colorRed9: "#FFEBEE",

		//Green
		colorGreenPrimary: "#27AE60",
		colorGreenSecondary: "#6FCF97",
		colorGreen0: "#1B5E20",
		colorGreen1: "#2E7D32",
		colorGreen2: "#388E3C",
		colorGreen3: "#43A047",
		colorGreen4: "#4CAF50",
		colorGreen5: "#66BB6A",
		colorGreen6: "#81C784",
		colorGreen7: "#A5D6A7",
		colorGreen8: "#C8E6C9",
		colorGreen9: "#E8F5E9",

		//Blue
		colorBlue0: "#0D47A1",
		colorBlue1: "#1565C0",
		colorBlue2: "#1976D2",
		colorBlue3: "#1E88E5",
		colorBlue4: "#2196F3",
		colorBlue5: "#42A5F5",
		colorBlue6: "#64B5F6",
		colorBlue7: "#90CAF9",
		colorBlue8: "#BBDEFB",
		colorBlue9: "#E3F2FD",

		//Yellow
		colorYellow0: "#F57F17",
		colorYellow1: "#F9A825",
		colorYellow2: "#FBC02D",
		colorYellow3: "#FDD835",
		colorYellow4: "#FFEB3B",
		colorYellow5: "#FFEE58",
		colorYellow6: "#FFF176",
		colorYellow7: "#FFF59D",
		colorYellow8: "#FFF9C4",
		colorYellow9: "#FFFDE7",

		//Orange
		colorOrange0: "#E65100",
		colorOrange1: "#EF6C00",
		colorOrange2: "#F57C00",
		colorOrange3: "#FB8C00",
		colorOrange4: "#FF9800",
		colorOrange5: "#FFA726",
		colorOrange6: "#FFEB3B",
		colorOrange7: "#FFEE58",
		colorOrange8: "#FFF9C4",
		colorOrange9: "#FFEBEE",

		//Purple
		colorPurple0: "#4A148C",
		colorPurple1: "#6A1B9A",
		colorPurple2: "#7B1FA2",
		colorPurple3: "#8E24AA",
		colorPurple4: "#9C27B0",
		colorPurple5: "#AB47BC",
		colorPurple6: "#BA68C8",
		colorPurple7: "#CE93D8",
		colorPurple8: "#E1BEE7",
		colorPurple9: "#F3E5F5",

		//Teal
		colorTeal0: "#004D40",
		colorTeal1: "#00695C",
		colorTeal2: "#00796B",
		colorTeal3: "#00897B",
		colorTeal4: "#009688",
		colorTeal5: "#26A69A",
		colorTeal6: "#4DB6AC",
		colorTeal7: "#80CBC4",
		colorTeal8: "#B2DFDB",
		colorTeal9: "#E0F2F1",
	},
];
export default themes;
