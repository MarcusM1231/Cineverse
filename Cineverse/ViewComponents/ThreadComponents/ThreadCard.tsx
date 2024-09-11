import { StyleSheet, Text, View, TouchableOpacity, Image, TouchableWithoutFeedback, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Comment } from '../../Data/Comment';
import firebase from 'firebase/compat';
import { useUser } from "../../Data/UserContext";
import { Menu, Divider} from 'react-native-paper';

interface ThreadCardProps {
    comment: Comment;
    mediaId: string;
}

interface ProfileInfoProps {
    profileUsername: string;
    userId: string;
}

const ThreadColor = '#008080'
// These will be removed later. just placeholder values
const numberOfReplies = 20;

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profileUsername, userId }) => {
    const [profileImage, setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const userDoc = await firebase.firestore().collection('users').doc(userId).get();
                const userData = userDoc.data();
                if (userData && userData.profileImage) {
                    setProfileImage(userData.profileImage);
                } else {
                    setProfileImage(null);
                }
            } catch (error) {
                console.error("Error fetching profile image: ", error);
                setProfileImage(null);
            }
        };

        fetchProfileImage();
    }, [userId]);

    return (
        <View style={styles.profileContainer}>
            {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImageFound} />
            ) : (
                <Ionicons name='person' size={20} style={styles.profileImage} color={'white'} />
            )}
            <Text style={styles.profileUsername}>{profileUsername}</Text>
        </View>
    );
};

// Displays the text of the comment
const CommentText = ({ comment, publicSpoiler, isLoading, userSpoiler, user }: { comment: Comment, publicSpoiler: boolean, isLoading: boolean, userSpoiler: boolean, user: any }) => {
    // Determine if the comment text should be blurred
    const showBlur = ((publicSpoiler || userSpoiler) && user?.uid !== comment.userId) || isLoading;;

    return (
        <View style={styles.commentContainer}>
            <Text numberOfLines={3} ellipsizeMode="tail" style={[styles.commentText, showBlur && styles.commentTextBlur]}>
                {comment.commentText}
            </Text>
        </View>
    );
};

// Displays the View Replies text
const ViewReplies = () => {
    return(
        <View style={styles.repliesContainer}>
            <TouchableOpacity>
                <Text style={styles.repliesText}>Show {numberOfReplies} Replies...</Text>
            </TouchableOpacity>   
        </View>
    )
}

const CommentVotes = ({userLiked, userDisliked, mediaId, comment, user, setUserLiked, setUserDisliked }: {userLiked: boolean, userDisliked: boolean, mediaId: string, comment: any, user: any, setUserLiked: any, setUserDisliked: any }) =>{
    const [likes, setLikes] = useState(comment.likes);
    const [dislikes, setDisLikes] = useState(comment.dislikes);
    const [buttonDisabled, setButtonDisabled] = useState(false);


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
        const mediaRef = firebase.firestore()
            .collection('media')
            .doc(mediaId)
            .collection('comments')
            .doc(comment.id);
    
        await mediaRef.update({
            likes: firebase.firestore.FieldValue.increment(likeChange),
            dislikes: firebase.firestore.FieldValue.increment(dislikeChange)
        });

    };
    
    // value: true = liked | false = disliked
    const votePressed = async (value: boolean) => {
        setButtonDisabled(true);
        try {
            // Fetch the latest comment data from Firestore
            const mediaRef = firebase.firestore()
                .collection('media')
                .doc(mediaId)
                .collection('comments')
                .doc(comment.id);
    
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
    
    return(
        <View style={styles.votesContainer}>
            <View style={styles.votesContent}>
                <TouchableOpacity onPress={() => {votePressed(true)}} disabled={buttonDisabled}>
                    <Ionicons name='chevron-up-circle' style={[styles.votesIcon, { color: userLiked ? ThreadColor : "white", }]}/>
                </TouchableOpacity>
                <Text style={styles.votesNumber}>{likes}</Text>
            </View>

            <View style={styles.votesContent}>
                <TouchableOpacity onPress={() => {votePressed(false)}} disabled={buttonDisabled}>
                    <Ionicons name='chevron-down-circle' style={[styles.votesIcon, { color: userDisliked ? 'red' : "white", }]} />
                </TouchableOpacity>
                <Text style={styles.votesNumber}>{dislikes}</Text>
            </View>
        </View>
    )
}

//Displays ellipsis button which will display more options such as block, hide, etc
const EllipsisButton = ({ comment, spoilerVisible, setSpoilerVisible, mediaId, userSpoiler, setUserSpoiler, user }: 
    { comment: Comment, spoilerVisible: boolean, setSpoilerVisible: React.Dispatch<React.SetStateAction<boolean>>, mediaId: string, userSpoiler: boolean, setUserSpoiler: React.Dispatch<React.SetStateAction<boolean>>, user: any }) => {
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

    const deleteComment = async() => {
        closeMenu()
        if(user.uid === comment.userId){
            try {
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
        
                console.log("Comment deleted successfully");
            } catch (error) {
                console.error("Error deleting comment: ", error);
            }
        }else {
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
            >
                {comment.publicSpoiler && user?.uid !== comment.userId && (
                    <>
                        <Menu.Item 
                            style={styles.menuOption} 
                            onPress={() => {
                                if(spoilerVisible === false){
                                    showSpoilerConfirmation();
                                }else {
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
                                        <Menu.Item onPress={() => markSpoilerForMe(true)} title="Mark Spoiler For Me" />
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

//Displays thread card with the profile picture, comments, and thread upvotes
export default function ThreadCard({ comment, mediaId }: ThreadCardProps) {
    const [spoilerVisible, setSpoilerVisible] = useState(!comment.publicSpoiler);
    const [userSpoiler, setUserSpoiler] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userLiked, setUserLiked] = useState(false);
    const [userDisliked, setUserDisliked] = useState(false);
    const user = useUser()

    // Fetch user-specific spoiler data when the component mounts
    useEffect(() => {
        const fetchUserSpoiler = async () => {
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
                            setUserLiked(userCommentData.commentLiked)
                            setUserDisliked(userCommentData.commentDisliked)
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching user spoiler data: ", error);
            }finally {
                setIsLoading(false);
            }
        };

        fetchUserSpoiler();
    }, [mediaId, comment.id]);

    return (
        <View style={styles.container}> 
            <View style={styles.content}>
                <ProfileInfo profileUsername={comment.username} userId={comment.userId} />
                <EllipsisButton 
                    comment={comment} 
                    spoilerVisible={spoilerVisible} 
                    setSpoilerVisible={setSpoilerVisible} 
                    mediaId={mediaId} 
                    userSpoiler={userSpoiler} 
                    setUserSpoiler={setUserSpoiler}
                    user={user}
                />
            </View>
            <View>
                <CommentText 
                    comment={comment} 
                    publicSpoiler={comment.publicSpoiler && !spoilerVisible} 
                    isLoading={isLoading}
                    userSpoiler={userSpoiler}
                    user={user}
                />
            </View>
            <View style={styles.commentFooter}>
                <CommentVotes
                    userLiked={userLiked}
                    user={user}
                    comment={comment}
                    mediaId={mediaId} 
                    userDisliked={userDisliked}
                    setUserLiked={setUserLiked}
                    setUserDisliked={setUserDisliked}
                />
                <ViewReplies />
            </View>    
        </View>
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
        marginLeft: 5
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
    },
    profileImage: {
        borderRadius: 10,
        backgroundColor: ThreadColor,
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
        margin: 10,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15
    },
    commentContainer: {
        marginLeft: 10,
        marginTop: 10,
        flex: 1
    },
    commentText: {
        color: 'white'
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