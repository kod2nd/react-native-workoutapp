import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AlertBox = props => {
    const alertType = props.type
    
  return (
    <View style={styles[alertType]}>
      <Text style={styles.alertText}>{props.text}</Text>
    </View>
  );
};

export default AlertBox;

const styles = StyleSheet.create({
	info: {
    backgroundColor: "#EFEFEF",
    padding: 20
  },
  alertText: {
    fontSize: 30,
    color: "#A9A9A9"
  }
  });