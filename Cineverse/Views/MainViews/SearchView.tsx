import { StyleSheet, Text, View } from 'react-native';

/*
This is the search view, the view where you can search
for individual media without having to browse through the different
catergories.

*/

export default function SearchView() {
    return (
      <View style={styles.container}>
        <Text style={{color: 'white'}}>Search View</Text>
    </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });