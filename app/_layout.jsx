import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { CreateTripContext } from "@/context/CreateTripContext";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load all your fonts
  const [fontsLoaded] = useFonts({
    QuickSand: require("../assets/fonts/Quicksand-Regular.ttf"),
    "QuickSand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "QuickSand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
    "QuickSand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "QuickSand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
  });

  const [appIsReady, setAppIsReady] = useState(false);
  const [tripData, setTripData] = useState([]);

  // Prepare the app
  useEffect(() => {
    async function prepare() {
      try {
        // Add any additional initialization logic here
        // For example: API calls, data loading, etc.
        // Artificial delay for development purposes - remove in production
        // await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.warn(error);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Handle layout
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  // Don't render anything until we're ready
  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  // Render the app
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <CreateTripContext.Provider value={{ tripData, setTripData }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
      </CreateTripContext.Provider>
    </View>
  );
}
