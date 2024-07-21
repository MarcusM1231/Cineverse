import { StyleSheet, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'firebase/compat/storage'
import firebase from 'firebase/compat';
import axios from 'axios';


export default function ProfileImage() {
    const [profileImage, setProfileImage] = useState('');
    const [loading, setLoading] = useState(false);

    const user = firebase.auth().currentUser;
    const USERID = user ? user.uid : "";
    const storageKey = `@profileImage-${USERID}`;

    

    useEffect(() => {   
        // loadImageFromFirebase(); 
        const loadImageFromStorage = async () => {
            if (USERID) {
                try {
                    const cachedImageUri = await AsyncStorage.getItem(storageKey);

                    if (cachedImageUri) {
                        console.log("Loading from cache: ", cachedImageUri);
                        
                        //Find a beter way for this since it throws error if it cant find the link
                        if ((await axios.head(cachedImageUri)).status === 200) {
                            setProfileImage(cachedImageUri);
                        }
                        
                    } else {
                        await loadImageFromFirebase();
                    }
                } catch (error) {
                    console.log('Error loading image', error);
                    loadImageFromFirebase();
                }
            }
        };

        loadImageFromStorage();

    }, [USERID]);

    const loadImageFromFirebase = async () => {
        console.log("Loading profile image from database")
        try {
            if (USERID) {
                const userDoc = await firebase.firestore().collection('users').doc(USERID).get();
                if (userDoc.exists) {
                    const imageUrl = userDoc.data()?.profileImage;
                    if (imageUrl) {
                        setProfileImage(imageUrl);
                        await saveImageToStorage(imageUrl);
                    } else {
                        console.log("No Image to load from database");
                        setProfileImage('')
                    }
                }
            }
        } catch (error) {
            console.log('Error loading image from Firebase:', error);
        }
    };

    const saveImageToStorage = async (imageUri: any) => {
        try {
            await AsyncStorage.setItem(storageKey, imageUri);
        } catch (error) {
            console.log('Error saving image to AsyncStorage:', error);
        }
    };

    const removeProfileImage = async () => {
        setLoading(true);
        setProfileImage('');
        try {
            if (USERID) {
                const userDoc = await firebase.firestore().collection('users').doc(USERID).get();
                if (userDoc.exists && userDoc.data()?.profileImage) {
                    const imageUrl = userDoc.data()?.profileImage;
    
                    // Delete image from Firebase Storage
                    const imageRef = firebase.storage().refFromURL(imageUrl);
                    await imageRef.delete();
    
                    // Remove image URL from Firestore
                    await firebase.firestore().collection('users').doc(USERID).update({
                        profileImage: firebase.firestore.FieldValue.delete(),
                    });
    
                    await AsyncStorage.removeItem(storageKey);
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
            const imageRef = firebase.storage().ref().child(`profileImages/${USERID}`);
            await imageRef.put(blob);
    
            // Get the download URL
            const downloadURL = await imageRef.getDownloadURL();
    
            // Save the download URL to Firestore
            await firebase.firestore().collection('users').doc(USERID).set(
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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            await uploadImageToFirebase(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.profileImageContainer}>
            {loading && <ActivityIndicator size="small" color="white" style={styles.test} />}
    
            <View style={styles.imageWrapper}>
                {profileImage ? (
                    <View style={styles.profileImageContainer}>
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        <View style={styles.removeButtonContainer}>
                            <TouchableOpacity style={styles.removeButton} onPress={removeProfileImage}>
                                <Ionicons name='close-circle' size={20} color='#008080' />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity onPress={pickImage} disabled={loading}>
                        <Ionicons name='person' style={styles.profileImage} color={'white'} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 10,
        position: 'relative'

    },
    profileImage: { 
        backgroundColor: '#333333',
        fontSize: 42,
        borderRadius: 20,
        padding: 30,
        overflow: 'hidden',
        textAlign: 'center',
        width: 100,
        height: 100,
        
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
    test: {
        padding: 10
    }
  });