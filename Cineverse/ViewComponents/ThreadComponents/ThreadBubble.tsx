import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

//Variables
const ThreadColor = '#008080'

//Displays thread bubble which takes you to corresponding thread
export default function ThreadBubble({ episodeNumber }: { episodeNumber: number }) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onThreadBubbleClick = () => {
    navigation.navigate('ThreadView')
  }

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onThreadBubbleClick}>
            <Text style={styles.thread}>{episodeNumber}</Text>
        </TouchableOpacity> 
    </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10 
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