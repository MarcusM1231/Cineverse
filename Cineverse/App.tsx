import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ExploreView from './Views/MainViews/ExploreView';
import SearchView from './Views/MainViews/SearchView';
import ProfileView from './Views/MainViews/ProfileView';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const ActiveIconColor = "#007BFF"
const InactiveIconColor = "black"

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        initialRouteName='Explore'
        screenOptions={{
          tabBarInactiveTintColor: "black",
          tabBarLabelStyle: {fontSize: 11},
        }}
      >
        <Tab.Screen name='Explore' component={ExploreView}
          options={{
            tabBarIcon: ({focused}) => (
              <Ionicons name='home' size={20} color={focused ? ActiveIconColor : InactiveIconColor} />
            ),
          }} 
        />

        <Tab.Screen name='Search' component={SearchView} 
          options={{
              tabBarIcon: ({focused}) => (
                <Ionicons name='search' size={20} color={focused ? ActiveIconColor : InactiveIconColor} />
              ),
            }} 
          />

        <Tab.Screen name='Profile' component={ProfileView} 
          options={{
            tabBarIcon: ({focused}) => (
              <Ionicons name='person' size={20} color={focused ? ActiveIconColor : InactiveIconColor} />
            ),
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
  },
});
