import React from "react";
import { Text, TouchableHighlight, Picker, View } from "react-native";
import styles from "./styles";

const renderItem = ({ item }) => {
  return (
    <TouchableHighlight
      underlayColor="#ccc"
      onPress={() => {
        console.log("pressed!");
      }}
      style={styles.list_item}
    >
      <View key={item.key} style={styles.list_item_content}>
        <View>
          <Text>{item.name}</Text>
        </View>
        <View>
          <Text>{" Sets: " + item.sets}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const renderPickerItems = data => {
  return data.map(item => {
    let val = item.name.toLowerCase();
    let id = (item.key) ? item.key : item.id;
    return <Picker.Item key={id} label={item.name} value={id} />;
  });
};

const uniqid = () => {
  return Math.random()
    .toString(36)
    .substr(2, 9);
};

const getLocalDateTime = date => {
  let hours = date.getHours();
  if (hours < 10) hours = "0" + hours;

  let minutes = date.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;

  let month = date.getMonth() + 1;
  return (
    month +
    "/" +
    date.getDate() +
    "/" +
    date.getFullYear() +
    ", " +
    hours +
    ":" +
    minutes
  );
};

const getDate = () => {
  const datetime = getLocalDateTime(new Date());
  const date = datetime.substr(0, datetime.lastIndexOf(","));
  return date;
};

const getShortMonth = month_number => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  return months[month_number];
};

const lastWeeksDates = () => {
  const daysNumber = [...Array(7).keys()];
  const datesForLastWeek = daysNumber.map((element, index) => {
    let date = new Date();
    date.setDate(date.getDate() - index);
    let datetime = getLocalDateTime(date);
    let formatted_date = datetime.substr(0, datetime.lastIndexOf(","));
    return formatted_date;
  });
  return datesForLastWeek;
};

const getWorkoutsFromStorage = async (store, dates) => {
  const workoutKeys = dates.map(date => {
    return date + "_exercises";
  });
  const response = await store.get(workoutKeys);
  return response.filter(workout => {
    if (workout) {
      return workout;
    }
  });
}

const getLogsData = (workouts, dates) => {
  return workouts.map((workout_session, index) => {
    let date = dates[index];
    let d = new Date(date);
    let month = getShortMonth(d.getMonth());
    let day = d.getDate();

    if (workout_session) {
      const exercises = workout_session.map(item => {
        return item.exercise_name;
      });
      return {
        key: uniqid(),
        date,
        month,
        day,
        exercises: displayFirstNExercises(exercises, 3)
      };
    }
  });
};

const displayFirstNExercises = (exercises, numOfExercises) => {
  return exercises.splice(0, numOfExercises).join(",") + "..."
}

export {
  renderItem,
  renderPickerItems,
  uniqid,
  getDate,
  lastWeeksDates,
  getShortMonth,
  getLogsData,
  getWorkoutsFromStorage
};
