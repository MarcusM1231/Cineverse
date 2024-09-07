import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import firebase from 'firebase/compat';

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
        const fetchMediaData = async () => {
            try {
                const mediaSnapshot = await firebase.firestore().collection('media').get();
                const mediaData: Media[] = mediaSnapshot.docs.map(doc => ({
                    
                    ...doc.data() as Media
                }));
                setMedia(mediaData);

                console.log("Fetching media called")
            } catch (error) {
                console.error('Error fetching media data:', error);
            }
        };

        fetchMediaData();
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
