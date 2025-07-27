import { StyleSheet, Text, View, TouchableOpacity, Image, TouchableWithoutFeedback, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Comment } from '@data/Comment';
import firebase from '@firebase/firebaseConfig';
import { Menu, Divider } from 'react-native-paper';
import React from 'react';


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


export default EllipsisButton;

const styles = StyleSheet.create({
    ellipsisIcon: {
        fontSize: 20,
        color: 'white'
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
