import React, { useState } from 'react'
import {Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from 'react-native'
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import styles from '../../css/LoggedOutStylesheet'
import firebase from '../../firebase/firebaseConfig'

//This is the view where users register and create their account 
export default function RegisterView() {
    const [email, setEmail] = useState('')
    // const [firstName, setFirstname] = useState('')
    // const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    //Adds account to the database
    const createProfile = async (response: any) => {
        const { uid } = response.user;

        const initialData = {
            username: username,
            followers: 0,
            following: 0,
            flags: 0
        }

        await firebase.database().ref(`/users/${uid}`).set({initialData});

        if(response.user){
            Alert.alert('Account Created!')
        }
    }

    //Registers account
    const registerAndGoToMainFlow = async () => {
        if(email && password && password === confirmPassword){
            try {
                const response = await firebase.auth().createUserWithEmailAndPassword(
                    email,
                    password
                )

                if(response.user){
                    await createProfile(response);                    
                }
            }catch(e: any) {
                Alert.alert("Try again", e.message)
            }
        }
    }
    
    //Navigates you back to the login page
    const onFooterLinkPress = () => {
        navigation.navigate('LoginView')
    }

    return (
        <View style={styles.container}>
            
            <Text style={styles.logo}>Create Account</Text>

            <TextInput style={styles.input} value={email} onChangeText={(text) => setEmail(text)} autoComplete='off'  placeholder='Email'/>
            {/* <TextInput style={styles.input} value={firstName} onChangeText={(text) => setFirstname(text)}  placeholder='First Name'/>
            <TextInput style={styles.input} value={lastName} onChangeText={(text) => setLastName(text)}  placeholder='Last Name'/> */}
            <TextInput style={styles.input} value={username} onChangeText={(text) => setUsername(text)} autoComplete='off'  placeholder='Username'/>
            <TextInput style={styles.input} value={password} secureTextEntry  onChangeText={(text) => setPassword(text)} autoComplete='off' placeholder='Password'/>
            <TextInput style={styles.input} value={confirmPassword} secureTextEntry onChangeText={(text) => setConfirmPassword(text)} autoComplete='off'  placeholder='Confrim Password'/>
          
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonTitle} onPress={registerAndGoToMainFlow}>Create Account</Text>
            </TouchableOpacity>

            <View style={styles.footerView}>
                <Text style={styles.footerText}>Already got an account? <Text style={styles.footerLink} onPress={onFooterLinkPress}>Log in</Text></Text>
            </View>
        </View>
      );
    }