import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import * as Animatable from "react-native-animatable";
import { Link, router } from "expo-router";
import GoBack from "../../../components/GoBack";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, sendVerificationEmail } from "../../../config/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const onCreateAccount = async () => {
    if (
      !email ||
      !password ||
      !name ||
      email.length <= 5 ||
      password.length <= 7 ||
      name.length <= 1
    ) {
      ToastAndroid.show("Please Enter All Details", ToastAndroid.BOTTOM);
      return;
    }

    setLoading(true);
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Send verification email
      const emailSent = await sendVerificationEmail(user);

      if (emailSent) {
        Alert.alert(
          "Verification Email Sent",
          "Please check your email to verify your account before signing in.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/auth/sign-in/Index"),
            },
          ]
        );
      } else {
        ToastAndroid.show(
          "Failed to send verification email",
          ToastAndroid.BOTTOM
        );
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "An error occurred during sign up";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 8 characters";
      }

      ToastAndroid.show(errorMessage, ToastAndroid.BOTTOM);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <GoBack />

      <View style={styles.container}>
        <Animatable.View animation="fadeInLeft" duration={400} easing="ease-in">
          <Text style={styles.secondaryHeading}>New here? Let's get you</Text>
          <Text style={styles.primaryHeading}>Signed Up</Text>
          <Text style={styles.secondaryHeading}>and start your journey!</Text>
        </Animatable.View>
        <View style={styles.subContainer}>
          <Animatable.View animation="fadeIn" delay={400} easing="ease-in-out">
            <Text style={styles.text}>Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={setName}
              placeholder="Enter your Name"
              value={name}
            />
          </Animatable.View>

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
              secureTextEntry={true}
              style={styles.input}
              onChangeText={setPassword}
              placeholder="Enter your Password"
              value={password}
            />
            <View>
              <TouchableOpacity
                style={[styles.login, loading && styles.loginDisabled]}
                onPress={onCreateAccount}
                disabled={loading}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: "QuickSand-SemiBold",
                    fontSize: 20,
                  }}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: "QuickSand-Medium",
                  fontSize: 15,
                }}
              >
                Already have an account?{" "}
                <Link href={"/auth/sign-in/Index"}>
                  <Text
                    style={{
                      fontFamily: "QuickSand-Bold",
                      fontSize: 18,
                      padding: 2,
                      color: Colors.PRIMARY,
                      textDecorationLine: "underline",
                    }}
                  >
                    Sign In
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

export default SignUp;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
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
});
