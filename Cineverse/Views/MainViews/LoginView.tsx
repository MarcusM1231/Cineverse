import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from 'react-native'
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import firebase from '../../firebase/firebaseConfig';

//This is the login view where the user enters their info to log in 
export default function LoginView() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const onFooterLinkPress = () => {
        navigation.navigate('RegisterView')
    }
    const loginUser = async (email: any, password: any) => {
        try{
            await firebase.auth().signInWithEmailAndPassword(email, password)

        }catch(e: any){
            Alert.alert("Error", e.message)
        }
    }

    return (
        <View style={styles.container}>
            
            <Text style={styles.logo}> Logo Here </Text>

            <TextInput style={styles.input} 
                value={email} 
                autoComplete='off' 
                autoCorrect={false} 
                onChangeText={(text) => setEmail(text)}  
                placeholder='Email'
            />

            <TextInput style={styles.input} 
                value={password} 
                autoComplete='off' 
                autoCorrect={false}  
                secureTextEntry 
                onChangeText={(text) => setPassword(text)}  
                placeholder='Password'
            />
          
            <TouchableOpacity style={styles.button} onPress={() => loginUser(email, password)}>
                <Text style={styles.buttonTitle}>Log in</Text>
            </TouchableOpacity>

            <View style={styles.footerView}>
                <Text style={styles.footerText}>Don't have an account? <Text style={styles.footerLink} onPress={onFooterLinkPress}>Sign up</Text></Text>
            </View>
        </View>
      );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center', 
        backgroundColor: '#121212'
    },
    logo: {
        color: "white",
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
        backgroundColor: '#008080',
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
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
    },
    footerView: {
        alignItems: "center",
        marginTop: 20
    },
    footerText: {
        fontSize: 16,
        color: 'white'
    },
    footerLink: {
        color: "#008080",
        fontWeight: "bold",
        fontSize: 16
    }
   
})