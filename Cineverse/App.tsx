import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import  { useState, useEffect } from 'react';
import firebase from './firebase/firebaseConfig';

import LoggedInView from './Views/MainViews/LoggedInView';
import LoggedOutView from './Views/MainViews/LoggedOutView'

const BackgroundColor = '#121212'

//Base starting point of the app
export default function App() {
  
  const [loggedIn, setLoggedIn] = useState();
  const [intializing, setIntializing] = useState(true);

  function onAuthStateChanged(loggedIn: any) {
    setLoggedIn(loggedIn);
    if (intializing){setIntializing(false);} 
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber;
  }, [])

  if (intializing){return null;}

  return (
    <View style={styles.container}>
      <NavigationContainer>
        { loggedIn ? (
          <LoggedInView />
        ) : (
          <LoggedOutView />
        )} 
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
