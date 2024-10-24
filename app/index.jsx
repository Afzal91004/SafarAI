import React from "react";
import { View } from "react-native";
import Login from "../components/Login";
import { auth } from "@/config/FirebaseConfig";
import { Redirect } from "expo-router";

export default function Index() {
  const user = auth.currentUser;
  return <View>{user ? <Redirect href={"/MyTrip"} /> : <Login />}</View>;
}
