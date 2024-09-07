import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, ActivityIndicator, Modal, 
  TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import firebase from 'firebase/compat';
import { useRoute } from '@react-navigation/native';
import { Media } from '../../Data/MediaContext';
import { Ionicons } from '@expo/vector-icons';
import ThreadCard from '../../ViewComponents/ThreadComponents/ThreadCard';
import Checkbox from 'expo-checkbox';
import { useUser } from "../../Data/UserContext"

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

const PostCommentButton = ({ onCreateComment }: { onCreateComment: () => void }) => {
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


export default function ThreadView() {
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
    const fetchComments = async () => {
      setLoading(true);
      try {
        const commentsRef = firebase.firestore()
          .collection('media')
          .doc(mediaData.id)
          .collection('comments')
          .where('episodeId', '==', episodeNumber)
          .orderBy('timestamp');

        const snapshot = await commentsRef.get();
        const commentsData: any[] = [];

        snapshot.forEach((doc) => {
          commentsData.push({ id: doc.id, ...doc.data() });
        });
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [mediaData.id]);

  const handleCreateComment = () => {
    setModalVisible(true);
  };

  const handleSubmitComment = async () => {
    if (isSubmitDisabled) return;

    const commentData = {
      commentText: commentText,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      markedSpoiler: isChecked,
      dislikes: 0,
      likes: 0,
      userId: user?.uid,
      username: user?.username,
      flags: 0,
      episodeId: episodeNumber,
    };

    try {
      await firebase.firestore()
        .collection('media')
        .doc(mediaData.id)
        .collection('comments')
        .add(commentData);

      setModalVisible(false);
      setCommentText('');
      setIsChecked(false);

      // Fetch updated comments after submission
      const commentsRef = firebase.firestore()
        .collection('media')
        .doc(mediaData.id)
        .collection('comments')
        .where('episodeId', '==', episodeNumber)
        .orderBy('timestamp');

      const snapshot = await commentsRef.get();
      const commentsData: any[] = [];

      snapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() });
      });
      setComments(commentsData);

    } catch (error) {
      console.error('Error submitting comment: ', error);
    }
  };

  const handleCloseModal = () => {
    setCommentText('');
    setModalVisible(false);
  };

  const handleTextChange = (text: string) => {
    setCommentText(text);

    // Count words, excluding spaces
    const wordCount = text.trim().split(/\s+/).filter(word => word).length;
    setIsSubmitDisabled(wordCount < 4);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {comments.length !== 0 && !loading ? (
        <PostCommentButton onCreateComment={handleCreateComment} />
      ) : (null)}
      
      <View style={styles.scrollContainer}>
        {comments.length === 0 ? (
          <NoCommentsView onCreateComment={handleCreateComment} />
        ) : (
          <ScrollView>
              {comments.map((comment) => (
                <ThreadCard key={comment.id} comment={comment} blur={comment.markedSpoiler} />
              ))} 
          </ScrollView>
        )}
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
                  <Ionicons name="close" size={24} color="red" />
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
                  color={'#008080'}
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
    backgroundColor: '#121212',
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
    backgroundColor: '#008080',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
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
    backgroundColor: '#2c2c2c',
    color: 'white',
    padding: 10,
    height: 100,
    borderRadius: 5,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#008080',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#555555',
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
  }
});
