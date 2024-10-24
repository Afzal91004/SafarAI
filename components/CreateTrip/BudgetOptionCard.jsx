import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import * as Animatable from "react-native-animatable";

const BudgetOptionCard = ({ option, index, selectedBudget }) => {
  const isSelected = selectedBudget?.id === option?.id;
  return (
    <Animatable.View
      animation="fadeInDown"
      key={index}
      delay={300 + index * 300}
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={[
          styles.container,
          isSelected && {
            borderWidth: 3,
            borderColor: Colors.PRIMARY,
            padding: 5,
            width: 320,
          },
        ]}
      >
        <View style={styles.icon}>
          <Text style={{ fontSize: 27 }}>{option.icon}</Text>
        </View>
        <View>
          <Text style={styles.title}>{option.title}</Text>
          <Text style={styles.description}>{option.description}</Text>
        </View>
      </View>
    </Animatable.View>
  );
};

export default BudgetOptionCard;

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: 320,
    alignItems: "center",
    marginVertical: 5,
    borderRadius: 20,
    flexDirection: "row",
    backgroundColor: "#DCDCDC",
    paddingLeft: 10,
  },
  title: {
    fontFamily: "QuickSand-Bold",
    fontSize: 20,
    color: "black",
  },
  description: {
    fontFamily: "QuickSand-Medium",
    fontSize: 13,
    color: "black",
  },
  icon: {
    padding: 5,
    borderRadius: 200,
    backgroundColor: "white",
    marginRight: 10,
    fontSize: 40,
  },
});
