import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        alignItems: 'flex-start', 
      },
  
      buttonTextStyle: {
        textAlign: 'center',
        color: 'white'
      },
      buttonCategory: {
        marginHorizontal: 15,
        marginTop: 20,
        marginBottom: 15,
        width: 100,
        height: 25,
        textAlign: 'center',
        justifyContent: 'center',
        color: 'white',
        borderRadius: 15,
        overflow: 'hidden',
      },
      buttonsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
      }
})