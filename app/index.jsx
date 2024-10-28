// app/index.js
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { auth } from "@/config/FirebaseConfig";
import { Redirect, router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";

export default function Index() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // If user is logged in, prevent going back to auth screens
      if (currentUser) {
        router.replace("/MyTrip");
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If no user, redirect to login
  if (!user) {
    return <Redirect href="/auth/sign-in/Index" />;
  }

  // User is authenticated, redirect to main app
  return <Redirect href="/MyTrip" />;
}
