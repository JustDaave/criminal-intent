import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getSavedTheme, saveTheme } from "@/utils/storage";

export const themes = {
  White: { background: "#ffffff", surface: "#f2f2f2", text: "#111111", muted: "#666666", border: "#cccccc", primary: "#710ca8", header: "#eeeeee", headerText: "#111111", dark: false },
  Black: { background: "#101010", surface: "#202020", text: "#ffffff", muted: "#bbbbbb", border: "#666666", primary: "#710ca8", header: "#252525", headerText: "#ffffff", dark: true },
  Purple: { background: "#faf6ff", surface: "#eee3f7", text: "#241334", muted: "#685276", border: "#bfa6d0", primary: "#710ca8", header: "#710ca8", headerText: "#ffffff", dark: false },
  Red: { background: "#240e13", surface: "#3a1820", text: "#fff3f5", muted: "#d9afb8", border: "#905462", primary: "#b72b45", header: "#8c1930", headerText: "#ffffff", dark: true },
  Green: { background: "#f3faf4", surface: "#e3efe5", text: "#142b1b", muted: "#506a58", border: "#aac5b0", primary: "#24643b", header: "#24643b", headerText: "#ffffff", dark: false },
  Blue: { background: "#0d192e", surface: "#172943", text: "#f0f6ff", muted: "#aabdd9", border: "#516b91", primary: "#285eb4", header: "#1c4483", headerText: "#ffffff", dark: true },
};

export type ThemeName = keyof typeof themes;
type ThemeContextValue = {
  name: ThemeName;
  theme: (typeof themes)[ThemeName];
  changeTheme: (name: ThemeName) => void;
};
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState<ThemeName>("Purple");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadTheme() {
      try {
        const saved = await getSavedTheme();
        if (active && saved && Object.prototype.hasOwnProperty.call(themes, saved)) setName(saved as ThemeName);
      } catch (error) {
        console.warn("Could not load the saved theme", error);
      } finally {
        if (active) setReady(true);
      }
    }
    loadTheme();
    return () => { active = false; };
  }, []);

  function changeTheme(next: ThemeName) {
    saveTheme(next);
    setName(next);
  }

  if (!ready) return null;
  return <ThemeContext.Provider value={{ name, theme: themes[name], changeTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
