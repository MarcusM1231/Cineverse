import { Text, View, TouchableOpacity, StyleSheet, Image} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {MediaData} from '../../Data/MediaData'

type MediaCardProps = {
    media: MediaData;
}

export default function MediaCard({media}: MediaCardProps) {
const navigation = useNavigation<NativeStackNavigationProp<any>>();

const handleMediaCardPress = () =>{
    navigation.navigate("CardDetail", {mediaData: media})
};
    return (
        <View>
            <TouchableOpacity style={styles.mediaContainer} onPress={handleMediaCardPress}>
                <Text>{media.title}</Text>
            {/* <Image style={styles.imageStyle} 
            source={require("../../Images/Placeholders/black-panther-poster.jpg")} 
            /> */}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create ({
    mediaContainer: {
        width: 100,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 2, 
        borderColor: 'black'
    },
    imageStyle: {
        width: '100%',
        height: '100%'
    }
})