import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import ProfileCollectionsView from '../../Views/SubViews/ProfileSubView/ProfileCollectionsView';
import ProfileCommentsView from '../../Views/SubViews/ProfileSubView/ProfileCommentsView';
import ProfileLikesView from '../../Views/SubViews/ProfileSubView/ProfileLikesView';
  

const ActiveButtonColor = "#008080"

let username = "Username";
let followersCount  = 3212;
let followingCunt = 4;

const commentCategory = "Comments";
const collectionCategory = "Collections";
const likeCategory = "Likes";

const UsernameDisplay = () => {
    return (
        <View style={styles.profileUsernameContainer}>
            <Text style={styles.username}>@{username}</Text> 
            <TouchableOpacity>
                <Ionicons name="pencil" style={styles.pencilButton}/>
            </TouchableOpacity>
        </View>
    )
}

const ProfileImage = () =>{
    return (
        <View style={styles.profileImageContainer}>
            <TouchableOpacity>
                <Ionicons name='person' style={styles.profileImage} color={'white'} />
            </TouchableOpacity>
        </View>
    )
}

const SettingGear = () => {
    return(
        <View style={styles.gearDisplay}>
            <TouchableOpacity>
                <Ionicons name='settings' style={styles.gearIcon} />
            </TouchableOpacity>
        </View>
    )
}

const FollersFollowingCount = () => {
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
                    <Text style={styles.followingFollowersNumber}>{followingCunt.toString()} </Text>
                </TouchableOpacity>
                <Text style={styles.followingFollowersText}>Following</Text>
            </View>
        </View>
    )
}

const ProfileCategories = () => {
    const [currentCategory, setCurrentCategory] = useState(commentCategory);

    const handleCategoryChange = (category: string) => {
        setCurrentCategory(category);
    } 
  
    return(
        <View>
            <View style={styles.categoriesContainer}>
                <TouchableOpacity onPress={() => handleCategoryChange(commentCategory)}>
                    <Text style={[styles.categoriesText, {backgroundColor: currentCategory === commentCategory ? ActiveButtonColor : "#333333"}]}>
                        {commentCategory}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCategoryChange(collectionCategory)}>
                    <Text style={[styles.categoriesText, {backgroundColor: currentCategory === collectionCategory ? ActiveButtonColor : "#333333"}]}>
                        {collectionCategory}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCategoryChange(likeCategory)}>
                    <Text style={[styles.categoriesText, {backgroundColor: currentCategory === likeCategory ? ActiveButtonColor : "#333333"}]}>
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

export default function ProfileHeaderComponent() {   
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
        color: 'white'
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
        padding: 5,
        color: 'white'
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