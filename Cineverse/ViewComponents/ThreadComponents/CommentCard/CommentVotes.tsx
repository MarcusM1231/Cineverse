// components/CommentVotes.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../../../firebase/firebaseConfig';

const CommentVotes = ({ userLiked, userDisliked, mediaId, comment, user, setUserLiked, setUserDisliked }) => {
    const [likes, setLikes] = useState(comment.likes);
    const [dislikes, setDisLikes] = useState(comment.dislikes);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        const unsubscribe = firebase
            .firestore()
            .collection('media')
            .doc(mediaId)
            .collection('comments')
            .doc(comment.id)
            .onSnapshot((doc) => {
                const commentData = doc.data();
                if (commentData) {
                    setLikes(commentData.likes);
                    setDisLikes(commentData.dislikes);
                }
            });

        return () => unsubscribe();
    }, [mediaId, comment.id]);

    const handleVote = async (isLike: boolean) => {
        if (buttonDisabled) return;
        setButtonDisabled(true);

        try {
            const voteChange = isLike ? 1 : -1;
            await firebase
                .firestore()
                .collection('media')
                .doc(mediaId)
                .collection('comments')
                .doc(comment.id)
                .update({
                    likes: firebase.firestore.FieldValue.increment(isLike ? 1 : 0),
                    dislikes: firebase.firestore.FieldValue.increment(isLike ? 0 : 1),
                });

            setLikes((prevLikes: any) => prevLikes + (isLike ? 1 : 0));
            setDisLikes((prevDislikes: any) => prevDislikes + (isLike ? 0 : 1));
        } catch (error) {
            console.error("Error updating votes: ", error);
        } finally {
            setButtonDisabled(false);
        }
    };

    return (
        <View style={styles.votesContainer}>
            <TouchableOpacity onPress={() => handleVote(true)} disabled={buttonDisabled}>
                <Ionicons name='chevron-up-circle' color={userLiked ? 'green' : 'white'} />
                <Text>{likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleVote(false)} disabled={buttonDisabled}>
                <Ionicons name='chevron-down-circle' color={userDisliked ? 'red' : 'white'} />
                <Text>{dislikes}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CommentVotes;


const styles = StyleSheet.create({
    votesContainer: {
        flexDirection: 'row',
    },
    votesContent: {
        flexDirection: 'row',
        textAlign: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    commentFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        justifyContent: 'space-between'
    },
    votesIcon: {
        fontSize: 30,
        color: ThreadColor,
    },
    votesNumber: {
        color: 'white',
        fontSize: 15,
    },
    ellipsisIcon: {
        fontSize: 20,
        color: 'white'
    },
    profileContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10
    },
});


