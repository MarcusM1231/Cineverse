import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, View, ScrollView, Text, TouchableOpacity, ActivityIndicator, Modal,
  TextInput, TouchableWithoutFeedback, Keyboard, FlatList, Alert
} from 'react-native';
import firebase from '../../firebase/firebaseConfig';
import { useRoute } from '@react-navigation/native';
import { Media } from '../../Data/MediaContext';
import { Ionicons } from '@expo/vector-icons';
import CommentCard from './CommentCard/CommentCard';
import Checkbox from 'expo-checkbox';
import { useUser } from "../../Data/UserContext"
import ThreadBubble from './ThreadBubble';
import { useNavigation } from '@react-navigation/native';


const PrimaryColor = '#013b3b'
const SecondaryColor = '#333333'
const BackgroundColor = '#121212'

// View displayed When no comments are present
const NoCommentsView = ({ onCreateComment }: { onCreateComment: () => void }) => {
  return (
    <View style={styles.noCommentsContainer}>
      <Text style={styles.noCommentsText}>Add the first comment to start the discussion!</Text>
      <TouchableOpacity style={styles.createCommentButton} onPress={onCreateComment}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Post Comment</Text>
          <Ionicons name='add' color={'white'} size={20} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const PostCommentButton = ({ onCreateComment, mediaData }: { onCreateComment: () => void, mediaData: Media }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.createCommentButton} onPress={onCreateComment}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Post Comment</Text>
          <Ionicons name='add' color={'white'} size={20} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const ThreadViewFooter = React.memo(({ mediaData, currentEpisode }: { mediaData: Media, currentEpisode: number }) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const startEpisode = Math.max(1, currentEpisode - 2);
  const endEpisode = mediaData.numberOfEpisodes;

  const episodes = Array.from({ length: endEpisode - startEpisode + 1 }, (_, index) => startEpisode + index);

  useEffect(() => {
    if (scrollViewRef.current) {
      const episodeWidth = 100;
      const offset = episodeWidth * (episodes.indexOf(currentEpisode) - 2);
      scrollViewRef.current.scrollTo({ x: offset, animated: false });
    }
  }, [currentEpisode, episodes]);

  return (
    <View style={styles.footer}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.footer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {episodes.map(episodeNumber => (
          <ThreadBubble
            key={episodeNumber}
            episodeNumber={episodeNumber}
            mediaData={mediaData}
            threadBubbleColor={episodeNumber === currentEpisode ? SecondaryColor : PrimaryColor}
            buttonDisabled={episodeNumber === currentEpisode}
          />
        ))}
      </ScrollView>
    </View>
  );
});

export default function ThreadView() {
  const navigation = useNavigation();
  const route = useRoute();
  const { mediaData, episodeNumber } = route.params as { mediaData: Media, episodeNumber: number };

  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const user = useUser();

  useEffect(() => {
    if (mediaData.title) {
      navigation.setOptions({ title: mediaData.title });
    }
  
    if (mediaData.id) {
      const commentsRef = firebase.firestore()
        .collection('media')
        .doc(mediaData.id)
        .collection('comments')
        .where('episodeId', '==', episodeNumber)
        .orderBy('timestamp')
        .limit(20);
  
      const unsubscribe = commentsRef.onSnapshot(async (snapshot) => {
        const userCommentRefs = snapshot.docs.map(doc =>
          firebase.firestore()
            .collection('userComments')
            .doc(user.user?.uid)
            .collection(mediaData.id)
            .doc(doc.id)
        );
  
        const userCommentSnapshots = await Promise.all(userCommentRefs.map(ref => ref.get()));
  
        const commentsData = snapshot.docs.map((doc, index) => ({
          id: doc.id,
          ...doc.data(),
          userSpoiler: userCommentSnapshots[index]?.exists ? userCommentSnapshots[index].data()!.userSpoiler : false,
        }));
  
        setComments(commentsData);
        setLoading(false);
      });
  
      return () => unsubscribe();
    }
  }, [mediaData.id, episodeNumber, user.user?.uid]);
  
  const handleSubmitComment = async () => {
    if (isSubmitDisabled) return;
  
    //setSubmitting(true);
  
    const commentData = {
      commentText,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      publicSpoiler: isChecked,
      dislikes: 0,
      likes: 0,
      userId: user.user?.uid,
      username: user.user?.username,
      flags: 0,
      episodeId: episodeNumber,
      type: 0,
    };
  
    const userSpecificData = {
      ...commentData,
      userSpoiler: false,
      commentLiked: false,
      commentDisliked: false,
    };
  
    try {
      const commentId = firebase.firestore().collection('media').doc(mediaData.id).collection('comments').doc().id;
  
      const batch = firebase.firestore().batch();
  
      const mediaCommentRef = firebase.firestore()
        .collection('media')
        .doc(mediaData.id)
        .collection('comments')
        .doc(commentId);
  
      const userCommentRef = firebase.firestore()
        .collection('userComments')
        .doc(mediaData.id)
        .collection(user.user!.uid)
        .doc(commentId);
  
      batch.set(mediaCommentRef, { ...commentData, id: commentId });
      batch.set(userCommentRef, userSpecificData);
  
      await batch.commit();
  
      setModalVisible(false);
      setCommentText('');
      setIsChecked(false);
    } catch (error) {
      console.error('Error submitting comment: ', error);
      Alert.alert('Submission failed', 'Please try again.');
    } 
  };

  // useEffect(() => {
  //   if (mediaData.title) {
  //     navigation.setOptions({ title: mediaData.title });
  //   }

  //   const fetchComments = () => {
  //     const commentsRef = firebase.firestore()
  //       .collection('media')
  //       .doc(mediaData.id)
  //       .collection('comments')
  //       .where('episodeId', '==', episodeNumber)
  //       .orderBy('timestamp')
  //       .limit(20);

  //     // Use onSnapshot to listen for real-time updates
  //     const unsubscribe = commentsRef.onSnapshot(async (snapshot) => {
  //       const userCommentRefs = snapshot.docs.map(doc =>
  //         firebase.firestore()
  //           .collection('userComments')
  //           .doc(user.user?.uid)
  //           .collection(mediaData.id)
  //           .doc(doc.id)
  //       );

  //       const userCommentSnapshots = await Promise.all(userCommentRefs.map(ref => ref.get()));

  //       const commentsData = snapshot.docs.map((doc, index) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //         userSpoiler: userCommentSnapshots[index].exists ? userCommentSnapshots[index].data()!.userSpoiler : false,
  //       }));

  //       setComments(commentsData);
  //       setLoading(false);
  //     });

  //     return () => unsubscribe();
  //   };

  //   if (mediaData.id) {
  //     fetchComments();
  //   }
  // }, [mediaData.id, episodeNumber, user.user?.uid]);

  // const handleCreateComment = () => {
  //   setModalVisible(true);
  // };

  // const handleSubmitComment = async () => {
  //   if (isSubmitDisabled) return;

  //   const commentData = {
  //     commentText: commentText,
  //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  //     publicSpoiler: isChecked,
  //     dislikes: 0,
  //     likes: 0,
  //     userId: user.user?.uid,
  //     username: user.user?.username,
  //     flags: 0,
  //     episodeId: episodeNumber,
  //     type: 0
  //   };

  //   const userSpecificData = {
  //     ...commentData,
  //     userSpoiler: false,
  //     commentLiked: false,
  //     commentDisliked: false
  //   };

  //   try {
  //     // Generate a unique comment ID
  //     const commentId = firebase.firestore().collection('media').doc(mediaData.id).collection('comments').doc().id;

  //     // Start a batch to write both to media comments and userComments
  //     const batch = firebase.firestore().batch();

  //     // Reference to the media comments collection
  //     const mediaCommentRef = firebase.firestore()
  //       .collection('media')
  //       .doc(mediaData.id)
  //       .collection('comments')
  //       .doc(commentId);

  //     // Reference to the userComments collection
  //     const userCommentRef = firebase.firestore()
  //       .collection('userComments')
  //       .doc(mediaData.id)
  //       .collection(user.user!.uid)
  //       .doc(commentId);

  //     // Add to media comments
  //     batch.set(mediaCommentRef, { ...commentData, id: commentId });

  //     // Add to userComments
  //     batch.set(userCommentRef, userSpecificData);

  //     await batch.commit();

  //     setModalVisible(false);
  //     setCommentText('');
  //     setIsChecked(false);

  //     // Fetch updated comments after submission
  //     // const commentsRef = firebase.firestore()
  //     //   .collection('media')
  //     //   .doc(mediaData.id)
  //     //   .collection('comments')
  //     //   .where('episodeId', '==', episodeNumber)
  //     //   .orderBy('timestamp');

  //     // const snapshot = await commentsRef.get();
  //     // const commentsData: any[] = [];

  //     // snapshot.forEach((doc) => {
  //     //   commentsData.push({ id: doc.id, ...doc.data() });
  //     // });
  //     // setComments(commentsData);

  //   } catch (error) {
  //     console.error('Error submitting comment: ', error);
  //   }
  // };

  const handleCloseModal = () => {
    setCommentText('');
    setModalVisible(false);
  };

  const handleCreateComment = () => {
    setModalVisible(true);
  };

  const handleTextChange = (text: string) => {
    setCommentText(text);

    // Count words how many words -- might change the number
    const wordCount = text.trim().split(/\s+/).filter(word => word).length;
    setIsSubmitDisabled(wordCount < 1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PrimaryColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {comments.length > 0 && (
        <PostCommentButton onCreateComment={handleCreateComment} mediaData={mediaData} />
      )}
      <View style={styles.scrollContainer}>
        {comments.length === 0 ? (
          <NoCommentsView onCreateComment={handleCreateComment} />
        ) : (
          <FlatList
            data={comments}
            renderItem={({ item }) => <CommentCard key={item.id} mediaId={mediaData.id} comment={item} replyComment={false} />}
            keyExtractor={(item) => item.id}
          />
        )}
        <ThreadViewFooter mediaData={mediaData} currentEpisode={episodeNumber} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Comment</Text>
                <TouchableOpacity onPress={handleCloseModal} style={styles.closeModalButton}>
                  <Ionicons name="close" size={24} color="#ad1c05" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Write your comment..."
                placeholderTextColor="#888"
                value={commentText}
                onChangeText={handleTextChange}
                multiline={true}
                scrollEnabled={true}
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
              <TouchableOpacity
                style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
                onPress={handleSubmitComment}
                disabled={isSubmitDisabled}
              >
                <Text style={styles.submitButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor,
    justifyContent: 'center'
  },
  noCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCommentsText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  createCommentButton: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BackgroundColor,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  scrollContainer: {
    flex: 1,

  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 30,
  },
  textInput: {
    backgroundColor: SecondaryColor,
    color: 'white',
    padding: 10,
    height: 100,
    borderRadius: 5,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: PrimaryColor,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: SecondaryColor,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
  markSpoilerContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  markSpoilerText: {
    color: 'white',
    fontSize: 15
  },
  markSpoilerCheckbox: {
    marginLeft: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  closeModalButton: {
    marginBottom: 30,
  },
  footer: {
    flexDirection: 'row'
  }
});
