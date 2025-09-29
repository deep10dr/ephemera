"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type ThemeProvider = {
  theme: boolean;
  setTheme: Dispatch<SetStateAction<boolean>>;
  themeValue: string;
};

const ThemeContextProvider = createContext<ThemeProvider | undefined>(
  undefined
);

// 4. Create Context Provider component
export const ThemeProviderComponent = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [theme, setTheme] = useState<boolean>(false);
  const themeValue = theme
    ? "bg-[#cbd5e1] text-[#0F172A]"
    : "bg-[#0F172A] text-white";

  return (
    <ThemeContextProvider.Provider value={{ theme, setTheme, themeValue }}>
      {children}
    </ThemeContextProvider.Provider>
  );
};

export const useTheme = (): ThemeProvider => {
  const context = useContext(ThemeContextProvider);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProviderComponent");
  }
  return context;
};
