import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '@firebase/firebaseConfig'
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
import { User } from './User';

interface UserContextType {
    user: User | null;
    getUserDataById: (userId: string) => Promise<User | null>;
    updatePrivacySetting: (userId: string, isPrivate: boolean) => Promise<void>;
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
                const userData = await getUserDataById(currentUser.uid, true); // Only cache logged-in user data
                if (userData) {
                    setUser(userData);
                }
            } else {
                console.log('No user is currently signed in.');
            }
        });

        return () => unsubscribe();
    }, []);

    // Function to fetch user data by userId (with optional caching for logged-in user)
    const getUserDataById = async (userId: string, cacheData = false): Promise<User | null> => {
        try {
            let username = '';
            let email = '';
            let imageUrl: string | undefined = undefined;
            let followers = 0;
            let following = 0;
            let accountPrivacy = false;

            // Fetch user data from Firebase Firestore
            const userDataFromFirebase = await fetchUserDataFromFirebase(userId);
            if (userDataFromFirebase) {
                username = userDataFromFirebase.username;
                email = userDataFromFirebase.email;
                imageUrl = userDataFromFirebase.imageUrl; // Directly from Firestore
                followers = userDataFromFirebase.followers;
                following = userDataFromFirebase.following;
                accountPrivacy = userDataFromFirebase.accountPrivacy;
            }

            if (cacheData) {
                // For logged-in user, use cached data first
                const usernameKey = `username-${userId}`;
                const emailKey = `email-${userId}`;
                const imageKey = `profileImage-${userId}`;

                const cachedUsername = await AsyncStorage.getItem(usernameKey);
                const cachedEmail = await AsyncStorage.getItem(emailKey);
                const cachedImageUri = await AsyncStorage.getItem(imageKey);

                username = cachedUsername || username;
                email = cachedEmail || email;
                imageUrl = cachedImageUri || imageUrl;

                // Cache static data if not already cached
                if (!cachedUsername || !cachedEmail || !cachedImageUri) {
                    if (userDataFromFirebase) {
                        await AsyncStorage.setItem(usernameKey, username);
                        await AsyncStorage.setItem(emailKey, email);
                        await AsyncStorage.setItem(imageKey, imageUrl || '');
                    }
                }
            }

            return { uid: userId, username, email, imageUrl, followers, following, accountPrivacy };
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    const fetchUserDataFromFirebase = async (userId: string): Promise<User | null> => {
        try {
            // Fetch user data from Firestore
            const userDoc = await firebase.firestore().collection('users').doc(userId).get();
            const userData = userDoc.data();

            if (userData) {
                // Return user data including the imageUrl from Firestore
                return {
                    uid: userId,
                    username: userData.username || '',
                    email: userData.email || '',
                    imageUrl: userData.imageUrl || '', // Retrieve directly from Firestore
                    followers: userData.followers || 0,
                    following: userData.following || 0,
                    accountPrivacy: userData.accountPrivacy || false
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching data from Firebase:', error);
            return null;
        }
    };

    const updatePrivacySetting = async (userId: string, isPrivate: boolean): Promise<void> => {
        try {
            await firebase.firestore().collection('users').doc(userId).update({
                accountPrivacy: isPrivate
            });
            // Optionally, update local state
            setUser(prev => prev ? { ...prev, accountPrivacy: isPrivate } : null);
        } catch (error) {
            console.error('Error updating privacy setting:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, getUserDataById, updatePrivacySetting }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook to access the user context
export const useUser = (): { user: User | null; getUserDataById: (userId: string, cacheData?: boolean) => Promise<User | null>; updatePrivacySetting: any } => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return { user: context.user, getUserDataById: context.getUserDataById, updatePrivacySetting: context.updatePrivacySetting };
};
