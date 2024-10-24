import { Colors } from "@/constants/Colors";
import { useRouter, Link } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import * as Animatable from "react-native-animatable";

const Login = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/logo.png")}
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
        blurRadius={4}
      >
        <Animatable.View
          animation="zoomIn"
          easing="ease-in"
          delay={800}
          duration={500}
          style={styles.subcontainer}
        >
          <Text
            style={{
              fontSize: 34,
              fontFamily: "QuickSand-Bold",
              paddingTop: 5,
              color: Colors.PRIMARY,
            }}
          >
            Safar AI
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "QuickSand-Medium",
              paddingTop: 4,
              color: Colors.light.text,
            }}
          >
            Embark on a Journey, Tailored Just for You.
          </Text>
          <Animatable.View
            animation={"jello"}
            easing={"ease-in"}
            iterationCount="infinite"
            style={styles.button}
          >
            <TouchableOpacity
              onPress={() => router.push("/auth/sign-in/Index")}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </Animatable.View>
        </Animatable.View>
      </ImageBackground>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backkgroundColor: Colors.ACCENT,
    alignItems: "center",
    justifyContent: "center",
  },
  subcontainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 30,
    alignItems: "center",
    height: 200,
    paddingTop: 10,
    padding: 10,
    width: 330,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    top: "5%",
  },
  buttonText: {
    color: "white",
    padding: 10,
    fontFamily: "QuickSand-SemiBold",
    fontSize: 18,
    paddingHorizontal: 20,
  },
});
