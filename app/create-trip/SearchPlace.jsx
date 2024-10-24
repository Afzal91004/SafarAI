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
} from "react-native";
import axios from "axios";
import { debounce } from "lodash";
import GoBack from "../../components/GoBack";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { CreateTripContext } from "@/context/CreateTripContext";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import LocationError from "../../components/Errors/LocationError";

const OLA_API_URL = "https://api.olamaps.io/places/v1/autocomplete";
const PLACE_DETAILS_URL = "https://api.olamaps.io/places/v1/details";
const TOKEN_URL =
  "https://account.olamaps.io/realms/olamaps/protocol/openid-connect/token";
const CLIENT_ID = "fb42cbeb-22b6-43c7-a10d-09f6fd8c8121";
const CLIENT_SECRET = "QrDpu1dSaByajpSaDlcCQX0Z5K8gbbgR";

const SearchPlace = () => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const { tripData, setTripData } = useContext(CreateTripContext);

  const router = useRouter();

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.post(
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
        setToken(response.data.access_token);
      } catch (error) {
        console.error("Error fetching access token:", error);
        setError("Failed to authenticate. Please try again later.");
      }
    };

    const getUserLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setUserLocation(`${latitude},${longitude}`);
      } catch (error) {
        console.error("Error getting location:", error);
        setError(<LocationError />);
      }
    };

    const initialize = async () => {
      try {
        await Promise.all([getToken(), getUserLocation()]);
      } catch (error) {
        console.error("Initialization error:", error);
        setError("Failed to initialize. Please try again.");
      }
    };

    initialize();
  }, []);

  const fetchSuggestions = useCallback(
    async (input) => {
      if (!input || !token || !userLocation) {
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
            radius: 50000,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuggestions(response.data.predictions);
      } catch (error) {
        console.error(
          "Error fetching suggestions:",
          error.response ? error.response.data : error.message
        );
        setError("Failed to fetch suggestions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [token, userLocation]
  );

  const fetchPlaceDetails = async (placeId) => {
    if (!placeId || !token) {
      setError("Invalid place ID or token.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${PLACE_DETAILS_URL}`, {
        params: {
          place_id: placeId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Request-Id": generateUUID(),
          "X-Correlation-Id": generateUUID(),
        },
      });

      if (response.data && response.data.result) {
        console.log(
          "Place Details:",
          JSON.stringify(response.data.result, null, 2)
        );
        setSearchText(response.data.result.name || "");
        setTripData({
          locationInfo: {
            name: response.data.result.name,
          },
          coordinates: response.data.result.geometry.location,
        });
        router.push("/create-trip/SelectTraveler");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      const errorMessage = error.response
        ? `Error: ${
            error.response.data.error_message || error.response.statusText
          }`
        : error.message || "Network Error. Please check your connection.";
      console.error("Error fetching place details:", errorMessage);
      setError("Failed to fetch place details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce((text) => {
      if (text.trim() === "") {
        setSuggestions([]);
      } else {
        fetchSuggestions(text);
      }
    }, 300),
    [fetchSuggestions]
  );

  const handleInputChange = (text) => {
    setSearchText(text);
    debouncedFetchSuggestions(text);
  };

  const handleSelectSuggestion = (suggestion) => {
    console.log("Selected Place:", suggestion);
    setSearchText(suggestion.structured_formatting.main_text);
    setSuggestions([]);
    fetchPlaceDetails(suggestion.place_id);
  };

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.header}>
          <GoBack color={"white"} />
          <Text style={styles.searchText}>Search</Text>
        </View>
        <View style={styles.hr} />
      </View>

      <View style={styles.subContainer2}>
        <TextInput
          style={styles.input}
          placeholder="Search for a place"
          value={searchText}
          onChangeText={handleInputChange}
        />

        {isLoading && <ActivityIndicator style={styles.loader} />}

        {error && <Text style={styles.errorText}>{error}</Text>}

        {suggestions.length > 0 && !isLoading && (
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => `${item.place_id}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectSuggestion(item)}>
                <View style={styles.suggestionItem}>
                  <Text style={styles.mainText}>
                    {item.structured_formatting.main_text}
                  </Text>
                  <Text style={styles.secondaryText}>
                    {item.structured_formatting.secondary_text}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SearchPlace;

const styles = StyleSheet.create({
  container: {
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
    marginLeft: 65,
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
    color: "white",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  suggestionItem: {
    paddingVertical: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  mainText: {
    fontWeight: "bold",
  },
  secondaryText: {
    color: "#777",
  },
  loader: {
    marginVertical: 10,
  },
  errorText: {
    color: "red",
    marginVertical: 10,
  },
});
