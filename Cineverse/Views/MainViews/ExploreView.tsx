import { StyleSheet, Text, View } from 'react-native';

/*
This is the explore view, the view shown when you launch the app
This will have the list of movies and the different categorgies to look through
*/

export default function ExploreView() {
    return (
      <View style={styles.container}>
        <Text>Explore View</Text>
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