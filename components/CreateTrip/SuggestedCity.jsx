import React, { useContext } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { suggestedCities } from "../../constants/Options";
import { CreateTripContext } from "@/context/CreateTripContext";
import { useRouter } from "expo-router";

const SuggestedCity = () => {
  const { setTripData } = useContext(CreateTripContext);
  const router = useRouter();

  const handleCitySelection = (city) => {
    // Get the first place from the city's places array as the default selection
    const defaultPlace = city.places[0];

    setTripData({
      locationInfo: {
        name: `${defaultPlace.name}, ${city.city}`,
        placeId: defaultPlace.place_id,
      },
      coordinates: defaultPlace.geometry.location,
    });

    router.push("/create-trip/SelectTraveler");
  };

  const renderCityItem = ({ item }) => {
    // Get total number of places for this city
    const placesCount = item.places.length;

    return (
      <TouchableOpacity
        style={styles.cityButton}
        onPress={() => handleCitySelection(item)}
      >
        <View style={styles.cityContent}>
          <Text style={styles.cityName}>{item.city}</Text>
          <Text style={styles.placesCount}>{placesCount} places to visit</Text>
        </View>
        <View style={styles.placesPreview}>
          {item.places.slice(0, 2).map((place, index) => (
            <Text
              key={place.place_id}
              style={styles.placeText}
              numberOfLines={1}
            >
              • {place.name}
            </Text>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Popular Destinations</Text>
      <FlatList
        data={suggestedCities}
        keyExtractor={(item, index) => `${item.city}-${index}`}
        renderItem={renderCityItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "QuickSand-Bold",
    marginBottom: 12,
    color: "#333",
  },
  listContainer: {
    paddingBottom: 20,
  },
  cityButton: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cityContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cityName: {
    fontSize: 16,
    fontFamily: "QuickSand-SemiBold",
    color: "#333",
  },
  placesCount: {
    fontSize: 12,
    fontFamily: "QuickSand",
    color: "#666",
  },
  placesPreview: {
    marginTop: 4,
  },
  placeText: {
    fontSize: 13,
    fontFamily: "QuickSand",
    color: "#666",
    marginVertical: 2,
  },
});

export default SuggestedCity;
