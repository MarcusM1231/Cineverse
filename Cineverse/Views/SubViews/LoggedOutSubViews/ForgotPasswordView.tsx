import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import firebase from '@firebase/firebaseConfig';
import styles from '@css/LoggedOutStylesheet';

export default function PasswordResetView() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const onPasswordReset = async () => {
    if (!email) {
      Alert.alert("Enter Email", "Please enter your email address to reset your password.");
      return;
    }

    try {
      await firebase.auth().sendPasswordResetEmail(email);
      Alert.alert("Password Reset", "A password reset link has been sent to your email.");
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isButtonDisabled = !isValidEmail(email);

  const onGoBackPressed = () => {
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.logo}>Password Reset</Text>

        <TextInput
          style={styles.input}
          value={email}
          autoComplete='off'
          autoCorrect={false}
          onChangeText={(text) => setEmail(text)}
          placeholder='Enter your email'
          textContentType='emailAddress'
          keyboardType='email-address'
          returnKeyType='done'
        />

        <TouchableOpacity 
          style={[styles.button, isButtonDisabled ? { backgroundColor: '#333333' } : {}]}
          onPress={onPasswordReset}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonTitle}>Reset Password</Text>
        </TouchableOpacity>

        <Text style={styles.backButtonText} onPress={onGoBackPressed}>Back to Login</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
