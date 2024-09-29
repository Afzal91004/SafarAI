import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import * as Animatable from "react-native-animatable";
import { Link } from "expo-router";
import GoBack from "../../../components/GoBack";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../config/FirebaseConfig";

const SignUp = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();

  const onCreateAccount = () => {
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
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log("user: ", user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("email: ", email);
        console.log("error: ", errorMessage); // Log the error message for better debugging
      });
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
              onChangeText={(value) => setName(value)}
              placeholder="Enter your Name"
            />
          </Animatable.View>

          <Animatable.View animation="fadeIn" delay={400} easing="ease-in-out">
            <Text style={styles.text}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => setEmail(value)}
              placeholder="Enter your Email"
            />
          </Animatable.View>

          <Animatable.View animation="fadeIn" delay={400} easing="ease-in-out">
            <Text style={styles.text}>Password</Text>
            <TextInput
              secureTextEntry={true}
              style={styles.input}
              onChangeText={(value) => setPassword(value)}
              placeholder="Enter your Password"
            />
            <View>
              <TouchableOpacity style={styles.login} onPress={onCreateAccount}>
                <Text
                  style={{
                    color: "white",
                    fontFamily: "QuickSand-SemiBold",
                    fontSize: 20,
                  }}
                >
                  Create Account
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
                Don't have an account?{" "}
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
});
