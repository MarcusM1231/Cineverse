import { Text, View, TouchableOpacity, StyleSheet, Image} from "react-native";
import { useRoute } from '@react-navigation/native';
import { MediaData } from "../../Data/MediaData";

export default function CardDetail() {
    const route = useRoute();
    const {mediaData} = route.params as {mediaData: MediaData}
    if(!mediaData){
        return <Text>Data not available</Text>
    }
    return (
        <View style={styles.container}>
            <Text>{mediaData.title}</Text>
            <Text></Text>
        </View>
    )
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
        
    }
})