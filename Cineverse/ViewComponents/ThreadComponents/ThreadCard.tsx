import { StyleSheet, Text, View, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Comment } from '../../Data/Comment';
import firebase from 'firebase/compat';
import { useUser } from "../../Data/UserContext";
import { Menu, Divider} from 'react-native-paper';

interface ThreadCardProps {
comment: Comment;
blur: boolean;
}

interface ProfileInfoProps {
    profileUsername: string;
    userId: string;
}

const ThreadColor = '#008080'
//These will be removed later. just placeholder values
var upvoteAlready = false
var downvoteAlready = false
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

//Displays the text of the comment
const CommentText = ({ comment, blur }: { comment: Comment, blur: boolean }) => {
    const user = useUser();
    const showBlur = blur && user?.uid !== comment.userId
    return(
        <View style={styles.commentContainer}>
            <Text numberOfLines={3} ellipsizeMode="tail" style={[styles.commentText, showBlur  && styles.commentTextBlur]}>
                {comment.commentText}
            </Text>
        </View>
    )
}

//Displays the View Replies text
const ViewReplies = () => {
    return(
        <View style={styles.repliesContainer}>
            <TouchableOpacity>
                <Text style={styles.repliesText}>Show {numberOfReplies} Replies...</Text>
            </TouchableOpacity>   
        </View>
    )
}

//Displays Upvote and downvote of the comments
const CommentVotes = ({ likes, dislikes }: { likes: number, dislikes: number }) =>{
    const upvoteButtonPress = () =>{
        console.log("Upvote Pressed")
    };

    const downvoteButtonPress = () =>{
        console.log("Downvote Pressed")
    };

    return(
        <View style={styles.votesContainer}>
            <View style={styles.votesContent}>
                <TouchableOpacity onPress={upvoteButtonPress}>
                    <Ionicons name='chevron-up-circle' style={[styles.votesIcon, { color: upvoteAlready ? ThreadColor : "white", }]}/>
                </TouchableOpacity>
                <Text style={styles.votesNumber}>{likes}</Text>
            </View>

            <View style={styles.votesContent}>
                <TouchableOpacity onPress={downvoteButtonPress}>
                    <Ionicons name='chevron-down-circle' style={[styles.votesIcon, { color: downvoteAlready ? 'red' : "white", }]} />
                </TouchableOpacity>
                <Text style={styles.votesNumber}>{dislikes}</Text>
            </View>
        </View>
    )
}

//Displays ellipsis button which will display more options such as block, hide, etc
const EllipsisButton = ({ comment }: { comment: Comment }) =>{

    const [menuVisible, setMenuVisible] = useState(false);
    const [spoilerVisible, setSpoilerVisible] = useState(false);
    const [spoilerText, setSpoilerText] = useState('Show Spoiler');
    const user = useUser();

    const closeMenu = () => { setMenuVisible(false); };
    const openMenu = () => { setMenuVisible(true); };
    
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

    const reportButtonPressed = () => {
        closeMenu();
        console.log("Reported Comment");
    }

    const flagButtonPressed = () => {
        closeMenu();
        console.log("Flagged Comment");
    }

    const deleteButtonPressed = () => {
        closeMenu();
        console.log("Deleted Comment");
    }

    const markSpoilerForMe = () => {
        closeMenu();
        console.log("Hide Comment for Me");
    }

    return(
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
                {comment.markedSpoiler && user?.uid !== comment.userId && (
                    <>
                        <Menu.Item style={styles.menuOption} onPress={showAndHideSpoilerPressed} title={spoilerText}/>
                        <Divider />
                    </>
                )}
                {user?.uid !== comment.userId && (
                    <>
                        {!comment.markedSpoiler && (
                            <>
                                <Menu.Item onPress={markSpoilerForMe} title="Mark Spoiler For Me" />
                                <Divider />
                            </>
                        )}
                        <Menu.Item onPress={flagButtonPressed} title="Flag" />
                        <Divider />
                        <Menu.Item onPress={reportButtonPressed} title="Report" />
                    </>
                )}
                {user?.uid === comment.userId && (
                    <>
                        <Menu.Item onPress={deleteButtonPressed} title="Delete" />
                    </>
                )}
            </Menu>
        </View>  
    )
}

//Displays thread card with the profile picture, comments, and thread upvotes
export default function ThreadCard({comment, blur}: ThreadCardProps) {    
    return (
        <View style={styles.container}> 
            <View style={styles.content}>
                <ProfileInfo profileUsername={comment.username} userId={comment.userId} />
                <EllipsisButton comment={comment} />
            </View>
            <View>
                <CommentText comment={comment} blur={blur} />
            </View>
            <View style={styles.commentFooter}>
                <CommentVotes likes={comment.likes} dislikes={comment.dislikes} />
                <ViewReplies />
            </View>    
        </View>
    );
  }

  const styles = StyleSheet.create({
    container: { 
        padding: 10,
        backgroundColor: '#333333',
        width: 390,
        margin: 10,
        flexDirection: 'column',
        borderRadius: 10
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