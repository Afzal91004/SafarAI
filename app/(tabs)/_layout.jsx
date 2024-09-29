import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Colors } from "@/constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.PRIMARY,
          borderTopColor: Colors.PRIMARYSHADOW,
          elevation: 10,
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: Colors.light.tabIconSelected,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
      }}
    >
      <Tabs.Screen
        name="MyTrip"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <FontAwesome6
              name="map-location-dot"
              size={focused ? 35 : 24}
              color={
                focused
                  ? Colors.light.tabIconSelected
                  : Colors.light.tabIconDefault
              }
            />
          ),
          tabBarLabel: "My Trip",
        }}
      />
      {/*   */}
      <Tabs.Screen
        name="Discover"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <FontAwesome5
              name="search-location"
              size={focused ? 35 : 24}
              color={
                focused
                  ? Colors.light.tabIconSelected
                  : Colors.light.tabIconDefault
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <FontAwesome5
              name="user"
              size={focused ? 35 : 24}
              color={
                focused
                  ? Colors.light.tabIconSelected
                  : Colors.light.tabIconDefault
              }
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="Wishlist"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Entypo name="flag" size={focused ? 35 : 24} color={color} />
          ),
        }}
      /> */}
    </Tabs>
  );
};

export default TabLayout;

const styles = StyleSheet.create({});
