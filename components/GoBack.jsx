import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Link, useNavigation } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

const GoBack = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.backbutton}>
      <TouchableOpacity
        style={{ display: "flex", flexDirection: "row" }}
        onPress={() => navigation.goBack()}
      >
        <View>
          <Entypo name="chevron-small-left" size={40} color="black" />
        </View>
        <View style={{ paddingTop: 11, left: -8 }}>
          <Text style={{ justifyContent: "center" }}>Back</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default GoBack;

const styles = StyleSheet.create({
  backbutton: {
    marginTop: 30,
  },
});
