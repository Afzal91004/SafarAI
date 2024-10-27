import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { debounce } from "lodash";
import GoBack from "../../components/GoBack";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { CreateTripContext } from "../../context/CreateTripContext";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import LocationError from "../../components/Errors/LocationError";
import { suggestedCities } from "../../constants/Options";

const OLA_API_URL = "https://api.olamaps.io/places/v1/autocomplete";
const PLACE_DETAILS_URL = "https://api.olamaps.io/places/v1/details";
const TOKEN_URL =
  "https://account.olamaps.io/realms/olamaps/protocol/openid-connect/token";
const CLIENT_ID = "fb42cbeb-22b6-43c7-a10d-09f6fd8c8121";
const CLIENT_SECRET = "QrDpu1dSaByajpSaDlcCQX0Z5K8gbbgR";

const ALLOWED_TYPES = [
  "locality",
  "administrative_area_level_1",
  "administrative_area_level_2",
  "administrative_area_level_3",
  "country",
  "sublocality",
  "sublocality_level_1",
  "political",
  "geocode",
];

const SearchPlace = () => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showSuggestedCities, setShowSuggestedCities] = useState(true);

  const { setTripData } = useContext(CreateTripContext);
  const router = useRouter();

  // Initialize token and location
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const tokenResponse = await axios.post(
          TOKEN_URL,
          new URLSearchParams({
            grant_type: "client_credentials",
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        if (!tokenResponse.data?.access_token) {
          throw new Error("No access token received");
        }

        setToken(tokenResponse.data.access_token);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          throw new Error("Location permission denied");
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setUserLocation(`${latitude},${longitude}`);
      } catch (error) {
        setError(
          error.message === "Location permission denied" ? (
            <LocationError />
          ) : (
            `Initialization failed: ${error.message}`
          )
        );
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const fetchSuggestions = useCallback(
    async (input) => {
      if (!input?.trim() || !token || !userLocation) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(OLA_API_URL, {
          params: {
            input,
            location: userLocation,
            radius: 50000000,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data?.predictions) {
          throw new Error("No predictions in response");
        }

        const filteredSuggestions = response.data.predictions.filter(
          (prediction) =>
            prediction.types?.some((type) => ALLOWED_TYPES.includes(type))
        );

        setSuggestions(filteredSuggestions);
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        setError(`Failed to fetch suggestions: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    },
    [token, userLocation]
  );

  const handlePlaceSelection = async (placeId, placeName) => {
    if (!placeId || !token) {
      setError("Invalid place selection");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(PLACE_DETAILS_URL, {
        params: { place_id: placeId },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data?.result?.geometry?.location) {
        throw new Error("Invalid place details received");
      }

      setTripData({
        locationInfo: {
          name: placeName,
          placeId: placeId,
        },
        coordinates: response.data.result.geometry.location,
      });

      router.push("/create-trip/SelectTraveler");
    } catch (error) {
      setError(`Failed to get place details: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelection = (city) => {
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

  const debouncedFetchSuggestions = useCallback(
    debounce((text) => fetchSuggestions(text), 300),
    [fetchSuggestions]
  );

  const handleInputChange = (text) => {
    setSearchText(text);
    setShowSuggestedCities(!text.trim());
    if (text.trim()) {
      debouncedFetchSuggestions(text);
    } else {
      setSuggestions([]);
    }
  };

  const renderSuggestedCity = ({ item }) => {
    const placesCount = item.places.length;

    return (
      <TouchableOpacity
        style={styles.suggestedCityButton}
        onPress={() => handleCitySelection(item)}
      >
        <View style={styles.cityContent}>
          <Text style={styles.cityName}>{item.city}</Text>
          <Text style={styles.placesCount}>{placesCount} places to visit</Text>
        </View>
        <View style={styles.placesPreview}>
          {item.places.slice(0, 2).map((place) => (
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
    <SafeAreaView style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.header}>
          <GoBack color="white" />
          <Text style={styles.searchText}>Search Location</Text>
        </View>
        <View style={styles.hr} />
      </View>

      <View style={styles.subContainer2}>
        <TextInput
          style={styles.input}
          placeholder="Search for a city, district, or country"
          value={searchText}
          onChangeText={handleInputChange}
          autoFocus={true}
          autoCorrect={false}
        />

        {isLoading && (
          <ActivityIndicator style={styles.loader} color={Colors.PRIMARY} />
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}

        {suggestions.length > 0 && !isLoading && (
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => `${item.place_id}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  handlePlaceSelection(
                    item.place_id,
                    item.structured_formatting?.main_text || item.description
                  )
                }
                style={styles.suggestionItem}
              >
                <Text style={styles.mainText}>
                  {item.structured_formatting?.main_text || item.description}
                </Text>
                {item.structured_formatting?.secondary_text && (
                  <Text style={styles.secondaryText}>
                    {item.structured_formatting.secondary_text}
                  </Text>
                )}
              </TouchableOpacity>
            )}
            style={styles.suggestionsList}
          />
        )}

        {showSuggestedCities && !suggestions.length && !isLoading && (
          <View style={styles.suggestedCitiesContainer}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <FlatList
              data={suggestedCities}
              keyExtractor={(item, index) => `${item.city}-${index}`}
              renderItem={renderSuggestedCity}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.suggestedListContainer}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    height: "100%",
    flex: 1,
  },
  subContainer: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
    backgroundColor: Colors.PRIMARY,
    marginTop: -40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  placesCount: {
    fontSize: 12,
    fontFamily: "QuickSand",
    color: "#666",
  },
  searchText: {
    paddingTop: 28,
    fontSize: 20,
    fontFamily: "QuickSand-Medium",
    marginLeft: "10%",
    color: "white",
  },
  hr: {
    borderBottomColor: "rgba(0,0,0, 0.2)",
    borderBottomWidth: 1,
    width: "100%",
    marginTop: 3,
  },
  subContainer2: {
    padding: 25,
    flex: 1,
  },
  input: {
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 12,
    fontFamily: "QuickSand",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  suggestionsList: {
    backgroundColor: "white",
    borderRadius: 12,
    marginTop: 8,
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: "#F0F0F0",
    borderBottomWidth: 1,
  },
  mainText: {
    fontFamily: "QuickSand-SemiBold",
    fontSize: 16,
    color: "#333",
  },
  secondaryText: {
    fontFamily: "QuickSand",
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: "red",
    marginVertical: 10,
    fontFamily: "QuickSand",
    textAlign: "center",
  },
  suggestedCitiesContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "QuickSand-Bold",
    marginBottom: 16,
    color: "#333",
  },
  suggestedListContainer: {
    paddingBottom: 20,
  },
  suggestedCityButton: {
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
    borderWidth: 1,
    borderColor: "#E0E0E0",
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

export default SearchPlace;
