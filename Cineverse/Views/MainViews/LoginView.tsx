import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from 'react-native'
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import firebase from '../../firebase/firebaseConfig';
import styles from '../../css/LoggedOutStylesheet'

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
                textContentType='emailAddress'
            />

            <TextInput style={styles.input} 
                value={password} 
                autoComplete='off' 
                autoCorrect={false}  
                secureTextEntry 
                onChangeText={(text) => setPassword(text)}  
                placeholder='Password'
                textContentType='password'
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