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
        marginVertical: 20,
        width: 90,
        textAlign: 'center',
        color: 'white',
        padding: 5,
        borderRadius: 15,
        overflow: 'hidden',
      },
      buttonsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
      }
})