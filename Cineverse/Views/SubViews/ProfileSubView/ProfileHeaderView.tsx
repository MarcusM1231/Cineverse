import { StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import ProfileCollectionsView from './ProfileCollectionsView';
import ProfileCommentsView from './ProfileCommentsView';
import ProfileLikesView from './ProfileLikesView';
import ProfileImage from './ProfileImage';
import firebase from 'firebase/compat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../../Data/UserContext"

//Variables
const ActiveButtonColor = "#008080"
const InactiveButtonColor = "#333333"

const commentCategory = "Comments";
const collectionCategory = "Collections";
const likeCategory = "Likes";

//Displays users username
const UsernameDisplay = () => {
    const user = useUser();
    return (
        <View style={styles.profileUsernameContainer}>
            <Text style={styles.username}>@{user?.username}</Text>
        </View>
    );
};

/*
Right now clicking gear will log user out. Will update this once Settings
View gets implemented
*/
const SettingGear = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const goToSettings = () =>{
        navigation.navigate('SettingsView');
    }
    
    return(
        <View style={styles.gearDisplay}>
            <TouchableOpacity onPress={goToSettings}>
                <Ionicons name='settings' style={styles.gearIcon} />
            </TouchableOpacity>
        </View>
    )
}

// Users following/follower count
const FollersFollowingCount = () => {
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    //Fetches users following/follower count
    // useEffect(() => {
    //     const user = firebase.auth().currentUser;
    //     if (user) {
    //         const userRef = firebase.database().ref(`/users/${user.uid}`);

    //         // Attach an event listener for any value changes in the user node
    //         const onDataChange = (snapshot: any) => {
    //             const userData = snapshot.val();
    //             if (userData) {
    //                 setFollowersCount(userData.initialData.followers);
    //                 setFollowingCount(userData.initialData.following);
    //             }
    //         };

    //         userRef.on('value', onDataChange);

    //         // Return a cleanup function to detach the event listener when component unmounts
    //         return () => {
    //             userRef.off('value', onDataChange);
    //         };
    //     }
    // }, []);

    return (
        <View style={styles.followingFollowersContainer}>
            <View style={styles.followStyle}>
                <TouchableOpacity>
                    <Text style={styles.followingFollowersNumber}>{followersCount.toString()} </Text>
                </TouchableOpacity>
                <Text style={styles.followingFollowersText}>Followers</Text>
            </View>
        
            <View style={styles.followStyle}>
                <TouchableOpacity>
                    <Text style={styles.followingFollowersNumber}>{followingCount.toString()} </Text>
                </TouchableOpacity>
                <Text style={styles.followingFollowersText}>Following</Text>
            </View>
        </View>
    )
}

//Handles switching between the different categories (Comments, Collections, Likes)
const ProfileCategories = () => {
    const [currentCategory, setCurrentCategory] = useState(commentCategory);

    const handleCategoryChange = (category: string) => {
        setCurrentCategory(category);
    } 
  
    return(
        <View>
            <View style={styles.categoriesContainer}>
                <TouchableOpacity onPress={() => handleCategoryChange(commentCategory)}>
                    <Text style={[styles.categoriesText, {backgroundColor: currentCategory === commentCategory ? ActiveButtonColor : InactiveButtonColor}]}>
                        {commentCategory}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCategoryChange(collectionCategory)}>
                    <Text style={[styles.categoriesText, {backgroundColor: currentCategory === collectionCategory ? ActiveButtonColor : InactiveButtonColor}]}>
                        {collectionCategory}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCategoryChange(likeCategory)}>
                    <Text style={[styles.categoriesText, {backgroundColor: currentCategory === likeCategory ? ActiveButtonColor : InactiveButtonColor}]}>
                        {likeCategory}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.categoriesDisplay}>
                {currentCategory === commentCategory && <ProfileCommentsView />}
                {currentCategory === collectionCategory && <ProfileCollectionsView />}
                {currentCategory === likeCategory && <ProfileLikesView />}
            </View>
        </View>
      
    )
}

//Header view with all components
export default function ProfileHeaderView() {   
    return (
        <View style={styles.profileContainer}>            
            <View style={styles.container}>    
                <SettingGear />   
                <ProfileImage />
                <UsernameDisplay />
                <FollersFollowingCount />
                <ProfileCategories />
            </View>
        </View>
    );
  }

  const followingFollowersTextSize = 17

  const styles = StyleSheet.create({
    profileContainer: {
        flexDirection: 'row-reverse',
        flex: 1  
    },
    container: {
      backgroundColor: '#121212',
      width: '100%'
    },

    //Username Styles
    pencilButton: {
        fontSize: 20,
        color: 'white'
    },
    username: {
        fontSize: 27,
        marginRight: 8,
        color: 'white',
        fontWeight: 'bold',
    },
    profileUsernameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },

    //Profile Image Styles
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 10

    },
    profileImage: { 
        backgroundColor: '#333333',
        fontSize: 42,
        borderRadius: 20,
        padding: 20,
        overflow: 'hidden'
        
    },

    //Settings Gear Styles
    gearIcon: {
        fontSize: 27,
        color: 'lightgray',
        marginRight: 10,
        marginTop: 10
    },
    gearDisplay : {
        alignItems: 'flex-end',
        justifyContent:'flex-end' 
    },

    //Following / Followers styles
    followingFollowersContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 10
    },
    followingFollowersNumber: {  
        fontSize: followingFollowersTextSize,
        fontWeight: 'bold',
        color: 'white'
    },
    followingFollowersText: {
        fontSize: followingFollowersTextSize,
        color: 'white'
    },
    followStyle: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginHorizontal: 10,
    },

    categoriesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 15
    },
    categoriesText: {
        marginHorizontal: 15,
        width: 95,
        textAlign: 'center',
        backgroundColor: '#333333',
        color: 'white',
        padding: 10,
        borderRadius: 15,
        overflow: 'hidden',
        
    },
    categoriesDisplay: {
        justifyContent: 'center'
    }

  });