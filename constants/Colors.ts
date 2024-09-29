/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#d3e2e8";
const tintColorDark = "#F4E1C4";
export const Colors = {
  PRIMARY: "#003366",
  SECONDARY: "#d3e2e8",
  ACCENT: "#F4E1C4",
  PRIMARYSHADOW: "#001a4d",
  light: {
    text: "#11181C",
    background: "#F9F9F9",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#1C1C1C",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
