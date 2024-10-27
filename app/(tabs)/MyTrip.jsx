import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Header from "../../components/Header";
import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import StartNewTripCard from "../../components/MyTrips/StartNewTripCard";
import { collection, getDocs, query, where } from "firebase/firestore";
import UserTripList from "../../components/MyTrips/UserTripList";
import { auth, db } from "../../config/FirebaseConfig";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";

const MyTrip = () => {
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);
  const router = useRouter();
  const flatListRef = useRef(null);
  const { scrollToTop } = useLocalSearchParams();

  const user = auth.currentUser;

  useEffect(() => {
    user && getMyTrips();
    requestLocationPermission();
  }, [user]);

  useEffect(() => {
    if (scrollToTop === "true" && flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [scrollToTop]);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocationPermission(false);
      console.log("Permission to access location was denied");
      return;
    }
    setLocationPermission(true);
    getCurrentLocation();
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      console.log("Current location:", location);
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const getMyTrips = async () => {
    setLoading(true);
    setUserTrips([]);
    const q = query(
      collection(db, "UserTrips"),
      where("userEmail", "==", user?.email)
    );
    const querySnapShot = await getDocs(q);

    querySnapShot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setUserTrips((prev) => [...prev, doc.data()]);
    });
    setLoading(false);
  };

  const handleAddTrip = () => {
    router.push({
      pathname: "/create-trip/SearchPlace",
      params: { scrollToTop: "true" },
    });
  };

  const ListHeaderComponent = () => (
    <View>
      <View style={styles.Heading}>
        <Text style={styles.HeadingText}>My Trips</Text>
        <TouchableOpacity onPress={handleAddTrip}>
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

      {loading && (
        <ActivityIndicator
          size={"large"}
          color={Colors.PRIMARY}
          style={{ paddingTop: 30 }}
        />
      )}
    </View>
  );

  const renderContent = () => {
    if (!loading && userTrips?.length === 0) {
      return <StartNewTripCard />;
    }
    return <UserTripList userTrips={userTrips} />;
  };

  return (
    <View style={{ backgroundColor: Colors.light.background, flex: 1 }}>
      <Header />
      <FlatList
        ref={flatListRef}
        ListHeaderComponent={ListHeaderComponent}
        data={[{ key: "content" }]} // Single item for the main content
        renderItem={() => renderContent()}
        style={styles.Container}
        contentContainerStyle={styles.ContentContainer}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default MyTrip;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  ContentContainer: {
    paddingHorizontal: 25,
    paddingTop: 5,
    paddingBottom: 120,
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
