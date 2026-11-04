import { useColorScheme } from "react-native";

export const lightColors = {
  primary: "#208AEF",
  onPrimary: "#FFFFFF",
  danger: "#E5484D",
  text: "#1C1C1E",
  textMuted: "#8E8E93",
  background: "#F2F2F7",
  surface: "#FFFFFF",
  border: "#D1D1D6",
};

export type Colors = typeof lightColors;

export const darkColors: Colors = {
  primary: "#3B9BFF",
  onPrimary: "#FFFFFF",
  danger: "#E5484D",
  text: "#FFFFFF",
  textMuted: "#8E8E93",
  background: "#1C1C1E",
  surface: "#2C2C2E",
  border: "#3A3A3C",
};

export function useColors() {
  const scheme = useColorScheme();
  return scheme === "dark" ? darkColors : lightColors;
}
