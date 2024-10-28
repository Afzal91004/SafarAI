import { StyleSheet, Image, View, Dimensions } from "react-native";
import React from "react";
import head from "../assets/images/header.png";
import { Colors } from "@/constants/Colors";

const Header = () => {
  return (
    <View style={styles.container}>
      <Image source={head} style={styles.image} resizeMode="contain" />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PRIMARY,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomColor: "#003366",
    borderBottomWidth: 1,
    paddingHorizontal: 4,
    top: 0,

    // Shadow for iOS
    shadowColor: Colors.PRIMARYSHADOW, // Shadow color (use a darker shade of the primary color)
    shadowOffset: { width: 6, height: 2 }, // Shadow direction
    shadowOpacity: 1, // Between 0 and 1
    shadowRadius: 5, // Spread of the shadow

    // Shadow for Android
    elevation: 10, // Elevation for Android shadows
  },
  image: {
    width: "90%",
    height: 40,
    marginTop: 25,
    top: 0,
  },
});
