/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#FF5733"; // Sunset Orange for light mode tint
const tintColorDark = "#F4E1C4"; // Sand Beige for dark mode tint

export const Colors = {
  PRIMARY: "#003366", // Midnight Blue
  SECONDARY: "orange", // Sunset Orange
  ACCENT: "#F4E1C4", // Sand Beige
  light: {
    text: "#11181C",
    background: "#F9F9F9", // Cloud White for light mode
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#1C1C1C", // Charcoal Black for dark mode
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
