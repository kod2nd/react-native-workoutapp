import React from "react";
import {
  View,
  Text,
  TextInput,
  Picker,
  StyleSheet,
  Button,
  Alert
} from "react-native";
import { withNavigation } from "react-navigation";
import store from "react-native-simple-store";
import routines_data from "../data/routines";
import IconButton from "../components/IconButton";
import { renderPickerItems, uniqid } from "../lib/general";

class CreateExercise extends React.Component {
  state = {
    name: "", // the name of the exercise
    routine: this.props.navigation.state.params.key, // the muscle group being targetted by the exercise. It defaults to the routine that was selected from the exercises page earlier
    sets: "", // the default number of sets for each exercise
    exercises: [] // the array of exercises
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
      ),
      headerStyle: {
        backgroundColor: "#333"
      },
      headerTitleStyle: {
        color: "#FFF"
      }
    };
  };

  saveExercise = () => {

    let id = uniqid(); // generate a unique id
    let new_exercise = {
      'id': id,
      'name': this.state.name,
      'routine': this.state.routine,
      'sets': this.state.sets
    };

    store.push('exercises', new_exercise);

    Alert.alert(
      'Saved',
      'The exercise was successfully saved!',
    );

    const exercises = [...this.state.exercises, new_exercise]

    this.setState({
      name: '',
      sets: '3',
      exercises: exercises
    });

    // next: add code for updating the state with the new exercises
    this.props.navigation.state.params.updateExercises(exercises)
  }

  render() {
    return (
      <View style={styles.form_container}>
        <View style={styles.form_group}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.text_input}
            returnKeyType="done"
            placeholder="Front Squat"
            onChangeText={name => {
              this.setState({ name });
            }}
            value={this.state.name}
          />
        </View>

        <View style={styles.form_group}>
          <Text style={styles.label}>Muscle</Text>
          <Picker
            style={styles.picker}
            itemStyle={styles.picker_items}
            mode="dropdown"
            onValueChange={(itemValue, itemIndex) => {
              this.setState({ routine: itemValue });
            }}
            selectedValue={this.state.routine}
          >
            {renderPickerItems(routines_data)}
          </Picker>
        </View>

        <View style={styles.form_group}>
          <Text style={styles.label}>Sets</Text>
          <TextInput
            style={styles.text_input}
            returnKeyType="done"
            keyboardType="numeric"
            placeholder="20"
            onChangeText={sets => {
              this.setState({ sets: sets });
            }}
            value={this.state.sets}
          />
        </View>

        <View style={styles.button_container}>
        <Button
          style={styles.button}
          color="purple"
          title="Back to Exercises"
          onPress={() => this.props.navigation.navigate("Exercises")}
        />
          <Button
            style={styles.button}
            title="Save"
            onPress={this.saveExercise}
          />
        </View>
      </View>
    );
  }

  componentDidMount = async () => {
    const response = await store.get("exercises");
    if (response) {
      this.setState({
        exercises: response
      });
    }
  };
}

export default withNavigation(CreateExercise);

const styles = StyleSheet.create({
  form_container: {
    padding: 20
  },
  form_group: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  label: {
    marginTop: 20
  },
  text_input: {
    width: 200,
    height: 40,
    borderColor: "#bfbfbf",
    borderWidth: 1,
    padding: 10
  },
  picker: {
    width: 150
  },
  picker_items: {
    fontSize: 15
  },
  button_container: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between"
  },
});
