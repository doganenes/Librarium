import React from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const darkModeContext = React.createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>([false, () => {}]);

export const useDarkMode = () => {
  return React.useContext(darkModeContext);
};

const theme = {
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
};

const lightTheme = createTheme(theme);

const darkTheme = createTheme({
  ...theme,
  palette: { ...theme.palette, mode: "dark" },
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
  const darkModeState = React.useState(false);

  return (
    <darkModeContext.Provider value={darkModeState}>
      <MuiThemeProvider theme={darkModeState[0] ? darkTheme : lightTheme}>
        <CssBaseline />
        {props.children}
      </MuiThemeProvider>
    </darkModeContext.Provider>
  );
};

export default ThemeProvider;
