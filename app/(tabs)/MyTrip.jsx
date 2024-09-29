import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Header from "../../components/Header";
import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import StartNewTripCard from "../../components/MyTrips/StartNewTripCard";

const MyTrip = () => {
  const [userTrips, setUserTrips] = useState([]);
  return (
    <View style={{ backgroundColor: Colors.light.background, flex: 1 }}>
      <Header />
      <View style={styles.Container}>
        <View style={styles.Heading}>
          <Text style={styles.HeadingText}>My Trips</Text>
          <TouchableOpacity>
            <View style={styles.addTrip}>
              <MaterialIcons
                name="add-location-alt"
                size={30}
                style={{ padding: 7 }}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>
        {userTrips?.length === 0 ? <StartNewTripCard /> : null}
      </View>
    </View>
  );
};

export default MyTrip;

const styles = StyleSheet.create({
  Container: {
    paddingHorizontal: 25,
    paddingTop: 5,
    justifyContent: "center",
    // alignItems: "center",
  },
  Heading: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  HeadingText: {
    fontFamily: "QuickSand-Bold",
    fontSize: 35,
    textDecorationLine: "underline",
  },
  addTrip: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 26,
  },
});
