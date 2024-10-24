import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from "@/constants/Colors";

const GoBack = ({ color }) => {
  const navigation = useNavigation();
  const iconColor = color || Colors.PRIMARY; // Use custom color if provided, otherwise default to Colors.PRIMARY

  return (
    <View style={styles.backbutton}>
      <TouchableOpacity
        style={{ display: "flex", flexDirection: "row" }}
        onPress={() => navigation.goBack()}
      >
        <View>
          <Entypo name="chevron-small-left" size={40} color={iconColor} />
        </View>
        <View style={{ paddingTop: 11, left: -8 }}>
          <Text
            style={{
              justifyContent: "center",
              fontFamily: "QuickSand",
              color: iconColor, // Apply the same color to the text
            }}
          >
            Back
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default GoBack;

const styles = StyleSheet.create({
  backbutton: {
    marginTop: 30,
    zIndex: 50,
  },
});
