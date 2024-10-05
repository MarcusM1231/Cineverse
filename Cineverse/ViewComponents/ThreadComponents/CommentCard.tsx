import { StyleSheet, Text, View, TouchableOpacity, Image, TouchableWithoutFeedback, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Comment } from '../../Data/Comment';
import firebase from 'firebase/compat';
import { useUser } from "../../Data/UserContext";
import { Menu, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import debounce from 'lodash/debounce';

interface CommentCardProps {
    comment: Comment;
    mediaId: string;
    replyComment: boolean;
}

const PrimaryColor = '#013b3b'
const ThreadColor = '#008080'

const ProfileInfo = ({ comment, userId }: { comment: Comment, userId: string }) => {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const navigation = useNavigation<any>();

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const imageRef = firebase.storage().ref().child(`profileImages/${comment.userId}`);

                const imageUrl = await imageRef.getDownloadURL();

                if (imageUrl) {
                    setProfileImage(imageUrl);
                } else {
                    setProfileImage(null);
                }
            } catch (error: any) {
                // Handle specific error codes
                if (error.code === 'storage/object-not-found') {
                    // Image does not exist
                    setProfileImage(null);
                } else {
                    // Log other errors
                    console.error("Error fetching profile image: ", error);
                    setProfileImage(null);
                }
            }
        };

        fetchProfileImage();
    }, [comment.userId]);

    const navigateToProfile = useCallback(() => {
        navigation.navigate('ViewingProfileView', { userId: comment.userId });
    }, [navigation, comment.userId]);

    return (
        <View style={styles.profileContainer}>
            {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImageFound} />
            ) : (
                <Ionicons name='person' size={20} style={styles.profileImage} color={'white'} />
            )}
            <TouchableOpacity onPress={navigateToProfile}>
                <Text style={styles.profileUsername}>{comment.username}</Text>
            </TouchableOpacity>

            {comment.userId == userId ? (
                <Ionicons name='star-outline' size={15} color={'gold'} />
            ) : null}

        </View>
    );
};

// Displays the text of the comment
const CommentText = ({ comment, publicSpoiler, isLoading, userSpoiler, user }:
    { comment: Comment, publicSpoiler: boolean, isLoading: boolean, userSpoiler: boolean, user: any }) => {

    const replyComment = comment.type === 0;
    // Determine if the comment text should be blurred
    const showBlur = useMemo(() => {
        return ((publicSpoiler || userSpoiler) && user?.uid !== comment.userId) || isLoading;
    }, [publicSpoiler, userSpoiler, user, comment, isLoading]);

    return (
        <View style={styles.commentContainer}>
            <Text numberOfLines={replyComment ? 3 : undefined} ellipsizeMode="tail" style={[styles.commentText, showBlur && styles.commentTextBlur]}>
                {comment.commentText}
            </Text>
        </View>
    );
};

const ViewReplies = ({ replies, mediaId, orginalComment }: { replies: any, mediaId: string, orginalComment: Comment }) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const ShowFullCommentView = () => {
        navigation.navigate('FullCommentView', { mediaId, orginalComment });
    }
    return (
        <View style={styles.repliesContainer}>
            <TouchableOpacity onPress={ShowFullCommentView}>
                <Text style={styles.repliesText}>Show {replies.length} Replies...</Text>
            </TouchableOpacity>
        </View>
    )
}

