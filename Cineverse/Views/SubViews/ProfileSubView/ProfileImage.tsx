import { StyleSheet, View, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '@firebase/firebaseConfig';


import { useUser } from "../../../Data/UserContext";

const PrimaryColor = '#013b3b'
const SecondaryColor = '#333333'
const ThirdColor = '#008080'

export default function ProfileImage() {
    const [loading, setLoading] = useState(false);
    const user = useUser();
    const [profileImage, setProfileImage] = useState(user.user?.imageUrl || '');

    const userId = user.user?.uid;
    const imageKey = `@profileImage-${userId}`;

    useEffect(() => {
        async function FetchImage() {
            const cachedImageUri = await AsyncStorage.getItem(imageKey);
            console.log("Loading profile image from cache" + cachedImageUri)
        if (cachedImageUri) {
            setProfileImage(cachedImageUri);
        } else {
            // Handle image loading if needed
            if(user.user?.imageUrl){
                loadImageFromFirebase();
                console.log("Loading profile image from firebase")
            }else{
                console.log("No image to load")
            }
            
        }
        }
        FetchImage();
        
    }, []);

    const loadImageFromFirebase = async () => {
        if (userId) {
            try {
                const userDoc = await firebase.firestore().collection('users').doc(userId).get();
                const userData = userDoc.data();
                await saveImageToStorage(userData?.profileImage);
                
                setProfileImage(userData?.profileImage);
            } catch (error) {
                console.log('Error loading image from Firebase Storage:', error);
                setProfileImage('');
            }
        }
    };

    const saveImageToStorage = async (imageUri: string) => {
        try {
            await AsyncStorage.setItem(imageKey, imageUri);
        } catch (error) {
            console.log('Error saving image to AsyncStorage:', error);
        }
    };

    const removeProfileImage = async () => {
        setLoading(true);
        setProfileImage('');
        try {
            if (userId) {
                const userDoc = await firebase.firestore().collection('users').doc(userId).get();
                if (userDoc.exists && userDoc.data()?.profileImage) {
                    const imageUrl = userDoc.data()?.profileImage;

                    // Delete image from Firebase Storage
                    const imageRef = firebase.storage().refFromURL(imageUrl);
                    await imageRef.delete();

                    // Remove image URL from Firestore
                    await firebase.firestore().collection('users').doc(userId).update({
                        profileImage: firebase.firestore.FieldValue.delete(),
                    });

                    // Remove from cache
                    await AsyncStorage.removeItem(imageKey);
                } else {
                    console.log('No image to delete');
                }
            }
        } catch (error) {
            console.log('Error removing image from Firebase:', error);
        } finally {
            setLoading(false);
        }
    };

    const uploadImageToFirebase = async (imageUri: string) => {
        setLoading(true);
        console.log("Trying to upload image to Firebase...");

        // Set the profile image and add to cache first
        setProfileImage(imageUri);
        await saveImageToStorage(imageUri);

        try {
            const response = await fetch(imageUri);
            const blob = await response.blob();

            // Upload image to Firebase Storage
            const imageRef = firebase.storage().ref().child(`profileImages/${userId}`);
            await imageRef.put(blob);

            // Get the download URL
            const downloadURL = await imageRef.getDownloadURL();

            // Save the download URL to Firestore
            await firebase.firestore().collection('users').doc(userId).set(
                { profileImage: downloadURL },
                { merge: true }
            );

            console.log("Uploaded image to Firebase!");
        } catch (error) {
            console.log('Error uploading image to Firebase:', error);
        } finally {
            setLoading(false);
        }
    };

    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need access to your photo library to allow you to choose a profile picture.');
            return false;
        }
        return true;
    };


    const pickImage = async () => {
        const hasPermission = await requestPermission();
        if (!hasPermission) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.2,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            await uploadImageToFirebase(result.assets[0].uri);
        }
    };

    const removeProfileImageConfirmation = () => {
        Alert.alert(
            'Remove Profile Picture',
            'Are you sure you want to remove your current profile picture?',
            [
                {
                    text: 'Yes',
                    onPress: () => removeProfileImage(),
                },
                {
                    text: 'No',
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.profileImageContainer}>
            {loading && <ActivityIndicator size="small" color="white" style={styles.loadingIndicator} />}

            <View style={styles.imageWrapper}>
                {profileImage ? (
                    <View style={styles.profileImageContainer}>
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        <View style={styles.removeButtonContainer}>
                            <TouchableOpacity style={styles.removeButton} onPress={removeProfileImageConfirmation}>
                                <Ionicons name='close-circle' size={20} color={ThirdColor}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.noProfileImageContainer}>
                        <TouchableOpacity onPress={pickImage} disabled={loading}>
                            <Ionicons name='person' style={styles.noProfileImage} color={'white'} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 10,
        position: 'relative',
    },
    profileImage: { 
        fontSize: 42,
        borderRadius: 20,
        textAlign: 'center',
        width: 120,
        height: 120,
    },
    noProfileImageContainer: {
        backgroundColor: PrimaryColor,
        borderRadius: 20,
        width: 120,
        height: 120,
        justifyContent: 'center'
    },
    noProfileImage: {
        textAlign: 'center',
        fontSize: 42,
        borderRadius: 20,
    },
    icon: {
        textAlign: 'center'
    },
    removeButton: {
        width: '100%',
        borderRadius: 20,
        padding: 0,
        zIndex: 10,
        margin: 0,
    },
    imageWrapper: {
        position: 'relative',
    },
    removeButtonContainer: {
        position: 'absolute',
        borderRadius: 20,
        alignItems: 'center',
        margin: 0,
        padding: 0,
        backgroundColor: 'white',
        bottom: -7,
        right: -10
    },
    loadingIndicator: {
        padding: 10
    }
});
