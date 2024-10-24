import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useContext } from "react";
import GoBack from "../../components/GoBack";
import { Colors } from "@/constants/Colors";
import { CreateTripContext } from "../../context/CreateTripContext";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const ReviewTrip = () => {
  const { tripData, setTripData } = useContext(CreateTripContext);

  const startDate = new Date(tripData.startDate);
  const endDate = new Date(tripData.endDate);

  const formattedStartDate = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedEndDate = endDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <View style={{ flex: 1 }}>
      <View>
        <View style={styles.subContainer}>
          <View style={styles.header}>
            <GoBack color={"white"} />
            <Text style={styles.headerText}>Review Your Trip</Text>
          </View>
          <View style={styles.hr} />
        </View>
        <Text style={styles.headText}>Trip Summary</Text>
        <View style={styles.subContainer2}>
          <Text style={styles.subText}>
            Here's a summary of your trip details:
          </Text>
        </View>
      </View>
      <View
        style={{ flex: 1, width: "100%", alignItems: "center", paddingTop: 20 }}
      >
        <View style={styles.container3}>
          <Text style={styles.icon}>📍</Text>
          <View>
            <Text style={styles.title}>Destination</Text>
            <Text style={styles.description}>{tripData.locationInfo.name}</Text>
          </View>
        </View>
        <View style={styles.container3}>
          <Text style={styles.icon}>🧳</Text>
          <View>
            <Text style={styles.title}>Travelers</Text>
            <Text style={styles.description}>{tripData.traveler.title}</Text>
          </View>
        </View>
        <View style={styles.container3}>
          <Text style={styles.icon}>🗓️</Text>
          <View>
            <Text style={styles.title}>Date</Text>
            <Text style={styles.description}>
              {formattedStartDate} - {formattedEndDate}
            </Text>
          </View>
        </View>
        <View style={styles.container3}>
          <Text style={styles.icon}>📆</Text>
          <View>
            <Text style={styles.title}>Number of Days</Text>
            <Text style={styles.description}>{tripData.totalNoOfDays}</Text>
          </View>
        </View>
        <View style={styles.container3}>
          <Text style={styles.icon}>💵</Text>
          <View>
            <Text style={styles.title}>Budget</Text>
            <Text style={styles.description}>{tripData.budget}</Text>
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={styles.continueButton}
            //   onPress={() => onClickContinue()}
          >
            <Text style={styles.buttonText}>
              <FontAwesome6
                name="person-walking-luggage"
                size={24}
                color="white"
              />{" "}
              Generate My Trip
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ReviewTrip;

const styles = StyleSheet.create({
  subContainer: {
    elevation: 5,
    backgroundColor: Colors.PRIMARY,
    marginTop: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerText: {
    paddingTop: 28,
    fontSize: 20,
    fontFamily: "QuickSand-Medium",
    marginLeft: "7%",
    color: "white",
  },
  headText: {
    color: Colors.PRIMARY,
    fontFamily: "QuickSand-Bold",
    fontSize: 30,
    paddingTop: 11,
    marginLeft: 18,
  },
  subContainer2: {
    marginHorizontal: 18,
  },
  subText: {
    fontFamily: "QuickSand",
    fontSize: 18,
    paddingTop: 4,
  },
  continueButton: {
    backgroundColor: Colors.PRIMARY,
    height: 45,
    width: 250,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "white",
    fontFamily: "QuickSand-Bold",
    fontSize: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  container3: {
    height: 80,
    width: 330,
    alignItems: "center",
    marginVertical: 5,
    borderRadius: 20,
    flexDirection: "row",
    backgroundColor: "#DCDCDC",
    paddingLeft: 10,
    alignContent: "center",
    overflow: "hidden",
  },
  icon: {
    padding: 5,
    borderRadius: 300,
    backgroundColor: "white",
    marginRight: 10,
    fontSize: 25,
  },
  title: {
    fontFamily: "QuickSand-SemiBold",
    fontSize: 14,
    color: "black",
  },
  description: {
    fontFamily: "QuickSand-Bold",
    fontSize: 18,
    color: "black",
  },
});
