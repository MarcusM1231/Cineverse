import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import firebase from '../../firebase/firebaseConfig';
import styles from '../../css/LoggedOutStylesheet';

export default function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onFooterLinkPress = () => {
    navigation.navigate('RegisterView');
  };

  const onForgotPasswordLinkPress = () =>{
    navigation.navigate('ForgotPasswordView');
  }

  const loginUser = async (email: string, password: string) => {
    setLoading(true);
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#008080" />
        </View>
      ) : (
        <>
          <Text style={styles.logo}>Logo Here</Text>

          <TextInput
            style={styles.input}
            value={email}
            autoComplete='off'
            autoCorrect={false}
            onChangeText={(text) => setEmail(text)}
            placeholder='Email'
            textContentType='emailAddress'
          />

          <TextInput
            style={styles.input}
            value={password}
            autoComplete='off'
            autoCorrect={false}
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
            placeholder='Password'
            textContentType='password'
          />

          <View style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordLink} onPress={onForgotPasswordLinkPress}>Forgot Password?</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={() => loginUser(email, password)}>
            <Text style={styles.buttonTitle}>Log in</Text>
          </TouchableOpacity>

          <View style={styles.footerView}>
            <Text style={styles.footerText}>Don't have an account? <Text style={styles.footerLink} onPress={onFooterLinkPress}>Sign up</Text></Text>
          </View>
        </>
      )}
    </View>
  );
}
