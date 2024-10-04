import { StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginView from '../SubViews/LoggedOutSubViews/LoginView';
import RegisterView from '../SubViews/LoggedOutSubViews/RegisterView';
import ForgotPasswordView from '../SubViews/LoggedOutSubViews/ForgotPasswordView';

//Variables
const Stack = createNativeStackNavigator();
const BackgroundColor = '#121212'

//View which displays the Login and Register pages
export default function LoggedOutView() {
  return (
    <View style={styles.container}>
      <Stack.Navigator>
          <Stack.Screen name='LoginView' component={LoginView} 
          options={ {
              headerShown: false
          }
          } />
          <Stack.Screen name='RegisterView' component={RegisterView} 
          options={ {headerShown: false}} 
          />
          <Stack.Screen name='ForgotPasswordView' component={ForgotPasswordView} 
          options={ {headerShown: false}} 
          />
          </Stack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor,
  },
});
