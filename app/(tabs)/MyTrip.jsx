import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  BackHandler,
  ToastAndroid,
  Platform,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "../../components/Header";
import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import StartNewTripCard from "../../components/MyTrips/StartNewTripCard";
import { collection, getDocs, query, where } from "firebase/firestore";
import UserTripList from "../../components/MyTrips/UserTripList";
import { auth, db } from "../../config/FirebaseConfig";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import * as Location from "expo-location";

const MyTrip = () => {
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);
  const [lastBackPressed, setLastBackPressed] = useState(0);
  const router = useRouter();
  const flatListRef = useRef(null);
  const { scrollToTop } = useLocalSearchParams();
  const { width: screenWidth } = useWindowDimensions();

  const user = auth.currentUser;

  // Calculate responsive values
  const isLargeScreen = screenWidth >= 768; // Tablet/Desktop breakpoint
  const contentMaxWidth = isLargeScreen
    ? Math.min(1200, screenWidth * 0.8)
    : screenWidth;
  const paddingHorizontal = isLargeScreen
    ? Math.max(40, (screenWidth - contentMaxWidth) / 2)
    : 25;
  const headerFontSize = isLargeScreen ? 42 : 35;

  // Prevent default back navigation and handle app exit
  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        const currentTime = new Date().getTime();

        if (currentTime - lastBackPressed < 2000) {
          BackHandler.exitApp();
          return true;
        }

        setLastBackPressed(currentTime);
        if (Platform.OS === "android") {
          ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
        }
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    }, [lastBackPressed])
  );

  useEffect(() => {
    if (user) {
      getMyTrips();
    } else {
      router.replace("/auth/sign-in/Index");
    }
  }, [user]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (scrollToTop === "true" && flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [scrollToTop]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");
      if (status === "granted") {
        getCurrentLocation();
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      setLocationPermission(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      console.log("Current location:", location);
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const getMyTrips = async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
      const q = query(
        collection(db, "UserTrips"),
        where("userEmail", "==", user.email)
      );
      const querySnapshot = await getDocs(q);

      const trips = [];
      querySnapshot.forEach((doc) => {
        trips.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        });
      });

      trips.sort((a, b) => b.createdAt - a.createdAt);
      setUserTrips(trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
      Alert.alert(
        "Error",
        "Failed to load your trips. Please check your connection and try again.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrip = () => {
    router.push({
      pathname: "/create-trip/SearchPlace",
      params: { scrollToTop: "true" },
    });
  };

  const handleRefresh = () => {
    getMyTrips();
  };

  const ListHeaderComponent = () => (
    <View>
      <View style={[styles.heading, { marginBottom: isLargeScreen ? 20 : 10 }]}>
        <Text style={[styles.headingText, { fontSize: headerFontSize }]}>
          My Trips
        </Text>
        <TouchableOpacity onPress={handleAddTrip} style={styles.addTripButton}>
          <View style={[styles.addTrip, { padding: isLargeScreen ? 5 : 0 }]}>
            <MaterialIcons
              name="add-location-alt"
              size={isLargeScreen ? 36 : 30}
              style={[styles.addTripIcon, { padding: isLargeScreen ? 10 : 7 }]}
              color="white"
            />
          </View>
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator
          size={isLargeScreen ? "large" : "small"}
          color={Colors.PRIMARY}
          style={styles.loader}
        />
      )}
    </View>
  );

  const renderContent = () => {
    if (!loading && userTrips?.length === 0) {
      return <StartNewTripCard onStartTrip={handleAddTrip} />;
    }
    return (
      <UserTripList
        userTrips={userTrips}
        onRefresh={handleRefresh}
        isRefreshing={loading}
        isLargeScreen={isLargeScreen}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <View
        style={[
          styles.contentWrapper,
          { maxWidth: contentMaxWidth, alignSelf: "center" },
        ]}
      >
        <FlatList
          ref={flatListRef}
          ListHeaderComponent={ListHeaderComponent}
          data={[{ key: "content" }]}
          renderItem={() => renderContent()}
          style={styles.listContainer}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingHorizontal: paddingHorizontal },
          ]}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default MyTrip;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentWrapper: {
    flex: 1,
    width: "100%",
  },
  listContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 5,
    paddingBottom: 20,
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headingText: {
    fontFamily: "QuickSand-Bold",
    textDecorationLine: "underline",
  },
  addTripButton: {
    elevation: 3,
  },
  addTrip: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 26,
    elevation: 3,
  },
  addTripIcon: {
    padding: 7,
  },
  loader: {
    paddingTop: 30,
  },
});
