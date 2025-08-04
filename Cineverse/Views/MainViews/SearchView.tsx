import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import firebase from '@firebase/firebaseConfig';
import debounce from 'lodash/debounce';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// Define the structure of a User document
interface User {
  uid: string;
  username: string;
  profileImage?: string;
  bio?: string;
}

const PrimaryColor = '#013b3b'

export default function SearchView() {
  const [query, setQuery] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);

  const navigation = useNavigation<any>();

  // useFocusEffect(
  //   useCallback(() => {
  //     setQuery(''); // Clear the search input
  //     setUsers([]); // Optionally, clear the users list as well
  
  //     return () => {
  //       // Cleanup logic if needed when unfocusing, like aborting a search
  //     };
  //   }, [])
  // );

  // Function to search users based on the query
  const searchUsers = async (searchQuery: string) => {
    if (!searchQuery) {
      setUsers([]);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    try {
      const usersRef = firebase.firestore().collection('users');
      const snapshot = await usersRef
        .orderBy('username')
        .get();

      const allUsers: User[] = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data() as User as Omit<User, 'uid'>
      }));

      const filteredUsers = allUsers.filter(user =>
        user.username.toLowerCase().includes(lowerCaseQuery)
      );

      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error searching users: ', error);
    }
  };

  // Debounced function to call searchUsers after a delay
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      searchUsers(searchTerm);
    }, 500),
    []
  );

  // Handle query change and trigger debounced search
  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (text.trim() === '') {
      debouncedSearch.cancel();
      setUsers([]);
      
    } else {
      debouncedSearch(text);
    }
  };

  const navigateToProfile = useCallback((id: string) => {
    navigation.navigate('ViewingProfileView', { userId: id });
  }, [navigation,]);

  const renderEmptyComponent = () => {
    if (query.trim() === '') return null; // show nothing if search bar is empty
    return <Text style={styles.emptyText}>No users found.</Text>; // show message if search is typed but no users
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for users..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={handleQueryChange}
        />

        <FlatList
          data={users}
          keyExtractor={(item: User) => item.uid}
          renderItem={({ item }: { item: User }) => (
            <TouchableOpacity onPress={() => navigateToProfile(item.uid)}>
              <View style={styles.resultItem}>
                {item.profileImage ? (
                  <Image source={{ uri: item.profileImage }} style={styles.profileImageFound} />
                ) : (
                  <Ionicons name="person" size={20} style={styles.profileImage} color="white" />
                )}
                <Text style={styles.resultText}>{item.username}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={renderEmptyComponent} // cleaner call here
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  searchInput: {
    width: '90%',
    padding: 10,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    color: 'white',
  },
  resultItem: {
    padding: 15,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  resultText: {
    color: 'white',
    fontSize: 15
  },
  emptyText: {
    color: 'white',
    fontSize: 15,
    marginTop: 20,
  },
  profileImage: {
    borderRadius: 20,
    backgroundColor: PrimaryColor,
    width: 40,
    height: 40,
    padding: 10,
    textAlign: 'center',
    overflow: 'hidden',
    marginRight: 10
},
profileImageFound: {
  width: 40,
  height: 40,
  borderRadius: 20,
  marginRight: 10
},
});
