import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import firebase from 'firebase/compat';
import { useUser } from './UserContext';

interface UserComment {
    commentId: string;
    commentText: string;
    timestamp: firebase.firestore.Timestamp;
    isMarkedSpoiler: boolean;
    userSpoiler: boolean;
    dislikes: number;
    likes: number;
    episodeId: string;
}

interface UserCommentsContextType {
    userComments: UserComment[] | null;
    fetchUserComments: () => Promise<void>;
}

const UserCommentsContext = createContext<UserCommentsContextType | undefined>(undefined);

interface UserCommentsProviderProps {
    children: ReactNode;
}

export const UserCommentsProvider: React.FC<UserCommentsProviderProps> = ({ children }) => {
    const [userComments, setUserComments] = useState<UserComment[] | null>(null);
    const user = useUser()
    const fetchUserComments = async () => {
        // Assuming you have a way to get the current user's ID
        const userId = user?.uid;
        if (userId) {
            try {
                const userCommentsRef = firebase.firestore()
                    .collection('userComments')
                    .doc(userId)
                    .collection('comments');
                    
                const snapshot = await userCommentsRef.get();
                const comments: UserComment[] = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    if (isUserComment(data)) {
                        comments.push({  ...data });
                    } else {
                        console.error('Invalid comment data:', data);
                    }
                });
                setUserComments(comments);
            } catch (error) {
                console.error('Error fetching user comments: ', error);
            }
        }
    };

    function isUserComment(data: any): data is UserComment {
        return typeof data.commentText === 'string' &&
            data.timestamp instanceof firebase.firestore.Timestamp &&
            typeof data.isMarkedSpoiler === 'boolean' &&
            typeof data.userSpoiler === 'boolean' &&
            typeof data.dislikes === 'number' &&
            typeof data.likes === 'number' &&
            typeof data.episodeId === 'string';
    }

    return (
        <UserCommentsContext.Provider value={{ userComments, fetchUserComments }}>
            {children}
        </UserCommentsContext.Provider>
    );
};

export const useUserComments = (): UserCommentsContextType => {
    const context = useContext(UserCommentsContext);
    if (context === undefined) {
        throw new Error('useUserComments must be used within a UserCommentsProvider');
    }
    return context;
};
