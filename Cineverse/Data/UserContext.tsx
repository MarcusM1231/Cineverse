import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/compat';

interface User {
    uid: string;
    username: string;
    email: string; 
    imageUrl?: string;
}

interface UserContextType {
    user: User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                const userId = currentUser.uid;
                const usernameKey = `username-${userId}`;
                const imageKey = `profileImage-${userId}`;
                const emailKey = `email-${userId}`;
                // Fetch cached data
                const cachedUsername = await AsyncStorage.getItem(usernameKey);
                const cachedEmail = await AsyncStorage.getItem(emailKey);
                let cachedImageUri = await AsyncStorage.getItem(imageKey);
    
                let username: string = cachedUsername || '';
                let email: string = cachedEmail || currentUser.email || '';
                let imageUrl: string | null = cachedImageUri;
    
                // Fetch username if not cached
                if (!cachedUsername) {
                    //const userDataSnapshot = await firebase.database().ref(`/users/${userId}`).once('value');
                    const userDoc = await firebase.firestore().collection('users').doc(userId).get();
                    //const userData = userDataSnapshot.val();
                    const userData = userDoc.data();
                    // username = userData?.initialData?.username || '';
                    // if (username) {
                    //     await AsyncStorage.setItem(usernameKey, username);
                    // }
                    if (userData) {
                        username = userData.username || '';
                        email = userData.email || currentUser.email || '';
                        imageUrl = userData.profileImage || '';

                        // Cache fetched data
                        if (username) await AsyncStorage.setItem(usernameKey, username);
                        if (email) await AsyncStorage.setItem(emailKey, email);
                        if (imageUrl) await AsyncStorage.setItem(imageKey, imageUrl);
                    }
                }
    
                // Cache email if not already cached
                if (!cachedEmail && currentUser.email) {
                    await AsyncStorage.setItem(emailKey, currentUser.email);
                }
    
                // Validate cached image URL
                if (imageUrl) {
                    try {
                        const response = await fetch(imageUrl, { method: 'HEAD' });
                        if (!response.ok) {
                            throw new Error('Image URL is broken');
                        }
                    } catch {
                        await AsyncStorage.removeItem(imageKey);
                        imageUrl = null;
                    }
                }
    
                // Fetch image URL if not cached
                if (!imageUrl) {
                    const userDoc = await firebase.firestore().collection('users').doc(userId).get();
                    const imageUrlFromFirebase = userDoc.data()?.profileImage;
                    if (imageUrlFromFirebase) {
                        imageUrl = imageUrlFromFirebase;
                        await AsyncStorage.setItem(imageKey, imageUrl || '');
                    }
                }
    
                // Set user with available data, including email
                setUser({ uid: userId, username, email, imageUrl: imageUrl || '' });
            } else {
                console.log('No user is currently signed in.');
            }
        });
    
        return () => unsubscribe();
    }, []);
    

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): User | null => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context.user;
};
