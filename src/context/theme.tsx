import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSnackBar } from "./snackbar-context";

type ThemeProviderProps = { children: React.ReactNode };

const ThemeContext = createContext<
  { mode: boolean; toggleMode: () => void } | undefined
>(undefined);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { dispatch } = useSnackBar();
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    if (localStorage.theme === "dark" || localStorage.theme == undefined) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMode = useCallback(() => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
      dispatch({ type: "modeSwitch", mode: false });
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
      dispatch({ type: "modeSwitch", mode: true });
    }
  }, [darkMode, dispatch]);

  const value = useMemo(() => {
    return { mode: darkMode, toggleMode };
  }, [darkMode, toggleMode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
