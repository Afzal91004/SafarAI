import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { useState, useContext } from "react";
import GoBack from "../../components/GoBack";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import CalendarPicker from "react-native-calendar-picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import moment from "moment/moment";
import { CreateTripContext } from "../../context/CreateTripContext";

const SelectDates = () => {
  const router = useRouter();

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const { tripData, setTripData } = useContext(CreateTripContext);

  const onDateChange = (date, type) => {
    if (type === "START_DATE") {
      setStartDate(moment(date));
      setEndDate(undefined);
    } else if (type === "END_DATE") {
      setEndDate(moment(date));
    }
  };
  const dateSelection = () => {
    if (!startDate || !endDate) {
      ToastAndroid.show("Please Select Start and End Date", ToastAndroid.LONG);
      return;
    }
    const totalNoOfDays = moment(endDate).diff(moment(startDate), "days") + 1;
    setTripData({
      ...tripData,
      startDate: startDate,
      endDate: endDate,
      totalNoOfDays: totalNoOfDays,
    });
    console.log(tripData);
    router.push("/create-trip/SelectBudget");
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.header}>
          <GoBack color={"white"} />
          <Text style={styles.headerText}>Select Date</Text>
        </View>
        <View style={styles.hr} />
      </View>
      <Text style={styles.headText}>When's the Trip?</Text>
      <View style={styles.subContainer2}>
        <Text style={styles.subText}>Pick the perfect date for your Trip!</Text>
      </View>
      <View style={styles.calender}>
        <CalendarPicker
          allowRangeSelection={true}
          onDateChange={onDateChange}
          minDate={new Date()}
          allowBackwardRangeSelect={true}
          selectedRangeStyle={{
            backgroundColor: Colors.PRIMARY,
          }}
          startFromMonday={true}
          scrollDecelarationRate={"fast"}
          scrollable={true}
          restrictMonthNavigation={true}
          selectedDayTextStyle={{
            color: "white",
          }}
          maxRangeDuration={7}
        />
      </View>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            dateSelection();
          }}
        >
          <Text style={styles.buttonText}>
            Continue <AntDesign name="arrowright" size={20} color="white" />
          </Text>
        </TouchableOpacity>
      </View>
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
  calender: {
    paddingTop: 50,
  },
  continueButton: {
    backgroundColor: Colors.PRIMARY,
    height: 45,
    width: 200,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 45,
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
