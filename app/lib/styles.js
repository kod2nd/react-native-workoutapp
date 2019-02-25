import { StyleSheet } from 'react-native';

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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3'
  },
  list_item_content: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

export default styles;