export const CommentVotes = ({ userLiked, userDisliked, mediaId, comment, user, setUserLiked, setUserDisliked }: { userLiked: boolean, userDisliked: boolean, mediaId: string, comment: any, user: any, setUserLiked: any, setUserDisliked: any }) => {
    const [likes, setLikes] = useState(comment.likes);
    const [dislikes, setDisLikes] = useState(comment.dislikes);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        // Real-time listener for comment updates

        let mediaRef
        if (comment.type === 0) {
            mediaRef = firebase.firestore()
                .collection('media')
                .doc(mediaId)
                .collection('comments')
                .doc(comment.id);
        } else {
            mediaRef = firebase.firestore()
                .collection('media')
                .doc(mediaId)
                .collection('comments')
                .doc(comment.orginalCommentId)
                .collection('replies')
                .doc(comment.id);
        }

        const unsubscribe = mediaRef.onSnapshot(async (doc) => {
            const commentData = doc.data();
            if (commentData) {
                setLikes(commentData.likes);
                setDisLikes(commentData.dislikes);

                // Check if the current user has liked or disliked the comment
                const userCommentRef = firebase.firestore()
                    .collection('userComments')
                    .doc(mediaId)
                    .collection(user!.uid)
                    .doc(comment.id);

                const userCommentDoc = await userCommentRef.get();
                const userCommentData = userCommentDoc.data();

                if (userCommentData) {
                    setUserLiked(userCommentData.commentLiked);
                    setUserDisliked(userCommentData.commentDisliked);
                }
            }
        });

        return () => unsubscribe();
    }, [mediaId, comment.id, user, setUserLiked, setUserDisliked]);

    const updateUserComment = async (liked: boolean, disliked: boolean) => {
        const userCommentRef = firebase.firestore()
            .collection('userComments')
            .doc(mediaId)
            .collection(user!.uid)
            .doc(comment.id);

        await userCommentRef.set({
            commentLiked: liked,
            commentDisliked: disliked
        }, { merge: true });
    };

    const updateMediaComment = async (likeChange: number, dislikeChange: number) => {
        let mediaRef;
        if (comment.type === 0) {
            mediaRef = firebase.firestore()
                .collection('media')
                .doc(mediaId)
                .collection('comments')
                .doc(comment.id);
        } else {
            mediaRef = firebase.firestore()
                .collection('media')
                .doc(mediaId)
                .collection('comments')
                .doc(comment.orginalCommentId)
                .collection('replies')
                .doc(comment.id);
        }

        await mediaRef.update({
            likes: firebase.firestore.FieldValue.increment(likeChange),
            dislikes: firebase.firestore.FieldValue.increment(dislikeChange)
        });
    };

    const votePressed = async (value: boolean) => {
        setButtonDisabled(true);
        try {

            let mediaRef;

            if (comment.type === 0) {
                mediaRef = firebase.firestore()
                    .collection('media')
                    .doc(mediaId)
                    .collection('comments')
                    .doc(comment.id);
            } else {
                mediaRef = firebase.firestore()
                    .collection('media')
                    .doc(mediaId)
                    .collection('comments')
                    .doc(comment.orginalCommentId)
                    .collection('replies')
                    .doc(comment.id);
            }


            const commentSnapshot = await mediaRef.get();
            const commentData = commentSnapshot.data();
            if (!commentData) {
                console.error("Comment data not found");
                return;
            }

            setLikes(commentData.likes);
            setDisLikes(commentData.dislikes);

            if (value) {
                if (userLiked) {
                    // Un-like the comment
                    setUserLiked(false);
                    setLikes((prevLikes: number) => prevLikes - 1);

                    await updateUserComment(false, false);
                    await updateMediaComment(-1, 0);
                } else {
                    // Like the comment
                    setUserLiked(true);
                    setUserDisliked(false);
                    setLikes((prevLikes: number) => prevLikes + 1);
                    if (userDisliked) {
                        setDisLikes((prevDislikes: number) => prevDislikes - 1);
                    }

                    await updateUserComment(true, false);
                    await updateMediaComment(1, userDisliked ? -1 : 0);
                }
            } else {
                if (userDisliked) {
                    // Un-dislike the comment
                    setDisLikes((prevDislikes: number) => prevDislikes - 1);
                    setUserDisliked(false);

                    await updateUserComment(false, false);
                    await updateMediaComment(0, -1);
                } else {
                    // Dislike the comment
                    setUserDisliked(true);
                    setUserLiked(false);
                    setDisLikes((prevDislikes: number) => prevDislikes + 1);
                    if (userLiked) {
                        setLikes((prevLikes: number) => prevLikes - 1);
                    }

                    await updateUserComment(false, true);
                    await updateMediaComment(userLiked ? -1 : 0, 1);
                }
            }
        } catch (error) {
            console.error("Error updating votes: ", error);
        } finally {
            setButtonDisabled(false);
        }
    };

    const debouncedVotePressed = debounce(votePressed, 300);

    return (
        <View style={styles.votesContainer}>
            <View style={styles.votesContent}>
                <TouchableOpacity onPress={() => { debouncedVotePressed(true) }} disabled={buttonDisabled}>
                    <Ionicons
                        name='chevron-up-circle'
                        style={[styles.votesIcon, { color: userLiked ? ThreadColor : "white", }]}
                    />
                </TouchableOpacity>
                <Text style={styles.votesNumber}>{likes}</Text>
            </View>

            <View style={styles.votesContent}>
                <TouchableOpacity onPress={() => { debouncedVotePressed(false) }} disabled={buttonDisabled}>
                    <Ionicons
                        name='chevron-down-circle'
                        style={[styles.votesIcon, { color: userDisliked ? '#ad1c05' : "white", }]}
                    />
                </TouchableOpacity>
                <Text style={styles.votesNumber}>{dislikes}</Text>
            </View>
        </View>
    );
};


