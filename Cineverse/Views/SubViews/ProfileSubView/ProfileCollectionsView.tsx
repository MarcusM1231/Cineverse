import { StyleSheet, Text, View } from 'react-native';


export default function ProfileCollectionsView() {
    return (
      <View style={styles.container}>
        <Text style={styles.content}>Collections</Text>
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