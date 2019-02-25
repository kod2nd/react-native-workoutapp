import React from "react";
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";
import { MaterialIcons } from "@expo/vector-icons";

import RoutinesPage from "./app/screens/Routines";
import LogsPage from "./app/screens/Logs";
import ProgressPage from "./app/screens/Progress";

import ExercisesPage from "./app/screens/Exercises";
import CreateExercisePage from "./app/screens/CreateExercise";
import LogWorkoutPage from "./app/screens/LogWorkout";

import globalNavOptions from "./app/lib/globalNavOptions"



const icons = {
  Logs: "event-note",
  Routines: "edit",
  Progress: "camera-alt"
};

const LogStack = createStackNavigator(
  {
    Logs: {
      screen: LogsPage
    },
    LogWorkout: {
      screen: LogWorkoutPage
    }
  },
  {
    initialRouteName: "Logs",
    defaultNavigationOptions: globalNavOptions
  }
);

const RoutinesStack = createStackNavigator(
  {
    Routines: {
      screen: RoutinesPage
    },
    Exercises: {
      screen: ExercisesPage
    },
    CreateExercise: {
      screen: CreateExercisePage
    }
  },
  {
    initialRouteName: "Routines",
    defaultNavigationOptions: globalNavOptions
  }
);

const ProgressStack = createStackNavigator(
  {
    Progress: {
      screen: ProgressPage
    }
  },
  {
    initialRouteName: "Progress",
    defaultNavigationOptions: globalNavOptions
  }
);

const tabNavigator = createBottomTabNavigator(
  {
    Logs: {
      screen: LogStack
    },
    Routines: {
      screen: RoutinesStack
    },
    Progress: {
      screen: ProgressStack
    }
  },
  {
    initialRouteName: "Routines",
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName = icons[routeName];
        let color = focused ? "#fff" : "#929292";

        return <MaterialIcons name={iconName} size={35} color={color} />;
      }
    }),
    animationEnabled: true,
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      style: {
        backgroundColor: "#333"
      }
    }
  }
);

export default createAppContainer(tabNavigator);
