import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExploreView from './Views/MainViews/ExploreView';
import SearchView from './Views/MainViews/SearchView';
import ProfileView from './Views/MainViews/ProfileView';
import { Ionicons } from '@expo/vector-icons';
import CardDetail from './Views/SubViews/CardDetail';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const ActiveIconColor = '#008080' 
const InactiveIconColor = '#E6E6E6'
const BackgroundColor = '#121212'

function Explore() {
  return(
    <Stack.Navigator>
      <Stack.Screen name='ExploreView' component={ExploreView} 
      options={{
        title: 'Explore',
        headerTitleStyle: {color: InactiveIconColor},
        headerStyle: {backgroundColor: BackgroundColor}
        }}/>

      <Stack.Screen name='CardDetail' component={CardDetail} 
      options={{
        title:'',
        headerTintColor: InactiveIconColor,
        headerStyle: {backgroundColor: BackgroundColor}
      }}/>
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator 
          initialRouteName='Explore'
          screenOptions={{
            tabBarActiveTintColor: ActiveIconColor,
            tabBarInactiveTintColor: InactiveIconColor,
            tabBarLabelStyle: {fontSize: 11,},
            tabBarStyle: {backgroundColor: BackgroundColor, borderTopColor: 'black', borderTopWidth: 1},
            headerStyle: {backgroundColor: BackgroundColor, borderBottomColor: BackgroundColor, borderBottomWidth: 1},
            headerTitleStyle: {color: 'white'},
            headerShadowVisible: false
          }}
        >
          <Tab.Screen name='Explore' component={Explore}
            options={{
              tabBarIcon: ({focused}) => (
                <Ionicons name='home' size={20} color={focused ? ActiveIconColor : InactiveIconColor} />
              ),
              headerShown: false,
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor,
  },
});
