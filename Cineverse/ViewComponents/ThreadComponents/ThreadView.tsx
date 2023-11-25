import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';


//Variables
const ThreadColor = '#008080'

//Displays thread bubble which takes you to corresponding thread
export default function ThreadView({ episodeNumber }: { episodeNumber: number }) {
    return (
      <View style={styles.container}>
        <TouchableOpacity>
            <Text style={styles.thread}>{episodeNumber}</Text>
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
    thread: {
        textAlign: 'center',
        width:80,
        height: 40,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: ThreadColor,
        textAlignVertical: 'center',
        lineHeight: 40,
        color: 'white'
    }
  });