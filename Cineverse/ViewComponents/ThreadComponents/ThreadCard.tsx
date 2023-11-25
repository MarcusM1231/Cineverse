import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';


//Variables
const ThreadColor = '#008080'

//Displays thread card with the profile picture, comments, and thread upvotes
export default function ThreadCard() {
    return (
      <View style={styles.container}>
        <TouchableOpacity>
            <Text>Thread Card</Text>
        </TouchableOpacity> 
    </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10, 
    },
  });