import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { StyleSheet, Text, View, Animated } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Colors } from "@/constants/Colors";
import { TravelEmojis } from "../../constants/TravelLoadingEmojis"; // Assume TravelEmojis is an array of emojis
import { CreateTripContext } from "../../context/CreateTripContext";
import { AI_PROMPT } from "../../constants/Options";
import { useRouter } from "expo-router";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCf_h0T9QUTsdQ1SegvvWiZCZzUT2BPoFQ",
  authDomain: "safar-ai.firebaseapp.com",
  projectId: "safar-ai",
  storageBucket: "safar-ai.appspot.com",
  messagingSenderId: "769604925830",
  appId: "1:769604925830:web:b2f7dd590aaf4eb114d407",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Generative AI configuration
const genAI = new GoogleGenerativeAI(
  process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY
);
const chatSession = genAI
  .getGenerativeModel({ model: "gemini-1.5-flash" })
  .startChat({
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  });

const GenerateTrip = () => {
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);
  const rotation = useState(new Animated.Value(0))[0];
  const [loading, setLoading] = useState(false);
  const { tripData } = useContext(CreateTripContext);
  const router = useRouter();
  const user = auth.currentUser;

  // Function to generate the trip
  const GenerateAiTrip = async () => {
    if (!tripData) return;
    setLoading(true);

    try {
      const FINAL_PROMPT = AI_PROMPT.replace(
        "{location}",
        tripData.locationInfo.name
      )
        .replace("{totalDays}", tripData.totalNoOfDays)
        .replace("{totalNight}", tripData.totalNoOfDays - 1)
        .replace("{traveler}", tripData.traveler.title)
        .replace("{budget}", tripData.budget);

      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const tripResponse = JSON.parse(result.response.text());

      const docId = Date.now().toString();
      await setDoc(doc(db, "UserTrips", docId), {
        userEmail: user.email,
        tripPlan: tripResponse, //AI RESULT
        tripData: JSON.stringify(tripData), //user Selection data
        docId: docId,
      });

      router.push("(tabs)/MyTrip");
    } catch (error) {
      console.error("Error generating trip:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GenerateAiTrip();
  }, []);

  useEffect(() => {
    const startRotation = () => {
      rotation.setValue(0);
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setCurrentEmojiIndex((prevIndex) =>
          prevIndex === TravelEmojis.length - 1 ? 0 : prevIndex + 1
        );
      });
    };

    const emojiInterval = setInterval(startRotation, 1750);

    return () => clearInterval(emojiInterval);
  }, [rotation]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Sit Tight!</Text>
      <Text style={styles.descriptionText}>
        Crafting your trip. Almost there...
      </Text>
      <View style={styles.emojiContainer}>
        <Animated.Text
          style={[styles.emoji, { transform: [{ rotate: rotateInterpolate }] }]}
        >
          {TravelEmojis[currentEmojiIndex]}
        </Animated.Text>
      </View>
      <Text style={styles.backText}>
        Processing your request, do not navigate away.
      </Text>
    </View>
  );
};

export default GenerateTrip;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    height: "100%",
    alignItems: "center",
    paddingTop: 60,
  },
  loadingText: {
    fontFamily: "QuickSand-Bold",
    fontSize: 24,
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
  descriptionText: {
    fontFamily: "QuickSand-Medium",
    fontSize: 20,
    textAlign: "center",
    lineHeight: 22,
  },
  emojiContainer: {
    marginTop: 140,
    marginBottom: 120,
  },
  emoji: {
    fontSize: 160,
  },
  backText: {
    fontFamily: "QuickSand-SemiBold",
    fontSize: 15,
    color: "gray",
  },
});
