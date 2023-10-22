import { StyleSheet, Text, View } from 'react-native';

/*
This is the Profile view, the view with all the profile
functionality
*/

export default function ProfileView() {
    return (
      <View style={styles.container}>
        <Text>Profile View</Text>
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