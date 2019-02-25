import React from "react";
import {
  View,
  Text,
  TouchableHighlight,
  FlatList,
  StyleSheet
} from "react-native";
import store from "react-native-simple-store";
import list_styles from "../components/List/styles";

import IconButton from "../components/IconButton";
import AlertBox from "../components/AlertBox";

import {
  getDate,
  lastWeeksDates,
  getWorkoutsFromStorage,
  getLogsData
} from "../lib/general";

export default class Logs extends React.Component {
  state = {
    logs_data: []
  };

  static navigationOptions = ({ navigation }) => ({
    headerTitle: "Logs",
    headerRight: (
      <IconButton
        size={25}
        color="#FFF"
        onPress={() => {
          navigation.navigate("LogWorkout", {
            date: getDate()
          });
        }}
      />
    )
  });

  renderItem = ({ item }) => {
    return (
      <TouchableHighlight
        underlayColor="#ccc"
        onPress={() => {
          this.props.navigation.navigate("LogWorkout", {
            date: item.date
          });
        }}
      >
        <View style={list_styles.list_item} key={item.key}>
          <View style={styles.date_container}>
            <Text style={styles.date_month}>{item.month}</Text>
            <Text style={styles.date_day}>{item.day}</Text>
          </View>

          <View style={styles.exercises}>
            <Text style={styles.exercises_text}>{item.exercises}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View>
        <FlatList data={this.state.logs_data} renderItem={this.renderItem} />
        {this.state.logs_data.length == 0 && (
          <AlertBox type="info" text="You haven't logged any sessions yet." />
        )}
      </View>
    );
  }

  componentDidMount = async () => {
    const dates = lastWeeksDates();
    const workouts = await getWorkoutsFromStorage(store, dates);
    this.setState({
      logs_data: getLogsData(workouts, dates)
    });
  };
}

const styles = StyleSheet.create({
  date_container: {
    flex: 2
  },
  date_month: {
    fontSize: 12
  },
  date_day: {
    fontSize: 20,
    fontWeight: "bold"
  },
  exercises: {
    flex: 8
  },
  exercises_text: {
    color: "#696969"
  }
});
