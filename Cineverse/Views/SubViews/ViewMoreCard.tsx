import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function ViewMoreCard() {

    return (
    <TouchableOpacity style={styles.mediaContainer}>
        <Text style={styles.textStyle}>View More</Text>
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
        borderColor: '#333333',
        backgroundColor: '#333333'
    },
    textStyle: {
        color: 'white'
    },
    iconStyle: {
        fontSize: 20,
        color: 'white'
    }
})