"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { ColorScheme } from "@/app/lib/definitions";

import { useCurrentUser } from "./CurrentUserContext";

const COLOR_SCHEME_CLASSES: Record<ColorScheme, string> = {
  default: "theme-default",
  graphite: "theme-graphite",
  bronze: "theme-bronze",
};

type ColorSchemeContextValue = {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
};

const ColorSchemeContext = createContext<ColorSchemeContextValue>({
  colorScheme: "default",
  setColorScheme: () => {},
});

export const ColorSchemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const currentUser = useCurrentUser();
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("default");

  const applyScheme = useCallback((scheme: ColorScheme) => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    Object.values(COLOR_SCHEME_CLASSES).forEach((cls) =>
      html.classList.remove(cls)
    );
    html.classList.add(COLOR_SCHEME_CLASSES[scheme]);
  }, []);

  // On mount: load from localStorage if available, or current HTML class
  useEffect(() => {
    const saved = localStorage.getItem("colorScheme") as ColorScheme | null;
    if (saved && COLOR_SCHEME_CLASSES[saved]) {
      setColorSchemeState(saved);
      applyScheme(saved);
    }
  }, [applyScheme]);

  // Sync from DB user data when currentUser finishes loading
  useEffect(() => {
    if (!currentUser?.colorScheme) return;
    const scheme = currentUser.colorScheme as ColorScheme;
    setColorSchemeState(scheme);
    applyScheme(scheme);
    localStorage.setItem("colorScheme", scheme);
  }, [currentUser?.colorScheme, applyScheme]);

  const setColorScheme = useCallback(
    (scheme: ColorScheme) => {
      setColorSchemeState(scheme);
      applyScheme(scheme);
      if (typeof window !== "undefined") {
        localStorage.setItem("colorScheme", scheme);
      }
    },
    [applyScheme]
  );

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

export const useColorScheme = () => useContext(ColorSchemeContext);
