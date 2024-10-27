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

const OLA_API_URL = "https://api.olamaps.io/places/v1/autocomplete";
const PLACE_DETAILS_URL = "https://api.olamaps.io/places/v1/details";
const TOKEN_URL =
  "https://account.olamaps.io/realms/olamaps/protocol/openid-connect/token";
const CLIENT_ID = "fb42cbeb-22b6-43c7-a10d-09f6fd8c8121";
const CLIENT_SECRET = "QrDpu1dSaByajpSaDlcCQX0Z5K8gbbgR";

// Define allowed place types
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
  const [debugInfo, setDebugInfo] = useState(null);

  const { setTripData } = useContext(CreateTripContext);
  const router = useRouter();

  // Initialize token and location
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        console.log("Initializing...");

        // Get authentication token
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

        console.log("Token received successfully");
        setToken(tokenResponse.data.access_token);

        // Get user location
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          throw new Error("Location permission denied");
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const locationString = `${latitude},${longitude}`;
        console.log("Location obtained:", locationString);
        setUserLocation(locationString);

        setDebugInfo(`Initialized with location: ${locationString}`);
      } catch (error) {
        console.error("Initialization error:", error);
        setError(
          error.message === "Location permission denied" ? (
            <LocationError />
          ) : (
            `Initialization failed: ${error.message}`
          )
        );
        Alert.alert(
          "Initialization Error",
          `Failed to initialize: ${error.message}. Please restart the app.`
        );
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // Fetch location suggestions
  const fetchSuggestions = useCallback(
    async (input) => {
      if (!input?.trim() || !token || !userLocation) {
        console.log("Missing required data:", {
          hasInput: !!input?.trim(),
          hasToken: !!token,
          hasLocation: !!userLocation,
        });
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("Fetching suggestions for:", input);
        const requestConfig = {
          params: {
            input,
            location: userLocation,
            radius: 50000000,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        console.log("Request config:", requestConfig);

        const response = await axios.get(OLA_API_URL, requestConfig);

        console.log("API Response:", response.data);

        if (!response.data?.predictions) {
          throw new Error("No predictions in response");
        }

        const filteredSuggestions = response.data.predictions.filter(
          (prediction) =>
            prediction.types?.some((type) => ALLOWED_TYPES.includes(type))
        );

        console.log("Filtered suggestions:", filteredSuggestions);
        setSuggestions(filteredSuggestions);
        setDebugInfo(`Found ${filteredSuggestions.length} suggestions`);
      } catch (error) {
        console.error("Suggestion fetch error:", error);
        const errorMessage = error.response?.data?.error || error.message;
        setError(`Failed to fetch suggestions: ${errorMessage}`);
        Alert.alert(
          "Search Error",
          `Failed to fetch suggestions: ${errorMessage}`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [token, userLocation]
  );

  // Handle place selection
  const handlePlaceSelection = async (placeId, placeName) => {
    if (!placeId || !token) {
      setError("Invalid place selection");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching details for place:", placeId);
      const response = await axios.get(PLACE_DETAILS_URL, {
        params: { place_id: placeId },
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Place details response:", response.data);

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
      console.error("Place selection error:", error);
      setError(`Failed to get place details: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search handler
  const debouncedFetchSuggestions = useCallback(
    debounce((text) => fetchSuggestions(text), 300),
    [fetchSuggestions]
  );

  // Input change handler
  const handleInputChange = (text) => {
    setSearchText(text);
    if (text.trim()) {
      debouncedFetchSuggestions(text);
    } else {
      setSuggestions([]);
    }
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

        {debugInfo && __DEV__ && (
          <Text style={styles.debugText}>{debugInfo}</Text>
        )}

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
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 10,
    fontFamily: "QuickSand",
  },
  suggestionsList: {
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 5,
    maxHeight: "80%",
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomColor: "#eee",
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
    marginTop: 2,
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
  debugText: {
    color: "#666",
    marginVertical: 5,
    fontSize: 12,
    textAlign: "center",
  },
});

export default SearchPlace;
