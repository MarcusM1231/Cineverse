import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import styles from '../../css/LoggedOutStylesheet';
import firebase from '../../firebase/firebaseConfig';

export default function RegisterView() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [touchedFields, setTouchedFields] = useState({
        email: false,
        username: false,
        password: false,
        confirmPassword: false
    });

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    useEffect(() => {
        validateForm();
    }, [email, username, password, confirmPassword]);

    const validateForm = () => {
        let isValid = true;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Please enter a valid email.');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!username) {
            setUsernameError('Please enter a username.');
            isValid = false;
        } else {
            setUsernameError('');
        }

        if (!password || password.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match.');
            isValid = false;
        } else {
            setConfirmPasswordError('');
        }

        setIsFormValid(isValid);
    };

    const handleInputChange = (field: string, value: string) => {
        switch (field) {
            case 'email':
                setEmail(value);
                break;
            case 'username':
                setUsername(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
            default:
                break;
        }
    };

    const handleBlur = (field: string) => {
        setTouchedFields({
            ...touchedFields,
            [field]: true
        });
        validateForm();
    };

    const createProfile = async (response: any) => {
        const { uid } = response.user;

        const initialData = {
            username: username,
            followers: 0,
            following: 0,
            flags: 0
        };

        await firebase.database().ref(`/users/${uid}`).set({ initialData });

        if (response.user) {
            Alert.alert('Account Created!');
        }
    };

    const getErrorMessage = (errorCode: string) => {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'The email address is already in use by another account.';
            case 'auth/invalid-email':
                return 'The email address is not valid.';
            case 'auth/operation-not-allowed':
                return 'Email/password accounts are not enabled.';
            case 'auth/weak-password':
                return 'The password is too weak.';
            default:
                return 'An unknown error occurred. Please try again.';
        }
    };

    const registerAndGoToMainFlow = async () => {
        if (isFormValid) {
            setLoading(true);
            try {
                const response = await firebase.auth().createUserWithEmailAndPassword(
                    email,
                    password
                );

                if (response.user) {
                    await createProfile(response);
                }
            } catch (e: any) {
                const errorMessage = getErrorMessage(e.code);
                Alert.alert("Error", errorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    const onFooterLinkPress = () => {
        navigation.navigate('LoginView');
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#008080" />
                    </View>
                ) : (
                    <>
                        <Text style={styles.logo}>Create Account</Text>

                        <TextInput
                            style={[styles.input, emailError && touchedFields.email ? { borderColor: 'red' } : {}]}
                            value={email}
                            onChangeText={(text) => handleInputChange('email', text)}
                            onBlur={() => handleBlur('email')}
                            autoComplete='off'
                            placeholder='Email'
                            textContentType='emailAddress'
                        />
                        {emailError && touchedFields.email ? <Text style={styles.errorText}>{emailError}</Text> : null}

                        <TextInput
                            style={[styles.input, usernameError && touchedFields.username ? { borderColor: 'red' } : {}]}
                            value={username}
                            onChangeText={(text) => handleInputChange('username', text)}
                            onBlur={() => handleBlur('username')}
                            autoComplete='off'
                            placeholder='Username'
                            textContentType='username'
                        />
                        {usernameError && touchedFields.username ? <Text style={styles.errorText}>{usernameError}</Text> : null}

                        <TextInput
                            style={[styles.input, passwordError && touchedFields.password ? { borderColor: 'red' } : {}]}
                            value={password}
                            secureTextEntry
                            onChangeText={(text) => handleInputChange('password', text)}
                            onBlur={() => handleBlur('password')}
                            autoComplete='off'
                            placeholder='Password'
                            textContentType='newPassword'
                        />
                        {passwordError && touchedFields.password ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                        <TextInput
                            style={[styles.input, confirmPasswordError && touchedFields.confirmPassword ? { borderColor: 'red' } : {}]}
                            value={confirmPassword}
                            secureTextEntry
                            onChangeText={(text) => handleInputChange('confirmPassword', text)}
                            onBlur={() => handleBlur('confirmPassword')}
                            autoComplete='off'
                            placeholder='Confirm Password'
                        />
                        {confirmPasswordError && touchedFields.confirmPassword ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

                        <TouchableOpacity
                            style={[styles.button, !isFormValid ? { backgroundColor: '#333333' } : {}]}
                            onPress={registerAndGoToMainFlow}
                            disabled={!isFormValid}
                        >
                            <Text style={styles.buttonTitle}>Create Account</Text>
                        </TouchableOpacity>

                        <View style={styles.footerView}>
                            <Text style={styles.footerText}>Already have an account? <Text style={styles.footerLink} onPress={onFooterLinkPress}>Log in</Text></Text>
                        </View>
                    </>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}
