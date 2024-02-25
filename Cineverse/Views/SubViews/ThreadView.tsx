import React from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import ThreadCard from '../../ViewComponents/ThreadComponents/ThreadCard';
import { Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/compat';
import { useState, useEffect } from 'react';
import { Comment } from '../../Data/Comment';

//Variables
const ThreadColor = '#008080';

interface ThreadViewProps {
  mediaId: number;
  }

export default function ThreadView() {
  const [comments, setComments] = useState<any>([]);

  // Fetch comments from Firestore
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsRef = firebase.firestore().collection('Comments');

        // Assuming you want to fetch all comments
        const snapshot = await commentsRef.get();

        const commentsData: any[] = [];
        snapshot.forEach((doc) => {
          // Get data from each comment document
          commentsData.push(doc.data());
        });

        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments: ', error);
      }
    };

    fetchComments();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView>
      {comments.map((comment: any, index: any) => (
          <ThreadCard key={index} comment={comment} />
        ))}
      </ScrollView>      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  commentInputContainer: {
    
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  commentInputText: {
    color: 'white',
    flex: 1,
    backgroundColor: '#333333',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  profileImage: {
    borderRadius: 10,
    backgroundColor: ThreadColor,
    width: 35,
    height: 30,
    padding: 10,
    textAlign: 'center',
    overflow: 'hidden',
    marginHorizontal: 10,
  },
});
