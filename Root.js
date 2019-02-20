import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { MaterialIcons } from '@expo/vector-icons'; 

import ExercisesPage from './app/screens/Exercises';
import CreateExercisePage from './app/screens/CreateExercise';
import LogWorkoutPage from './app/screens/LogWorkout';
import RoutinesPage from './app/screens/Routines';
import LogsPage from './app/screens/Logs';
import ProgressPage from './app/screens/Progress';


export default TabNavigator(
    {
      Logs: {
        screen: LogsPage
      },
      Routines: {
        screen: RoutinesPage
      },
      Progress: {
        screen: ProgressPage
      }
    }
  );