import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import GoBack from "../../components/GoBack";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { CreateTripContext } from "../../context/CreateTripContext";
import { SelectBudgetList } from "../../constants/BudgetOptions";
import BudgetOptionCard from "../../components/CreateTrip/BudgetOptionCard";

const SelectBudget = () => {
  const { tripData, setTripData } = useContext(CreateTripContext);
  const [selectedBudget, setSelectedBudget] = useState(SelectBudgetList[0]);
  const router = useRouter();

  const onClickContinue = () => {
    if (!selectedBudget) {
      ToastAndroid.show("Select your Budget", ToastAndroid.LONG);
    }
    router.push("/create-trip/ReviewTrip");
  };

  useEffect(() => {
    setTripData((prevData) => ({ ...prevData, budget: selectedBudget?.title }));
  }, [selectedBudget]);

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.header}>
          <GoBack color={"white"} />
          <Text style={styles.headerText}>Select Budget</Text>
        </View>
        <View style={styles.hr} />
      </View>
      <Text style={styles.headText}>Your Travel Budget?</Text>
      <View style={styles.subContainer2}>
        <Text style={styles.subText}>
          Let's find the best options for your trip!
        </Text>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={SelectBudgetList}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => setSelectedBudget(item)}>
              <BudgetOptionCard
                option={item}
                index={index}
                selectedBudget={selectedBudget}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => onClickContinue()}
        >
          <Text style={styles.buttonText}>
            Continue <AntDesign name="arrowright" size={20} color="white" />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectBudget;

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
    marginLeft: "11%",
    color: "white",
  },
  headText: {
    color: Colors.PRIMARY,
    fontFamily: "QuickSand-Bold",
    fontSize: 30,
    paddingTop: 11,
    marginLeft: 18,
  },
  subContainer2: {
    marginHorizontal: 18,
  },
  subText: {
    fontFamily: "QuickSand",
    fontSize: 18,
    paddingTop: 4,
  },
  listContainer: {
    marginTop: 15,
  },
  continueButton: {
    backgroundColor: Colors.PRIMARY,
    height: 45,
    width: 200,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "white",
    fontFamily: "QuickSand-Bold",
    fontSize: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: Colors.light.background,
    height: "100%",
  },
});
