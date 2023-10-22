import { StyleSheet, Text, View } from 'react-native';

/*
This is the search view, the view where you can search
for individual media without having to browse through the different
catergories.

*/

export default function SearchView() {
    return (
      <View style={styles.container}>
        <Text>Search View</Text>
    </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });