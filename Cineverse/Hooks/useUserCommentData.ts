import { useState, useEffect } from 'react';
import firebase from '../firebase/firebaseConfig';

const useUserCommentData = (mediaId: string, commentId: string) => {
    const [userSpoiler, setUserSpoiler] = useState<boolean>(false);
    const [userLiked, setUserLiked] = useState<boolean>(false);
    const [userDisliked, setUserDisliked] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserComments = async () => {
            try {
                const user = firebase.auth().currentUser;
                if (user?.uid) {
                    const userCommentRef = firebase
                        .firestore()
                        .collection('userComments')
                        .doc(mediaId)
                        .collection(user.uid)
                        .doc(commentId);

                    const userCommentDoc = await userCommentRef.get();
                    if (userCommentDoc.exists) {
                        const userCommentData = userCommentDoc.data();
                        if (userCommentData) {
                            setUserSpoiler(userCommentData.userSpoiler);
                            setUserLiked(userCommentData.commentLiked);
                            setUserDisliked(userCommentData.commentDisliked);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserComments();
    }, [mediaId, commentId]);

    return { userSpoiler, userLiked, userDisliked, isLoading };
};

export default useUserCommentData;
