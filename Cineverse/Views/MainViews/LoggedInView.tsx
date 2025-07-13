import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

import ExploreView from './ExploreView';
import CardDetail from '../../ViewComponents/MediaCardComponents/CardDetail';
import ThreadView from '../../ViewComponents/ThreadComponents/ThreadView';

import SearchView from './SearchView';

import ProfileView from './ProfileView';
import SettingsView from './SettingsView';
import AccountView from '../SubViews/SettingsSubViews/AccountView';
import NotificationsView from '../SubViews/SettingsSubViews/NotificationsView';
import PrivacyView from '../SubViews/SettingsSubViews/PrivacyView';
import FeedbackView from '../SubViews/SettingsSubViews/FeedbackView';
import AboutUsView from '../SubViews/SettingsSubViews/AboutUsView';
import ViewingProfileView from '../SubViews/ProfileSubView/ViewingProfile/ViewingProfileView';
import FullCommentView from '../../ViewComponents/ThreadComponents/FullCommentView';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const ActiveIconColor = '#008080'
const InactiveIconColor = '#E6E6E6'
const BackgroundColor = '#121212'

//Handles navigating from the explore page to the card details page
function Explore() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='ExploreView' component={ExploreView}
        options={{
          title: 'Explore',
          headerTitleStyle: { color: InactiveIconColor },
          headerStyle: { backgroundColor: BackgroundColor }
        }} />

      <Stack.Screen name='CardDetail' component={CardDetail}
        options={{
          title: '',
          headerTintColor: InactiveIconColor,
          headerStyle: { backgroundColor: BackgroundColor }
        }} />

      <Stack.Screen name='ThreadView' component={ThreadView}
        options={{
          title: '',
          headerTintColor: InactiveIconColor,
          headerStyle: { backgroundColor: BackgroundColor }
        }} />

      <Stack.Screen name='FullCommentView' component={FullCommentView}
        options={{
          title: '',
          headerTintColor: InactiveIconColor,
          headerStyle: {
            backgroundColor: BackgroundColor,
          },
          // headerShown: false,
          // presentation: 'modal',
        }} />

      <Stack.Screen name='ViewingProfileView' component={ViewingProfileView}

        options={{
          title: '',
          headerTintColor: InactiveIconColor,
          headerStyle: { backgroundColor: BackgroundColor }
        }} />

      <Stack.Screen name='SettingsView' component={SettingsView}
        options={() => ({
          title: 'Settings',
          headerTintColor: InactiveIconColor,
          headerStyle: { backgroundColor: BackgroundColor },
        })} />
    </Stack.Navigator>
  )
}

function Search() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='SearchView' component={SearchView}
        options={{
          title: 'Search',
          headerTitleStyle: { color: InactiveIconColor },
          headerStyle: { backgroundColor: BackgroundColor }
        }} />

      <Stack.Screen name='ViewingProfileView' component={ViewingProfileView}

        options={{
          title: '',
          headerTintColor: InactiveIconColor,
          headerStyle: { backgroundColor: BackgroundColor }
        }} />

      <Stack.Screen name='SettingsView' component={SettingsView}
        options={() => ({
          title: 'Settings',
          headerTintColor: InactiveIconColor,
          headerStyle: { backgroundColor: BackgroundColor },
        })} />
    </Stack.Navigator>
  )
}

function Profile() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='ProfileView' component={ProfileView}
        options={{
          title: 'Profile',
          headerTitleStyle: { color: InactiveIconColor },
          headerStyle: { backgroundColor: BackgroundColor },

        }} />

      <Stack.Screen name='SettingsView' component={SettingsView}
        options={() => ({
          title: 'Settings',
          headerTintColor: InactiveIconColor,
          headerStyle: { backgroundColor: BackgroundColor },
        })} />

      <Stack.Screen name='Account' component={AccountView}
        options={{
          title: 'Account',
          headerTintColor: InactiveIconColor,
          headerStyle: { backgroundColor: BackgroundColor }
        }} />

      <Stack.Screen name='Notifications' component={NotificationsView}
        options={{
          title: 'Notifications',
          headerTintColor: InactiveIconColor,
          headerStyle: { backgroundColor: BackgroundColor }
        }} />

      <Stack.Screen name='Privacy' component={PrivacyView}
        options={{
          title: 'Privacy',
          headerTintColor: InactiveIconColor,
          headerStyle: { backgroundColor: BackgroundColor }
        }} />

      <Stack.Screen name='Feedback' component={FeedbackView}
        options={{
          title: 'Feedback',
          headerTintColor: InactiveIconColor,
          headerStyle: { backgroundColor: BackgroundColor }
        }} />
      <Stack.Screen name='AboutUs' component={AboutUsView}
        options={{
          title: 'About Us',
          headerTintColor: InactiveIconColor,
          headerStyle: { backgroundColor: BackgroundColor }
        }} />
    </Stack.Navigator>
  )
}

//Handles the views seen once the user is logged in
export default function LoggedInView() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.navigate('Explore');
  }, [navigation]);

  return (
    <View style={styles.container}>

      <Tab.Navigator
        initialRouteName='Explore'
        screenOptions={{
          tabBarActiveTintColor: ActiveIconColor,
          tabBarInactiveTintColor: InactiveIconColor,
          tabBarLabelStyle: { fontSize: 11, },
          tabBarStyle: { backgroundColor: BackgroundColor, borderTopColor: 'black', borderTopWidth: 1 },
          headerStyle: { backgroundColor: BackgroundColor, borderBottomColor: BackgroundColor, borderBottomWidth: 1 },
          headerTitleStyle: { color: 'white' },
          headerShadowVisible: false
        }}
      >
        <Tab.Screen name='Explore' component={Explore}
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons name='home' size={20} color={focused ? ActiveIconColor : InactiveIconColor} />
            ),
            headerShown: false,
          }}
        />

        <Tab.Screen name='Search' component={Search}
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons name='search' size={20} color={focused ? ActiveIconColor : InactiveIconColor} />
            ),
            headerShown: false
          }}
        />

        <Tab.Screen name='Profile' component={Profile}
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons name='person' size={20} color={focused ? ActiveIconColor : InactiveIconColor} />
            ),
            headerShown: false
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor,
  },
});