//Displays ellipsis button which will display more options such as block, hide, etc
const EllipsisButton = ({ comment, spoilerVisible, setSpoilerVisible, mediaId, userSpoiler, setUserSpoiler, user, replyComment }:
    {
        comment: Comment, spoilerVisible: boolean, setSpoilerVisible: React.Dispatch<React.SetStateAction<boolean>>,
        mediaId: string, userSpoiler: boolean, setUserSpoiler: React.Dispatch<React.SetStateAction<boolean>>, user: any, replyComment: boolean
    }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [spoilerText, setSpoilerText] = useState('Show Spoiler');

    const closeMenu = () => { setMenuVisible(false); };
    const openMenu = () => { setMenuVisible(true); };

    const showSpoilerConfirmation = () => {
        Alert.alert(
            'Show Spoiler',
            'This comment contains potential spoilers. Are you sure you want to view it?',
            [
                {
                    text: 'Yes',
                    onPress: () => showAndHideSpoilerPressed(),
                },
                {
                    text: 'No',
                },
            ],
            { cancelable: false }
        );
    };

    // Hide/Show spoiler that was marked by author
    const showAndHideSpoilerPressed = () => {
        closeMenu();

        if (!spoilerVisible) {
            setSpoilerText('Hide Spoiler');
            setSpoilerVisible(true);
        } else {
            setSpoilerText('Show Spoiler');
            setSpoilerVisible(false);
        }
    };

    // If post isnt marked spoiler by author then there is an option for user to mark it as spoiler for ONLY them
    const markSpoilerForMe = async (value: boolean) => {
        closeMenu();
        try {
            const userCommentRef = firebase.firestore()
                .collection('userComments')
                .doc(mediaId)
                .collection(user!.uid)
                .doc(comment.id);
            await userCommentRef.set({
                userSpoiler: value
            }, { merge: true });

            setUserSpoiler(value);
        } catch (error) {
            console.error("Error marking spoiler: ", error);
        }
    };

    const showDeleteConfirmation = () => {
        Alert.alert(
            'Delete Comment',
            'Are you sure you want to delete your comment?',
            [
                {
                    text: 'Yes',
                    onPress: () => deleteComment(),
                },
                {
                    text: 'No',
                },
            ],
            { cancelable: false }
        );
    };

    const deleteComment = async () => {
        closeMenu()
        if (user.uid === comment.userId) {
            try {

                if (!replyComment) {
                    // Reference to the comment in the media collection
                    const mediaCommentRef = firebase.firestore()
                        .collection('media')
                        .doc(mediaId)
                        .collection('comments')
                        .doc(comment.id);

                    // Reference to the comment in the user's userComments subcollection
                    const userCommentRef = firebase.firestore()
                        .collection('userComments')
                        .doc(mediaId)
                        .collection(user!.uid)
                        .doc(comment.id);

                    // Delete the comment from both collections
                    await mediaCommentRef.delete();
                    await userCommentRef.delete();
                } else {
                    const mediaCommentRef = firebase.firestore()
                        .collection('media')
                        .doc(mediaId)
                        .collection('comments')
                        .doc(comment.orginalCommentId)
                        .collection('replies')
                        .doc(comment.id);

                    await mediaCommentRef.delete();
                }
                console.log("Comment deleted successfully");
            } catch (error) {
                console.error("Error deleting comment: ", error);
            }
        } else {
            console.log("Someone else tried to delete a comment")
        }
    }

    return (
        <View>
            {menuVisible && (
                <TouchableWithoutFeedback onPress={closeMenu}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}
            <Menu
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={
                    <TouchableOpacity onPress={openMenu}>
                        <Ionicons name='ellipsis-horizontal' style={styles.ellipsisIcon} />
                    </TouchableOpacity>
                }
                anchorPosition={'bottom'}
            >
                {comment.publicSpoiler && user?.uid !== comment.userId && (
                    <>
                        <Menu.Item
                            style={styles.menuOption}
                            onPress={() => {
                                if (spoilerVisible === false) {
                                    showSpoilerConfirmation();
                                } else {
                                    showAndHideSpoilerPressed()
                                }
                            }}
                            title={spoilerText} />
                        <Divider />
                    </>
                )}
                {user?.uid !== comment.userId && (
                    <>
                        {!comment.publicSpoiler && (
                            <>
                                {!userSpoiler ? (
                                    <>
                                        <Menu.Item onPress={() => markSpoilerForMe(true)} title='Mark Spoiler For Me' />
                                        <Divider />
                                    </>
                                ) : (
                                    <>
                                        <Menu.Item onPress={() => markSpoilerForMe(false)} title="Unmark Spoiler For Me" />
                                        <Divider />
                                    </>
                                )}
                            </>
                        )}
                        <Menu.Item onPress={() => console.log("Flag")} title="Flag" />
                        <Divider />
                        <Menu.Item onPress={() => console.log("Report")} title="Report" />
                    </>
                )}
                {user?.uid === comment.userId && (
                    <Menu.Item onPress={showDeleteConfirmation} title="Delete" />
                )}
            </Menu>
        </View>
    );
};

export default function CommentCard({ comment, mediaId, replyComment }: CommentCardProps) {
    const [spoilerVisible, setSpoilerVisible] = useState(!comment.publicSpoiler);
    const [userSpoiler, setUserSpoiler] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userLiked, setUserLiked] = useState(false);
    const [userDisliked, setUserDisliked] = useState(false);
    const [replies, setReplies] = useState<any>([])

    const userContext = useUser();

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const ShowFullCommentView = () => {
        const orginalComment = comment
        navigation.navigate('FullCommentView', { mediaId, orginalComment });
    }

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
                        .doc(comment.id);

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

        const repliesRef = firebase
            .firestore()
            .collection('media')
            .doc(mediaId)
            .collection('comments')
            .doc(comment.id)
            .collection('replies')
            .orderBy('timestamp', 'asc');

        const unsubscribe = repliesRef.onSnapshot((snapshot) => {
            const fetchedReplies = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Comment[];

            setReplies(fetchedReplies);
        }, (error) => {
            console.error("Error fetching replies: ", error);
        });

        fetchUserComments();

        return () => unsubscribe();
    }, [mediaId, comment.id]);

    return (
        <TouchableOpacity style={styles.container} onPress={ShowFullCommentView} disabled={replyComment}>
            <View style={styles.content}>
                <ProfileInfo comment={comment} userId={userContext.user!.uid} />
                <EllipsisButton
                    comment={comment}
                    spoilerVisible={spoilerVisible}
                    setSpoilerVisible={setSpoilerVisible}
                    mediaId={mediaId}
                    userSpoiler={userSpoiler}
                    setUserSpoiler={setUserSpoiler}
                    user={userContext.user}
                    replyComment={comment.type === 1}
                />
            </View>
            <View>
                <CommentText
                    comment={comment}
                    publicSpoiler={comment.publicSpoiler && !spoilerVisible}
                    isLoading={isLoading}
                    userSpoiler={userSpoiler}
                    user={userContext.user}
                />
            </View>
            <View style={styles.commentFooter}>
                <CommentVotes
                    userLiked={userLiked}
                    user={userContext.user}
                    comment={comment}
                    mediaId={mediaId}
                    userDisliked={userDisliked}
                    setUserLiked={setUserLiked}
                    setUserDisliked={setUserDisliked}
                />
                {!replyComment && replies.length > 0 ? (
                    <>
                        <ViewReplies mediaId={mediaId} replies={replies} orginalComment={comment} />
                    </>
                ) : null}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#333333',
        width: '97%',
        marginVertical: 10,
        flexDirection: 'column',
        borderRadius: 10,
        alignSelf: 'center',
        zIndex: -1
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    profileImage: {
        borderRadius: 10,
        backgroundColor: PrimaryColor,
        width: 45,
        height: 40,
        padding: 10,
        textAlign: 'center',
        overflow: 'hidden',
    },
    profileImageFound: {
        borderRadius: 10,
        width: 45,
        height: 40,
        padding: 10,
        textAlign: 'center',
        overflow: 'hidden'
    },
    profileUsername: {
        marginLeft: 10,
        marginRight: 5,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        textDecorationLine: 'underline',
        textDecorationColor: 'white'
    },
    commentContainer: {
        marginLeft: 10,
        marginTop: 10,
    },
    commentText: {
        color: 'white',
    },
    repliesContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    repliesText: {
        color: 'grey',
    },
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
    commentTextBlur: {
        color: 'black',
        left: -2000,
        elevation: 2,
        backgroundColor: 'transparent',
        shadowOpacity: 1,
        shadowRadius: 4,
        shadowColor: 'rgba(255,255,255,1)',
        shadowOffset: { width: 2000, height: 0 },
    },
    menuOption: {
        padding: 10,
        borderRadius: 20
    },
    menu: {
        backgroundColor: 'white',
        borderRadius: 20,
        marginTop: 15
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
    },
});