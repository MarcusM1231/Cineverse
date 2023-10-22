import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ExploreView from './Views/MainViews/ExploreView';
import SearchView from './Views/MainViews/SearchView';
import ProfileView from './Views/MainViews/ProfileView';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='Explore'>
        <Tab.Screen name='Explore' component={ExploreView}
          options={{
            tabBarIcon: () => (
              <Ionicons name='home-outline' size={20} />
            )
          }} 
        />

        <Tab.Screen name='Search' component={SearchView} 
          options={{
              tabBarIcon: () => (
                <Ionicons name='search-outline' size={20} />
              )
            }} 
          />

        <Tab.Screen name='Profile' component={ProfileView} 
          options={{
            tabBarIcon: () => (
              <Ionicons name='person-outline' size={20} />
            )
          }} 
        />
    </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
