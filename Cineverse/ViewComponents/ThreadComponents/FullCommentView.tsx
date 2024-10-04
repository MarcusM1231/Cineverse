import { StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, FlatList, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Comment } from '../../Data/Comment';
import { useRoute } from '@react-navigation/native';
import CommentCard from './CommentCard';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Checkbox from 'expo-checkbox';
import firebase from 'firebase/compat';
import { useUser } from '../../Data/UserContext';

const BackgroundColor = '#121212'
const PrimaryColor = '#013b3b'
const SecondaryColor = '#333333'

const ReplyContainerView = ({ orginalComment, mediaId }: { orginalComment: Comment, mediaId: string }) => {
    const [commentText, setCommentText] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const textInputRef = useRef<any>()
    const userContext = useUser();

    // Snap points based on focus state
    const snapPoints = useMemo(() => {
        return ['5%', '20%', '50%', '90%'];
    }, []);

    const handleInputFocus = () => {
        bottomSheetRef.current?.snapToIndex(3);
    };

    const handleInputBlur = () => {
        if (commentText.length === 0) {
            bottomSheetRef.current?.snapToIndex(1);

            textInputRef.current.blur();

        }
    };

    const handleSubmitComment = async () => {
        const user = userContext.user;
        if (!user || !user.uid || !user.username) {
            console.error('User is not logged in or missing information');
            return;
        }

        try {
            const replyData = {
                commentText: commentText,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                publicSpoiler: isChecked,
                dislikes: 0,
                likes: 0,
                userId: userContext.user?.uid,
                username: userContext.user?.username,
                flags: 0,
                orginalCommentId: orginalComment.id,
                episodeId: orginalComment.episodeId,
                type: 1
            };

            const userSpecificData = {
                ...replyData,
                userSpoiler: false,
                commentLiked: false,
                commentDisliked: false
            };

            const commentRef = firebase.firestore()
                .collection('media')
                .doc(mediaId)
                .collection('comments')
                .doc(orginalComment.id);

            const replyDocRef = await commentRef.collection('replies').add(replyData);
            const commentId = replyDocRef.id;

            const userCommentRef = firebase.firestore()
                .collection('userComments')
                .doc(mediaId)
                .collection(userContext.user!.uid)
                .doc(commentId);

            await userCommentRef.set(userSpecificData);


            handleTextChange('');
            setIsChecked(false);
            bottomSheetRef.current?.snapToIndex(1);
            textInputRef.current.blur();
        } catch (error) {
            console.error("Error posting reply:", error);
        }
    };

    const handleTextChange = (text: string) => {
        setCommentText(text);

        // Count words how many words -- might change the number
        const wordCount = text.trim().split(/\s+/).filter(word => word).length;
        setIsButtonDisabled(wordCount < 1);
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            backgroundStyle={{ backgroundColor: '#1a1919' }}
            handleIndicatorStyle={{ backgroundColor: PrimaryColor, }}

        >
            <View style={styles.textInputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Type your reply..."
                    placeholderTextColor={'white'}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onChangeText={handleTextChange}
                    value={commentText}
                    multiline
                    ref={textInputRef}
                />
                <View style={styles.markSpoilerContainer}>
                    <Text style={styles.markSpoilerText}>Mark Spoiler?</Text>
                    <Checkbox
                        value={isChecked}
                        onValueChange={setIsChecked}
                        style={styles.markSpoilerCheckbox}
                        color={PrimaryColor}
                    />
                </View>
                <TouchableOpacity style={styles.postCommentButton} disabled={isButtonDisabled} onPress={handleSubmitComment}>
                    <View style={isButtonDisabled ? styles.disabledTextContainer : styles.textContainer}>
                        <Text style={styles.text}>Post Comment</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </BottomSheet>
    );
}

export default function FullCommentView() {
    const route = useRoute();
    const [replies, setReplies] = useState<any[]>([]);
    const { mediaId, orginalComment } = route.params as { mediaId: string, orginalComment: Comment }

    useEffect(() => {
        const commentRef = firebase
            .firestore()
            .collection('media')
            .doc(mediaId)
            .collection('comments')
            .doc(orginalComment.id)
            .collection('replies')
            .orderBy('timestamp', 'asc');

        // Use onSnapshot to listen for real-time updates
        const unsubscribe = commentRef.onSnapshot((snapshot) => {
            const repliesData = snapshot.docs.map(doc => ({
                id: doc.id,

                ...doc.data(),
            }));

            setReplies(repliesData);
        }, (error) => {
            console.error("Error fetching replies: ", error);
        });

        return () => unsubscribe();
    }, [orginalComment.id, mediaId]);

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: BackgroundColor }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <CommentCard mediaId={mediaId} comment={orginalComment} replyComment={true} />
                    <View style={styles.horizontalLine}></View>
                    <FlatList
                        data={replies}
                        renderItem={({ item }) => <CommentCard key={item.id} mediaId={mediaId} comment={item} replyComment={true} />}
                        keyExtractor={(item) => item.id}

                        contentContainerStyle={{ paddingBottom: 150 }}
                    />
                    <ReplyContainerView orginalComment={orginalComment} mediaId={mediaId} />
                </View>
            </TouchableWithoutFeedback>

        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BackgroundColor,
    },

    postCommentButton: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        padding: 20
    },
    text: {
        color: 'white',
        fontSize: 15,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 20,
        backgroundColor: PrimaryColor,
    },
    disabledTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 20,
        backgroundColor: SecondaryColor,
    },
    horizontalLine: {
        borderBottomColor: PrimaryColor,
        borderBottomWidth: 1,
        marginVertical: 15,
        marginHorizontal: -10,
    },
    replyContainer: {
        flex: 1,
    },
    textInput: {
        borderStyle: 'solid',
        borderColor: SecondaryColor,
        borderWidth: 1,
        width: '98%',
        height: 200,
        padding: 10,
        color: 'white',
        borderRadius: 20

    },
    textInputContainer: {
        alignItems: 'center',
    },
    markSpoilerContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    markSpoilerText: {
        color: 'white',
        fontSize: 15
    },
    markSpoilerCheckbox: {
        marginLeft: 10,
    },
    submitButtonDisabled: {
        backgroundColor: SecondaryColor,
    }
});