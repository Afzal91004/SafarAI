import { StyleSheet, Text, ImageBackground, View } from "react-native";
import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import { Colors } from "@/constants/Colors";

const OptionCard = ({ option, index, selectedTraveler }) => {
  return (
    <Animatable.View
      animation="fadeInDown"
      key={index}
      delay={300 + index * 300}
      style={{
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={[
          styles.container,
          selectedTraveler?.id === option?.id && {
            borderWidth: 3,
            borderColor: Colors.PRIMARY,
            padding: 5,
            height: 150,
            width: 320,
          },
        ]}
      >
        <ImageBackground
          source={option.uri}
          style={styles.background}
          imageStyle={{ borderRadius: 20 }}
        >
          <View style={styles.overlay}>
            <Text style={styles.title}>{option.title}</Text>
            <Text style={styles.description}>{option.description}</Text>
          </View>
        </ImageBackground>
      </View>
    </Animatable.View>
  );
};

export default OptionCard;

const styles = StyleSheet.create({
  container: {
    height: 110,
    width: 300,
    borderColor: "black",
    borderWidth: 1,
    alignItems: "center",
    marginVertical: 5,
    borderRadius: 20,
    overflow: "hidden",
  },
  background: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
  },
  title: {
    fontFamily: "QuickSand-Bold",
    fontSize: 20,
    color: "white",
  },
  description: {
    fontFamily: "QuickSand-Medium",
    fontSize: 13,
    color: "white",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});
