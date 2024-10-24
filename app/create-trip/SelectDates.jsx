import { StyleSheet, Text, View } from "react-native";
import React from "react";
import GoBack from "../../components/GoBack";
import { Colors } from "@/constants/Colors";

const SelectDates = () => {
  return (
    <View>
      <View style={styles.subContainer}>
        <View style={styles.header}>
          <GoBack color={"white"} />
          <Text style={styles.headerText}>Date</Text>
        </View>
        <View style={styles.hr} />
      </View>
      <Text>SelectDates</Text>
    </View>
  );
};

export default SelectDates;

const styles = StyleSheet.create({
  subContainer: {
    elevation: 5,
    backgroundColor: Colors.PRIMARY,
    marginTop: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerText: {
    paddingTop: 28,
    fontSize: 20,
    fontFamily: "QuickSand-Medium",
    marginLeft: "18%",
    color: "white",
  },
});
