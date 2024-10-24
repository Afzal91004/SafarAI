import { StyleSheet, Text, View } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const LocationError = () => {
  return (
    <View>
      <Text>Failed to get user location. Please try again.</Text>
      <MaterialIcons name="location-off" size={100} color="red" />
    </View>
  );
};

export default LocationError;

const styles = StyleSheet.create({});
