import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Media } from '@data/MediaContext';

type ThreadBubbleProps = {
  episodeNumber: number;
  mediaData: Media;
  threadBubbleColor: string;
  buttonDisabled: boolean
}

const ThreadColor = '#008080';
const FontColor = "#D3D3D3"

// Displays thread bubble which takes you to corresponding thread
export default function ThreadBubble({ episodeNumber, mediaData, threadBubbleColor, buttonDisabled }: ThreadBubbleProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const onThreadBubbleClick = () => {
    navigation.navigate('ThreadView', { mediaData, episodeNumber });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onThreadBubbleClick} disabled={buttonDisabled}>
        <Text style={[styles.thread, { backgroundColor: threadBubbleColor }]}>{episodeNumber}</Text>
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
    width: 80,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: ThreadColor,
    textAlignVertical: 'center',
    lineHeight: 40,
    color: FontColor
  }
});