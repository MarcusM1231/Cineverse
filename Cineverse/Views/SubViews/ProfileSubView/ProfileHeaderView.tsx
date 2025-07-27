import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import ProfileCollectionsView from './ProfileCollectionsView';
import ProfileCommentsView from './ProfileCommentsView';
import ProfileLikesView from './ProfileLikesView';
import ProfileImage from './ProfileImage';
import firebase from '@firebase/firebaseConfig';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "@data/UserContext"
import ViewingProfileImage from '@views/SubViews/ProfileSubView/ViewingProfile/ViewingProfileImage';
import { Menu, Divider } from 'react-native-paper';
import MenuItem from 'react-native-paper/lib/typescript/components/Menu/MenuItem';
import React from 'react';

//Variables
const PrimaryColor = '#013b3b'
const SecondaryColor = '#333333'
const BackgroundColor = '#121212'

const commentCategory = "Comments";
const collectionCategory = "Collections";
const likeCategory = "Likes";

const UsernameDisplay = ({ userName }: { userName: string }) => {
    const user = useUser();
    return (
        <View style={styles.profileUsernameContainer}>
            <Text style={styles.username}>@{userName}</Text>
        </View>
    );
};


const SettingGear = ({ currentUser }: { currentUser: boolean }) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [menuVisible, setMenuVisible] = useState(false);

    const closeMenu = () => { setMenuVisible(false); };
    const openMenu = () => { setMenuVisible(true); };

    const goToSettings = () => {
        navigation.navigate('SettingsView');
    }

    const reportClicked = () => {

    }

    const blockClicked = () => {

    }

    return (
        <View style={styles.gearDisplay}>
            {currentUser ? (
                <TouchableOpacity onPress={goToSettings}>
                    <Ionicons name='settings' style={styles.gearIcon} />
                </TouchableOpacity>
            ) : (
                <View>
                    {menuVisible && (
                        <TouchableWithoutFeedback onPress={closeMenu}>
                            <View style={styles.overlay} />
                        </TouchableWithoutFeedback>
                    )}
                    <Menu onDismiss={closeMenu} visible={menuVisible} anchorPosition='bottom'
                        anchor={
                            <TouchableOpacity onPress={openMenu}>
                                <Ionicons name='ellipsis-horizontal' style={styles.gearIcon} />
                            </TouchableOpacity>
                        }>
                        <Menu.Item
                            style={styles.menuOption}
                            onPress={reportClicked}
                            title='Report' 
                        />
                        <Divider />
                        <Menu.Item
                            style={styles.menuOption}
                            onPress={blockClicked}
                            title='Block' 
                        />

                    </Menu>
                </View>

            )}
        </View>
    )
}

const AccountPrivateView = () => {

    return (
        <View style={styles.lockedView}>
            <Ionicons name='lock-closed' size={50} color={PrimaryColor} />
            <Text style={styles.privateAccountHeaderText}>This account is private</Text>
            <Text style={styles.privateAccountSubText}>Follow this account to see their profile</Text>
        </View>
    )
}

// Users following/follower count
const FollersFollowingCount = ({ userData }: { userData: any }) => {
    const [followersCount, setFollowersCount] = useState(userData.followers);
    const [followingCount, setFollowingCount] = useState(userData.following);

    useEffect(() => {
        if (userData) {
            const userRef = firebase.firestore().collection('users').doc(userData.uid);

            // Set up real-time listener for changes in the user's followers/following counts
            const unsubscribe = userRef.onSnapshot((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    setFollowersCount(data?.followers || followersCount);
                    setFollowingCount(data?.following || followingCount);
                }
            });

            return () => unsubscribe();
        }
    }, [userData]);

    return (
        <View style={styles.followingFollowersContainer}>
            <View style={styles.followStyle}>
                <TouchableOpacity>
                    <Text style={styles.followingFollowersNumber}>{followersCount} </Text>
                </TouchableOpacity>
                <Text style={styles.followingFollowersText}>Followers</Text>
            </View>

            <View style={styles.followStyle}>
                <TouchableOpacity>
                    <Text style={styles.followingFollowersNumber}>{followingCount} </Text>
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

    return (
        <View>
            <View style={styles.categoriesContainer}>
                <TouchableOpacity onPress={() => handleCategoryChange(commentCategory)}>
                    <Text style={[styles.categoriesText, { backgroundColor: currentCategory === commentCategory ? PrimaryColor : SecondaryColor }]}>
                        {commentCategory}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCategoryChange(collectionCategory)}>
                    <Text style={[styles.categoriesText, { backgroundColor: currentCategory === collectionCategory ? PrimaryColor : SecondaryColor }]}>
                        {collectionCategory}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCategoryChange(likeCategory)}>
                    <Text style={[styles.categoriesText, { backgroundColor: currentCategory === likeCategory ? PrimaryColor : SecondaryColor }]}>
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

const FollowButton = () => {
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollowPress = () => {
        // Implement follow/unfollow functionality here
        setIsFollowing(!isFollowing);
    };

    return (
        <View style={styles.followButtonContainer}>
            <TouchableOpacity
                style={[styles.followButton, isFollowing ? styles.unfollowButton : styles.followButton]}
                onPress={handleFollowPress}
            >
                <Text style={styles.followButtonText}>
                    {isFollowing ? 'Following' : 'Follow'}
                </Text>
                <Ionicons
                    name={isFollowing ? 'checkmark-circle' : 'add-circle'}
                    size={20}
                    color="white"
                />
            </TouchableOpacity>
        </View>
    );
};

//Header view with all components
export default function ProfileHeaderView({ userId }: { userId: any }) {
    const [userData, setUserData] = useState<any>()
    const userContext = useUser();
    const isCurrentUser = firebase.auth().currentUser?.uid === userId;
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUserData = async () => {
            const data = await userContext.getUserDataById(userId, isCurrentUser);
            setUserData(data);
            setIsLoading(false)

            
        };

        fetchUserData();
    }, [userId, userContext]);

    return (
        <View style={styles.profileContainer}>
            {isLoading ? (
                <>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#008080" />
                    </View>
                </>
            ) : (
                <>
                    <View style={styles.container}>
                        <SettingGear currentUser={isCurrentUser} />
                        {isCurrentUser ? (
                            <ProfileImage />
                        ) : (
                            <ViewingProfileImage userData={userData} />
                        )}

                        <UsernameDisplay userName={userData.username} />
                        <FollersFollowingCount userData={userData} />
                        {!isCurrentUser && <FollowButton />}
                        {userData.accountPrivacy === true && !isCurrentUser ? (
                            <AccountPrivateView />
                        ) : (
                            <ProfileCategories />
                        )}
                        
                    </View>
                </>
            )}
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
        backgroundColor: BackgroundColor,
        width: '100%'
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
        backgroundColor: SecondaryColor,
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
    gearDisplay: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
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
        backgroundColor: SecondaryColor,
        color: 'white',
        padding: 10,
        borderRadius: 15,
        overflow: 'hidden',

    },
    categoriesDisplay: {
        justifyContent: 'center'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
    },
    menuOption: {
        padding: 10,
        borderRadius: 20
    },
    lockedView: {
        alignItems: 'center',
        marginTop: '5%'
    },
    privateAccountHeaderText: {
        fontSize: 30,
        color: 'white',
        marginVertical: 10
    },
    privateAccountSubText: {
        color: 'white'
    },
    followButtonContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20
    },
    followButton: {
        backgroundColor: SecondaryColor,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    unfollowButton: {
        backgroundColor: PrimaryColor,
    },
    followButtonText: {
        color: 'white',
        fontSize: 16,
        marginRight: 10,
    },

});