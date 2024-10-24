import React, { useCallback, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { CreateTripContext } from "@/context/CreateTripContext";

SplashScreen.preventAutoHideAsync(); // Keep the splash screen until we are ready

export default function RootLayout() {
  // Load fonts, ensure this hook is always called consistently
  const [fontsLoaded] = useFonts({
    QuickSand: require("../assets/fonts/Quicksand-Regular.ttf"),
    "QuickSand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "QuickSand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
    "QuickSand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "QuickSand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
  });

  const [isSplashReady, setSplashReady] = useState(false); // Ensure splash is properly controlled
  const [tripData, setTripData] = useState([]); // Ensure consistent hook ordering

  // Avoid conditional hook calls: This will always be called
  useEffect(() => {
    const hideSplash = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync(); // Safely hide the splash screen when ready
        setSplashReady(true);
      }
    };
    hideSplash();
  }, [fontsLoaded]); // Trigger effect based on fontsLoaded state

  // Ensuring hooks execution isn't altered by returns
  if (!fontsLoaded || !isSplashReady) {
    return null; // Ensure null is returned until everything is ready
  }

  // No hooks or state manipulation below this line; safe to render
  return (
    <CreateTripContext.Provider value={{ tripData, setTripData }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </CreateTripContext.Provider>
  );
}
