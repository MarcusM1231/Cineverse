import { StyleSheet, Text, View } from 'react-native';


export default function ProfileCommentsView() {
    return (
      <View style={styles.container}>
        <Text style={styles.content}>Comments</Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      padding: 10,
      alignItems: 'center',
    },
    content: {
      color: 'white'
    }
  });