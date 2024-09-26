import { StyleSheet, View, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat';

const PrimaryColor = '#013b3b'
const SecondaryColor = '#333333'
const ThirdColor = '#008080'

export default function ViewingProfileImage({userData} : {userData : any}) {
    const [profileImage, setProfileImage] = useState(userData.profileImage);

    const USERID = userData.uid;

    useEffect(() => {
        if (userData.profileImage) {
            setProfileImage(userData.profileImage);
        } else {
            loadImageFromFirebase();
            console.log("Loading from firebase")
        }
    }, []);

    const loadImageFromFirebase = async () => {
        if (USERID) {
            try {
                const userDoc = await firebase.firestore().collection('users').doc(USERID).get();
                const userData = userDoc.data();
                
                setProfileImage(userData?.profileImage);
            } catch (error) {
                setProfileImage('');
            }
        }
    };
   
    return (
        <View style={styles.profileImageContainer}>
            <View style={styles.imageWrapper}>
                {profileImage ? (
                    <View style={styles.profileImageContainer}>
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    </View>
                ) : (
                    <Ionicons name='person' style={styles.profileImage} color={'white'} />
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
        backgroundColor: SecondaryColor,
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
    loadingIndicator: {
        padding: 10
    }
});
