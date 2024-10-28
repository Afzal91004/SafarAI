import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  BackHandler,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import * as Animatable from "react-native-animatable";
import { Link, router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, sendPasswordReset } from "../../../config/FirebaseConfig";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Add back handler to prevent accidental logouts
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // Show confirmation dialog before exiting
        Alert.alert("Exit App", "Do you want to exit the app?", [
          {
            text: "No",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true; // Prevents default back behavior
      }
    );

    return () => backHandler.remove();
  }, []);

  const onSignIn = async () => {
    if (!email || !password || email.length <= 5 || password.length <= 7) {
      ToastAndroid.show("Please Enter All Details", ToastAndroid.BOTTOM);
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        Alert.alert(
          "Email Not Verified",
          "Please verify your email before signing in. Check your inbox for the verification link.",
          [{ text: "OK" }]
        );
        return;
      }

      // Changed from router.replace to router.push
      router.replace("/MyTrip");
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "An error occurred during sign in";

      if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled";
      }

      ToastAndroid.show(errorMessage, ToastAndroid.BOTTOM);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email || email.length <= 5) {
      ToastAndroid.show("Please enter your email address", ToastAndroid.BOTTOM);
      return;
    }

    const resetSent = await sendPasswordReset(email);
    if (resetSent) {
      Alert.alert(
        "Password Reset Email Sent",
        "Please check your email for instructions to reset your password.",
        [{ text: "OK" }]
      );
    } else {
      ToastAndroid.show(
        "Failed to send password reset email",
        ToastAndroid.BOTTOM
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Animatable.View animation="fadeInLeft" duration={400} easing="ease-in">
          <Text style={styles.secondaryHeading}>Welcome back! Let's</Text>
          <Text style={styles.primaryHeading}>Sign You In</Text>
          <Text style={styles.secondaryHeading}>and explore.</Text>
        </Animatable.View>
        <View style={styles.subContainer}>
          <Animatable.View animation="fadeIn" delay={400} easing="ease-in-out">
            <Text style={styles.text}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              placeholder="Enter your Email"
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Animatable.View>
          <Animatable.View animation="fadeIn" delay={400} easing="ease-in-out">
            <Text style={styles.text}>Password</Text>
            <TextInput
              onChangeText={setPassword}
              secureTextEntry={true}
              style={styles.input}
              placeholder="Enter your Password"
              value={password}
            />
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
            <View>
              <TouchableOpacity
                style={[styles.login, loading && styles.loginDisabled]}
                onPress={onSignIn}
                disabled={loading}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: "QuickSand-SemiBold",
                    fontSize: 20,
                  }}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontFamily: "QuickSand-Medium", fontSize: 15 }}>
                Don't have an account?{" "}
                <Link href={"/auth/sign-up/Index"}>
                  <Text
                    style={{
                      fontFamily: "QuickSand-Bold",
                      fontSize: 18,
                      padding: 2,
                      color: Colors.PRIMARY,
                      textDecorationLine: "underline",
                    }}
                  >
                    Create Account
                  </Text>
                </Link>
              </Text>
            </View>
          </Animatable.View>
        </View>
      </View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: 80,
    alignItems: "center",
  },
  container: {
    paddingHorizontal: 25,
    maxWidth: 800,
  },
  primaryHeading: {
    fontFamily: "QuickSand-Bold",
    fontSize: 40,
    color: Colors.PRIMARY,
  },
  secondaryHeading: {
    color: Colors.light.text,
    fontFamily: "QuickSand-Medium",
    fontSize: 25,
  },
  subContainer: {
    top: 30,
    justifyContent: "center",
  },
  input: {
    fontFamily: "QuickSand",
    borderColor: Colors.SECONDARY,
    borderWidth: 1,
    fontSize: 18,
    padding: 10,
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "white",
  },
  text: {
    fontFamily: "QuickSand-SemiBold",
    paddingVertical: 8,
    paddingLeft: 3,
    fontSize: 18,
  },
  login: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    top: "5%",
    marginVertical: 14,
  },
  loginDisabled: {
    backgroundColor: Colors.SECONDARY,
  },
  forgotPassword: {
    color: Colors.PRIMARY,
    fontFamily: "QuickSand-SemiBold",
    fontSize: 16,
    textAlign: "right",
    marginTop: 8,
    marginBottom: 4,
    textDecorationLine: "underline",
  },
  backbutton: {
    marginTop: 30,
  },
});
