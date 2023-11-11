import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function ViewMoreCard() {

    return (
    <TouchableOpacity style={styles.mediaContainer}>
        <Text>View More</Text>
        <Ionicons name="add" style={styles.iconStyle} />
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
    },
    iconStyle: {
        fontSize: 20
    }
})