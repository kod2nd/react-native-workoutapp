import React from "react";
import { View, Text, FlatList } from "react-native";
import { withNavigation } from "react-navigation";
import store from "react-native-simple-store";

import IconButton from "../components/IconButton";
import AlertBox from "../components/AlertBox";

import list_styles from "../components/List/styles";
import exercises_data from "../data/exercises";
import { renderItem } from "../lib/general";

class Exercises extends React.Component {
  state = {
    exercises_data: []
  };

  updateExercises = exercises => {
    this.setState({
      exercises_data: exercises
    });
  };

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state; // extract the navigation parameters to the params object
    // return the data needed by navigationOptions
    return {
      headerTitle: "Exercises",
      headerRight: (
        <IconButton
          size={25}
          color="#FFF"
          onPress={() => {
            navigation.navigate("CreateExercise", {
              key: params.key,
              name: params.name,
              updateExercises: params.updateExercises
            });
          }}
        />
      )
    };
  };

  render() {
    const { params } = this.props.navigation.state;
    let routine = params.key
    console.log("routine:",routine)
    let exercises = this.state.exercises_data.filter(item => {
      return item.routine == routine;
    });

    console.log("filtered exercise:",exercises)
    return (
      <View>
        <Text style={list_styles.list_item_header}>{params.name}</Text>
        <Text style={list_styles.list_item_header}>{params.sets}</Text>
        <FlatList
          data={exercises}
          renderItem={renderItem}
          keyExtractor={(item, index) =>  (item.id)}
        />
        {exercises.length == 0 && (
          <AlertBox
            type="info"
            text="You haven't added any exercises for this routine yet."
          />
        )}
      </View>
    );
  }

  componentDidMount = async () => {
    const response = await store.get("exercises");
    console.log("I am the response", response)
    if (response) {
      this.setState({
        exercises_data: response
      });
    }
    // next: add code for setting additional navigation params
    this.props.navigation.setParams({
      updateExercises: this.updateExercises
    });
  };
}

export default withNavigation(Exercises);
