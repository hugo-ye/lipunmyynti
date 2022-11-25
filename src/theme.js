//Create a custom theme using MUI
import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#074278",
      light: "skyblue",
    },
    secondary: {
      main: "#69a45f",
    },
    otherColor: {
      main: "#999",
    },
  },
});
