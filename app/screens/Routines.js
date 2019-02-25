import React from "react";
import { FlatList, TouchableHighlight, Text, StyleSheet } from "react-native";
import { withNavigation } from 'react-navigation';
import routines_data from "../data/routines";

// import { renderItem } from "../lib/general";

class Routines extends React.Component {
  static navigationOptions = ({navigation}) => ({
	headerTitle: 'Routines',
  });

  renderItem = ({item}) => {
	const { navigate } = this.props.navigation;
	return (
	  <TouchableHighlight key={item.key} underlayColor="#ccc" onPress={() => {
		navigate('Exercises', {
		  'key': item.key,
		  'name': item.name
		});
	  }} style={styles.list_item}>
		<Text key={item.key}>{item.name}</Text>
	  </TouchableHighlight>
	);
  }

  render() {
    return <FlatList data={routines_data} renderItem={this.renderItem} />;
  }
}

export default withNavigation(Routines)

const styles = StyleSheet.create({
	list: {
	  flex: 1
	},
	list_item_header: {
	  padding: 10,
	  fontWeight: 'bold',
	  fontSize: 17
	},
	list_item: {
	  padding: 20,
	  borderBottomWidth: 1,
	  borderBottomColor: '#f3f3f3'
	}
  });