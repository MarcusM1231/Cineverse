import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function MediaCard() {

    return (
    <TouchableOpacity style={styles.mediaContainer}>
        <Image style={styles.imageStyle} source={require("../../Images/Placeholders/black-panther-poster.jpg")} />
    </TouchableOpacity>

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