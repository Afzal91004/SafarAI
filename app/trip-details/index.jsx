import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import GoBack from "../../components/GoBack";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    return "Date not available";
  }
};

const handleOpenMap = (location) => {
  if (!location) return;
  const encodedLocation = encodeURIComponent(location);
  const url = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  Linking.openURL(url).catch((err) => console.error("Error opening map:", err));
};

const handleOpenLink = (url) => {
  if (!url || url === "N/A") return;
  Linking.openURL(url).catch((err) =>
    console.error("Error opening link:", err)
  );
};

const formatPrice = (price) => {
  if (!price) return "Price not available";
  if (typeof price === "object" && price.amount && price.currency) {
    return `${price.currency} ${price.amount}`;
  }
  return String(price);
};

const TripDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [tripDetails, setTripDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const parseTripData = (data) => {
        if (typeof data === "string") {
          return JSON.parse(data);
        }
        return data;
      };

      if (params.trip && typeof params.trip === "string") {
        const parsed = JSON.parse(params.trip);
        const tripData = parseTripData(parsed.tripData);
        setTripDetails({
          ...tripData,
          tripPlan: parsed.tripPlan || {},
        });
      }
    } catch (error) {
      console.error("Failed to parse trip details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [params.trip]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <View style={styles.header}>
            <GoBack color="white" />
            <Text style={styles.headerText}>Loading...</Text>
          </View>
        </View>
      </View>
    );
  }

  if (!tripDetails) {
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <View style={styles.header}>
            <GoBack color="white" />
            <Text style={styles.headerText}>Error loading trip details</Text>
          </View>
        </View>
      </View>
    );
  }

  const { tripPlan = {} } = tripDetails;
  const {
    itinerary = [],
    nearbyAttractions = [],
    attractions = [],
    accommodation = [],
    transportation = {},
    hotels = [],
  } = tripPlan;

  console.log(tripPlan);
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.header}>
          <GoBack color="white" />
          <Text style={styles.headerText}>
            Trip to {tripDetails?.locationInfo?.name || "Unknown Location"}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Trip Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Overview</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              🗓️ {formatDate(tripDetails.startDate)} -{" "}
              {formatDate(tripDetails.endDate)}
            </Text>
            <Text style={styles.infoText}>
              👤 {tripDetails?.traveler?.title || "Solo"} -{" "}
              {tripDetails?.traveler?.people || "1"} people
            </Text>
            <Text style={styles.infoText}>
              💰 Budget: {String(tripDetails.budget || "Not specified")}
            </Text>
            <Text style={styles.infoText}>
              📍 Duration: {String(tripDetails.totalNoOfDays || "Unknown")} days
            </Text>

            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => handleOpenMap(tripDetails?.locationInfo?.name)}
            >
              <Text style={styles.buttonText}>View on Map 🗺️ </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transportation */}
        {transportation && Object.keys(transportation).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transportation</Text>
            <View style={styles.infoCard}>
              {/* Flight Transportation Handling */}
              {(transportation.flight || transportation.flightDetails) && (
                <View style={styles.transportSection}>
                  <Text style={styles.transportTitle}>✈️ Flight</Text>
                  {transportation.flightDetails ? (
                    <>
                      <Text style={styles.infoText}>
                        Airline: {transportation.flightDetails.airline}
                      </Text>
                      <Text style={styles.infoText}>
                        Price: {transportation.flightDetails.price || "N/A"}
                      </Text>
                      <Text style={styles.infoText}>
                        Flight {transportation.flightDetails.flightNumber} from{" "}
                        {transportation.flightDetails.departureAirport} to{" "}
                        {transportation.flightDetails.arrivalAirport} on{" "}
                        {transportation.flightDetails.departureDate} at{" "}
                        {transportation.flightDetails.departureTime}
                      </Text>
                      <Text style={styles.infoText}>
                        Arrival Date: {transportation.flightDetails.arrivalDate}{" "}
                        at {transportation.flightDetails.arrivalTime}
                      </Text>
                      {transportation.flightDetails.bookingURL && (
                        <TouchableOpacity
                          style={styles.linkButton}
                          onPress={() =>
                            handleOpenLink(
                              transportation.flightDetails.bookingURL
                            )
                          }
                        >
                          <Text style={styles.buttonText}>✈︎ Book Flight</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  ) : (
                    <>
                      <Text style={styles.infoText}>
                        Price:{" "}
                        {formatPrice(
                          transportation.price?.flight ||
                            transportation.flight?.price ||
                            "N/A"
                        )}
                      </Text>
                      <Text style={styles.infoText}>
                        {transportation.details ||
                          transportation.flight?.details ||
                          "No details available"}
                      </Text>
                      {transportation.bookingURL?.flight &&
                        transportation.bookingURL.flight !== "N/A" && (
                          <TouchableOpacity
                            style={styles.linkButton}
                            onPress={() =>
                              handleOpenLink(transportation.bookingURL.flight)
                            }
                          >
                            <Text style={styles.buttonText}>Book Flight</Text>
                          </TouchableOpacity>
                        )}
                    </>
                  )}
                </View>
              )}

              {/* Alternative Transport Handling */}
              {transportation.alternative && (
                <View style={styles.transportSection}>
                  <Text style={styles.transportTitle}>
                    🚌 Alternative Transport
                  </Text>
                  <Text style={styles.infoText}>
                    Price:{" "}
                    {transportation.alternative.price
                      ? formatPrice(transportation.alternative.price)
                      : "N/A"}
                  </Text>
                  <Text style={styles.infoText}>
                    {transportation.alternative.details ||
                      "No details available"}
                  </Text>
                  {transportation.alternative.bookingURL && (
                    <TouchableOpacity
                      style={styles.linkButton}
                      onPress={() =>
                        handleOpenLink(transportation.alternative.bookingURL)
                      }
                    >
                      <Text style={styles.buttonText}>
                        Book Alternative Transport
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Original Mode Handling */}
              {transportation.mode && (
                <View style={styles.transportSection}>
                  <Text style={styles.transportTitle}>
                    {transportation.mode === "Flight" && "✈️ Flight"}
                    {transportation.mode === "Car" && "🚗 Car"}
                    {transportation.mode === "Alternative" &&
                      "🚌 Alternative Transport"}
                  </Text>
                  <Text style={styles.infoText}>
                    Price:{" "}
                    {transportation.price
                      ? formatPrice(
                          transportation.price.amount,
                          transportation.price.currency
                        )
                      : "N/A"}
                  </Text>
                  <Text style={styles.infoText}>
                    {transportation.details || "No details available"}
                  </Text>
                  {transportation.bookingUrl && (
                    <TouchableOpacity
                      style={styles.linkButton}
                      onPress={() => handleOpenLink(transportation.bookingUrl)}
                    >
                      <Text style={styles.buttonText}>
                        {transportation.mode === "Flight" && "Book Flight"}
                        {transportation.mode === "Car" && "Book Car"}
                        {transportation.mode === "Alternative" &&
                          "Book Transport"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Itinerary */}
        {itinerary && itinerary.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Itinerary</Text>
            {itinerary.map((day, index) => (
              <View key={index} style={styles.dayCard}>
                <Text style={styles.dayTitle}>Day {day.day}</Text>

                {/* Check if activities array exists and is valid */}
                {Array.isArray(day.activities) && day.activities.length > 0 ? (
                  day.activities.map((activity, actIndex) => (
                    <View key={actIndex} style={styles.activity}>
                      <Text style={styles.activityTime}>
                        {/* Handle time, if present */}
                        {activity.time
                          ? String(activity.time)
                          : "No time provided"}
                      </Text>
                      <View style={styles.activityDetails}>
                        {/* Handle activity, if present */}
                        <Text style={styles.activityText}>
                          {activity.activity
                            ? String(activity.activity)
                            : "No activity provided"}
                        </Text>
                        {/* Handle location, if present */}
                        {activity.location && (
                          <>
                            <Text style={styles.locationText}>
                              📍 {String(activity.location)}
                            </Text>
                            <TouchableOpacity
                              style={styles.locationButton}
                              onPress={() => handleOpenMap(activity.location)}
                            >
                              <Text style={styles.locationButtonText}>
                                View on Map 🗺️
                              </Text>
                            </TouchableOpacity>
                          </>
                        )}
                      </View>
                    </View>
                  ))
                ) : (
                  <Text>No activities planned for this day.</Text>
                )}
              </View>
            ))}
          </View>
        ) : (
          <Text>No itinerary provided.</Text>
        )}

        {/* Nearby Attractions */}
        {(nearbyAttractions.length > 0 || attractions.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nearby Attractions</Text>
            {nearbyAttractions.map((attraction, index) => (
              <View key={index} style={styles.attractionCard}>
                <View style={styles.attractionInfo}>
                  <Text style={styles.attractionName}>
                    {String(attraction.placeName)}
                  </Text>
                  <Text style={styles.attractionDescription}>
                    {String(attraction.description)}
                  </Text>
                  <Text style={styles.attractionDetails}>
                    ⏱️ {String(attraction.estimatedTravelTime)}
                  </Text>
                  <Text style={styles.attractionDetails}>
                    💰 {String(attraction.ticketPricing)}
                  </Text>
                  <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() => handleOpenMap(attraction.placeName)}
                  >
                    <Text style={styles.buttonText}>View on Map 🗺️ </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {attractions.map((attraction, index) => (
              <View key={index} style={styles.attractionCard}>
                <View style={styles.attractionInfo}>
                  <Text style={styles.attractionName}>
                    {String(attraction.placeName || attraction.name)}
                  </Text>
                  <Text style={styles.attractionDescription}>
                    {String(attraction.description)}
                  </Text>
                  <Text style={styles.attractionDetails}>
                    ⏱️ {String(attraction.estimatedTravelTime)}
                  </Text>
                  <Text style={styles.attractionDetails}>
                    💰 {String(attraction.ticketPricing)}
                  </Text>
                  <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() => handleOpenMap(attraction.geoCoordinates)}
                  >
                    <Text style={styles.buttonText}>View on Map 🗺️ </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Accommodation */}
        {accommodation.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggested Accommodations</Text>
            {accommodation.map((place, index) => (
              <View key={index} style={styles.accommodationCard}>
                <Text style={styles.hotelName}>
                  {String(place.name || place.hotelName)}
                </Text>
                <Text style={styles.hotelDetails}>
                  ⭐ {String(place.rating)}
                </Text>
                <Text style={styles.hotelDetails}>
                  💰 {formatPrice(place.price)}
                </Text>
                <Text style={styles.hotelDetails}>
                  📍 {String(place.address)}
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.hotelButton, styles.mapButton]}
                    onPress={() => handleOpenMap(place.address)}
                  >
                    <Text style={styles.buttonText}>View on Map 🗺️ </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        {hotels.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggested Accommodations</Text>
            {hotels.map((place, index) => (
              <View key={index} style={styles.accommodationCard}>
                <Text style={styles.hotelName}>
                  {String(place.name || place.hotelName)}
                </Text>
                <Text style={styles.hotelDetails}>
                  ⭐ {String(place.rating)}
                </Text>
                <Text style={styles.hotelDetails}>
                  💰 {formatPrice(place.price)}
                </Text>
                <Text style={styles.hotelDetails}>
                  📍 {String(place.address)}
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.hotelButton, styles.mapButton]}
                    onPress={() => handleOpenMap(place.address)}
                  >
                    <Text style={styles.buttonText}>View on Map 🗺️ </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default TripDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  subContainer: {
    backgroundColor: Colors.PRIMARY,
    paddingBottom: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  headerText: {
    paddingTop: 28,
    fontSize: 20,
    fontFamily: "QuickSand-Medium",
    marginLeft: "10%",
    color: "white",
  },
  hr: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 15,
    marginTop: 10,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "QuickSand-Bold",
    marginBottom: 10,
    color: Colors.PRIMARY,
  },
  infoCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoText: {
    fontSize: 16,
    fontFamily: "QuickSand-Medium",
    marginBottom: 8,
  },
  transportSection: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  transportTitle: {
    fontSize: 18,
    fontFamily: "QuickSand-Bold",
    marginTop: 10,
    marginBottom: 5,
    color: Colors.PRIMARY,
  },
  dayCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dayTitle: {
    fontSize: 18,
    fontFamily: "QuickSand-Bold",
    marginBottom: 10,
    color: Colors.PRIMARY,
  },
  activity: {
    flexDirection: "row",
    marginBottom: 12,
  },
  activityTime: {
    width: 80,
    fontSize: 14,
    fontFamily: "QuickSand-Medium",
    color: Colors.PRIMARY,
  },
  activityDetails: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontFamily: "QuickSand-Medium",
  },
  locationText: {
    fontSize: 14,
    fontFamily: "QuickSand",
    color: "#666",
    marginTop: 2,
  },
  attractionCard: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  attractionImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  attractionInfo: {
    padding: 15,
  },
  attractionName: {
    fontSize: 18,
    fontFamily: "QuickSand-Bold",
    marginBottom: 5,
  },
  attractionDescription: {
    fontSize: 14,
    fontFamily: "QuickSand",
    color: "#666",
    marginBottom: 8,
  },
  attractionDetails: {
    fontSize: 14,
    fontFamily: "QuickSand-Medium",
    marginBottom: 4,
  },
  accommodationCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  hotelName: {
    fontSize: 18,
    fontFamily: "QuickSand-Bold",
    marginBottom: 5,
  },
  hotelDetails: {
    fontSize: 14,
    fontFamily: "QuickSand-Medium",
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  mapButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  linkButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  hotelButton: {
    flex: 0.48,
    marginTop: 0,
  },
  bookButton: {
    backgroundColor: "#28a745",
  },
  buttonText: {
    color: "white",
    fontFamily: "QuickSand-Bold",
    fontSize: 14,
  },
  locationButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: "flex-start",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  locationButtonText: {
    color: "white",
    fontFamily: "QuickSand-Medium",
    fontSize: 14,
  },
  transportSection: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
