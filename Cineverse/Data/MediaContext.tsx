import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import firebase from '@firebase/firebaseConfig';

export interface Media {
    id: string;
    title: string;
    type: number; // 1 for movie, 0 for TV show
    releaseDate: string;
    rating: number;
    summary: string;
    likes: number;
    dislikes: number;
    image: string;
    numberOfEpisodes: number;
    likedAlready: boolean;
    dislikedAlready: boolean;
}

interface MediaContextType {
    media: Media[] | null;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

interface MediaProviderProps {
    children: ReactNode;
}

export const MediaProvider: React.FC<MediaProviderProps> = ({ children }) => {
    const [media, setMedia] = useState<Media[] | null>(null);

    useEffect(() => {
        // Real-time listener for Firestore collection
        const unsubscribe = firebase.firestore().collection('media').onSnapshot(snapshot => {
            const mediaData: Media[] = snapshot.docs.map(doc => ({
                ...doc.data() as Media,
                id: doc.id // Ensure the ID is included if needed
            }));
            setMedia(mediaData);
            console.log("Media data updated");
        }, error => {
            console.error('Error fetching media data:', error);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    return (
        <MediaContext.Provider value={{ media }}>
            {children}
        </MediaContext.Provider>
    );
};

export const useMedia = (): Media[] | null => {
    const context = useContext(MediaContext);
    if (context === undefined) {
        throw new Error('useMedia must be used within a MediaProvider');
    }
    return context.media;
};