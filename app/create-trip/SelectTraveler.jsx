import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import GoBack from "../../components/GoBack";
import { Colors } from "@/constants/Colors";
import { SelectTravelerlist } from "@/constants/Options";
import OptionCard from "../../components/CreateTrip/OptionCard";
import { CreateTripContext } from "../../context/CreateTripContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";

const SelectTraveler = () => {
  const [selectedTraveler, setSelectedTraveler] = useState(
    SelectTravelerlist[0]
  );
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();
  useEffect(() => {
    setTripData({ ...tripData, traveler: selectedTraveler });
  }, [selectedTraveler]);

  return (
    <View>
      <View style={styles.subContainer}>
        <View style={styles.header}>
          <GoBack color={"white"} />
          <Text style={styles.selectTravelerText}>Select Traveler</Text>
        </View>
        <View style={styles.hr} />
      </View>

      <Text style={styles.headText}>Traveling With?</Text>
      <View style={styles.subContainer2}>
        <Text style={styles.subText}>Choose Your Travel Companions!</Text>
        <View style={styles.listContainer}>
          <FlatList
            data={SelectTravelerlist}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => setSelectedTraveler(item)}>
                <OptionCard
                  option={item}
                  index={index}
                  selectedTraveler={selectedTraveler}
                />
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => router.push("/create-trip/SelectDates")}
          >
            <Text style={styles.buttonText}>
              Continue <AntDesign name="arrowright" size={20} color="white" />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SelectTraveler;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  selectTravelerText: {
    paddingTop: 28,
    fontSize: 20,
    fontFamily: "QuickSand-Medium",
    marginLeft: "11%",
    color: "white",
  },
  hr: {
    borderBottomColor: "rgba(0,0,0, 0.2)",
    borderBottomWidth: 1,
    width: "100%",
    marginTop: 3,
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
    alignItems: "center",
    justifyContent: "center",
    width: "340",
    marginTop: 10,
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
});
