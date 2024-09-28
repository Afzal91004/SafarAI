import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { Colors } from "@/constants/Colors";
import * as Animatable from "react-native-animatable";
import { Link } from "expo-router";

const SignIn = () => {
  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" duration={400} easing="ease-in">
        <Text style={styles.secondaryHeading}>Welcome back! Let's</Text>
        <Text style={styles.primaryHeading}>Sign You In</Text>
        <Text style={styles.secondaryHeading}>and explore.</Text>
      </Animatable.View>
      <View style={styles.subContainer}>
        <Animatable.View animation="fadeIn" delay={400} easing="ease-in-out">
          <Text style={styles.text}>Email</Text>
          <TextInput style={styles.input} placeholder="Enter your Email" />
        </Animatable.View>
        <Animatable.View animation="fadeIn" delay={400} easing="ease-in-out">
          <Text style={styles.text}>Password</Text>
          <TextInput
            secureTextEntry={true}
            style={styles.input}
            placeholder="Enter your Password"
          />
          <View>
            <TouchableOpacity style={styles.login}>
              <Text
                style={{
                  color: "white",
                  fontFamily: "QuickSand-SemiBold",
                  fontSize: 20,
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
            <Text style={{ fontFamily: "QuickSand-Medium", fontSize: 14 }}>
              Don't have an account?{" "}
              <Link href={"/auth/sign-up/Index"}>
                <Text
                  style={{
                    fontFamily: "QuickSand-Bold",
                    fontSize: 16,
                    color: Colors.PRIMARY,
                    textDecorationLine: "underline",
                  }}
                >
                  Sign Up
                </Text>
              </Link>
            </Text>
          </View>
        </Animatable.View>
      </View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    padding: 25,
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
