// https://kentcdodds.com/blog/how-to-use-react-context-effectively
import { createContext, useContext, useMemo, useReducer } from "react";

type Action =
  | { type: "loading" }
  | { type: "modeSwitch"; mode: boolean }
  | { type: "info"; description?: string }
  | { type: "disabled" };
type Dispatch = (action: Action) => void;
type State = {
  show: boolean;
  fadeOut?: boolean;
  loading: boolean;
  description: string;
  darkMode: boolean | undefined;
};
type SnackBarProviderProps = { children: React.ReactNode };

const initialState = {
  show: false,
  loading: false,
  description: "",
  fadeOut: false,
  darkMode: undefined,
} as State;

const SnackBarContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const snackBarReducer = (_state: State, action: Action): State => {
  switch (action.type) {
    case "loading": {
      return {
        show: true,
        description: "",
        loading: true,
        darkMode: undefined,
      };
    }
    case "info": {
      return {
        show: true,
        description: action.description!,
        loading: false,
        fadeOut: true,
        darkMode: undefined,
      };
    }
    case "modeSwitch": {
      return {
        show: true,
        description: "",
        loading: false,
        fadeOut: true,
        darkMode: action.mode,
      };
    }
    case "disabled": {
      return initialState;
    }
    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
};

const SnackBarProvider = ({ children }: SnackBarProviderProps) => {
  const [state, dispatch] = useReducer(snackBarReducer, initialState);

  const value = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <SnackBarContext.Provider value={value}>
      {children}
    </SnackBarContext.Provider>
  );
};

const useSnackBar = () => {
  const context = useContext(SnackBarContext);
  if (context === undefined) {
    throw new Error("useSnackBar must be used within a SnackBarContext");
  }
  return context;
};

export { useSnackBar, SnackBarProvider };
