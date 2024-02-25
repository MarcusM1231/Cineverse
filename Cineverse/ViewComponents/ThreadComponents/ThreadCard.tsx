import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Comment } from '../../Data/Comment';
import firebase from 'firebase/compat';

interface ThreadCardProps {
comment: Comment;
}

//Variables
const ThreadColor = '#008080'
//These will be removed later. just placeholder values
var upvoteAlready = false
var downvoteAlready = false
const numberOfReplies = 20

//Displays the prfoile picture and username of the user who commented 
const ProfileInfo = ({ profileUsername }: { profileUsername: string }) => {
    const [userCommented, setUserCommented] = useState('')

    //Fetches username from firebase
    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const userDataSnapshot = await firebase.database().ref(`/users/${profileUsername}`).once('value');
            const userData = userDataSnapshot.val();
            if (userData) {
                setUserCommented(userData.initialData.username);
            }
        } catch (error: any) {
            console.error('Error fetching user data:', error.message);
        }
        };

        fetchUserData();
    }, []);
    
    return(
        <View style={styles.profileContainer}>
            <Ionicons name='person' style={styles.profileImage} color={'white'} />
            <Text style={styles.profileUsername}>{userCommented}</Text>
        </View>
    )
}

//Displays the text of the comment
const CommentText = ({ commentText }: { commentText: string }) => {
    return(
        <View style={styles.commentContainer}>
            <Text numberOfLines={3} ellipsizeMode="tail" style={styles.commentText}>
                {commentText}
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
    const [upvotes, setUpvotes] = useState(likes);
    const [downvotes, setDownvotes] = useState(dislikes);

    //Handles the upvote button
    const upvoteButtonPress = () =>{
        if(downvoteAlready){
            setDownvotes(downvotes - 1);
            // dislikes = dislikes - 1;
            downvoteAlready = false;
        }
        if(!upvoteAlready){
            setUpvotes(upvotes + 1);
            // likes = likes + 1;
            upvoteAlready = true;
        } else {
            setUpvotes(upvotes - 1);
            // likes = likes - 1;
            upvoteAlready = false;
        }
    };

    //Handles the downvote button
    const downvoteButtonPress = () =>{
        if(upvoteAlready){
            setUpvotes(upvotes - 1);
            // likes = likes - 1;
            upvoteAlready = false;
        }
        if(!downvoteAlready){
            setDownvotes(downvotes + 1);
            // dislikes = dislikes + 1;
            downvoteAlready = true;
        } else {
            setDownvotes(downvotes - 1);
            // dislikes = dislikes - 1;
            downvoteAlready = false;
        }
    };

    return(
        <View style={styles.votesContainer}>
            <View style={styles.votesContent}>
                <TouchableOpacity onPress={upvoteButtonPress}>
                    <Ionicons name='chevron-up-circle' style={[styles.votesIcon, { color: upvoteAlready ? ThreadColor : "white", }]}/>
                </TouchableOpacity>
                <Text style={styles.votesNumber}>{upvotes}</Text>
            </View>

            <View style={styles.votesContent}>
                <TouchableOpacity onPress={downvoteButtonPress}>
                    <Ionicons name='chevron-down-circle' style={[styles.votesIcon, { color: downvoteAlready ? 'red' : "white", }]} />
                </TouchableOpacity>
                <Text style={styles.votesNumber}>{downvotes}</Text>
            </View>
        </View>
    )
}

//Displays ellipsis button which will display more options such as block, hide, etc
const EllipsisButton = () => {
    return(
        <TouchableOpacity>
            <Ionicons name='ellipsis-horizontal' style={styles.ellipsisIcon} />
        </TouchableOpacity>
    )
}

//Displays thread card with the profile picture, comments, and thread upvotes
export default function ThreadCard({comment}: ThreadCardProps) {
    return (
        <View style={styles.container}>
            
            <View style={styles.content}>
                <ProfileInfo profileUsername={comment.userId} />
                <EllipsisButton />
            </View>
            <View>
                <CommentText commentText= {comment.commentText} />
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
        width: 35,
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
    }
  });