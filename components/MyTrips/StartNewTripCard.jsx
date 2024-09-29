import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import * as Animatable from "react-native-animatable";

const StartNewTripCard = () => {
  return (
    <Animatable.View style={styles.container} animation="zoomIn">
      <MaterialIcons
        name="not-listed-location"
        size={70}
        color={Colors.PRIMARY}
      />
      <Text style={styles.text}>No Trips Yet? Time to Explore!</Text>
      <Text style={styles.text2}>
        Start planning your next getaway now. Whether it's a relaxing escape or
        a thrilling journey, new experiences await!
      </Text>
      <Animatable.View
        animation="rubberBand"
        iterationCount="infinite"
        easing="ease"
      >
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text1}>Begin Your Journey</Text>
        </TouchableOpacity>
      </Animatable.View>
    </Animatable.View>
  );
};

export default StartNewTripCard;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    marginTop: 55,
    display: "flex",
    alignItems: "center",
    gap: 25,
  },
  text: {
    fontFamily: "QuickSand-SemiBold",
    fontSize: 20,
  },
  text1: {
    fontFamily: "QuickSand-Bold",
    fontSize: 17,
    color: "white",
    margin: 5,
  },
  text2: {
    fontFamily: "QuickSand",
    fontSize: 16,
    textAlign: "justify",
    color: "gray",
  },
  button: {
    padding: 10,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
  },
});
