import { StyleSheet } from "react-native";

//Contains stylsheets for Login and Register Page
const BackgroundColor = '#121212'
const AccentColor = '#008080'
const FontColor = 'white'

export default  StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center', 
        backgroundColor: BackgroundColor
    },
    logo: {
        color: FontColor,
        fontSize: 30,
        marginBottom: 20
    },
    input: {
        height: 48,
        width: "80%",
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    button: {
        backgroundColor: AccentColor,
        width: "80%",
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: FontColor,
        fontSize: 16,
        fontWeight: "bold"
    },
    footerView: {
        alignItems: "center",
        marginTop: 20
    },
    footerText: {
        fontSize: 16,
        color: FontColor
    },
    footerLink: {
        color: AccentColor,
        fontWeight: "bold",
        fontSize: 16
    }
})