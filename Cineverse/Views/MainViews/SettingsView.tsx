import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, NavigationProp  } from '@react-navigation/native';
import firebase from '../../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProvider, useUser } from '../../Data/UserContext';

// Define the type for each setting item
type SettingItem = {
  id: string;
  title: keyof RootStackParamList;
};

type RootStackParamList = {
    Account: undefined;
    Notifications: undefined;
    Privacy: undefined;
    Feedback: undefined;
    AboutUs: undefined
  };

  type SettingsViewNavigationProp = NavigationProp<RootStackParamList>;

// Settings options
const settingsOptions: SettingItem[] = [
  { id: '1', title: 'Account' },
  { id: '2', title: 'Notifications' },
  { id: '3', title: 'Privacy' },
  { id: '4', title: 'Feedback' },
  { id: '5', title: 'AboutUs' },
];

const showLogoutConfirmation = () => {
  Alert.alert(
    'Confirm Logout',
    'Are you sure you want to log out?',
    [
      {
        text: 'Yes',
        onPress: () => handleLogout(),
      },
      {
        text: 'No',
      },
    ],
    { cancelable: false }
  );
};

const handleLogout = async () => {
  const currentUser = firebase.auth().currentUser;

  if (currentUser) {
      const userId = currentUser.uid;
      const usernameKey = `username-${userId}`;
      const imageKey = `profileImage-${userId}`;
      const emailKey = `email-${userId}`;      
      // Clear cache for the current user
      await AsyncStorage.multiRemove([usernameKey, imageKey, emailKey]);
      
      // Sign out from Firebase
      await firebase.auth().signOut();
      
  }
};

export default function SettingsView() {
  const navigation = useNavigation<SettingsViewNavigationProp>();

  //Use to render list item - regex is for having space in title name
  const renderItem = ({ item }: { item: SettingItem }) => (
    <TouchableOpacity onPress={() => navigation.navigate(item.title)}>
      <View style={styles.item}>
      <Text style={styles.itemText}>{item.title.replace(/([A-Z])/g, ' $1').trim()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={settingsOptions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.logOutText}>
        <Text style={styles.itemText} onPress={showLogoutConfirmation}>Log out?</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 24,
    color: '#fff',
    marginVertical: 20,
  },
  item: {
    backgroundColor: '#1f1f1f',
    padding: 15,
    marginVertical: 8,
    width: '100%',
    borderRadius: 5,
  },
  itemText: {
    color: '#fff',
    fontSize: 18,
  },
  logOutText: {
    alignItems: 'center',
    marginBottom: 30,
  },
});
