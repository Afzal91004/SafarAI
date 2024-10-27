import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const UserTripList = ({ userTrips }) => {
  const router = useRouter();

  return (
    <FlatList
      data={userTrips}
      keyExtractor={(item, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      inverted // Add this line to reverse the display order
      renderItem={({ item }) => {
        let parsedTripData;
        try {
          parsedTripData = item.tripData ? JSON.parse(item.tripData) : {};
        } catch (error) {
          console.error("Failed to parse trip data:", error);
          parsedTripData = {};
        }

        return (
          <View style={styles.tripCard}>
            <Text style={styles.tripTitle}>
              📍{parsedTripData?.locationInfo?.name || "No Location"}
            </Text>
            <Text style={styles.tripDetails}>
              🧳 {parsedTripData?.traveler?.title || "Unknown Traveler"} -{" "}
              {parsedTripData?.traveler?.people || "Unknown People"} people
            </Text>
            <Text style={styles.tripDates}>
              📆 {formatDate(parsedTripData?.startDate)} to{" "}
              {formatDate(parsedTripData?.endDate)}
            </Text>
            <Text style={styles.tripBudget}>
              💸 Budget: {parsedTripData?.budget || "Unknown Budget"}
            </Text>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() =>
                  router.push({
                    pathname: "/trip-details",
                    params: { trip: JSON.stringify(item) },
                  })
                }
              >
                <Text style={styles.buttonText}>View Itinerary 🗺️</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    />
  );
};

export default UserTripList;

const styles = StyleSheet.create({
  tripCard: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  tripTitle: {
    fontSize: 30,
    marginBottom: 8,
    fontFamily: "QuickSand-SemiBold",
  },
  tripDetails: {
    fontSize: 16,
    marginBottom: 8,
  },
  tripDates: {
    fontSize: 14,
    color: "#555",
    fontFamily: "QuickSand",
    marginBottom: 8,
  },
  tripBudget: {
    fontSize: 14,
    color: "#333",
    fontFamily: "QuickSand-SemiBold",
  },
  continueButton: {
    backgroundColor: Colors.PRIMARY,
    height: 45,
    width: 200,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  buttonText: {
    color: "white",
    fontFamily: "QuickSand-Bold",
    fontSize: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
