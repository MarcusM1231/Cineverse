import { StyleSheet, View, ActivityIndicator, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import firebase from './firebase/firebaseConfig';

import LoggedInView from './Views/MainViews/LoggedInView';
import LoggedOutView from './Views/MainViews/LoggedOutView';

import { UserProvider } from './Data/UserContext';
import { UserCommentsProvider } from './Data/UserCommentsContext';
import { MediaProvider } from './Data/MediaContext';
import { PaperProvider } from 'react-native-paper';

const BackgroundColor = '#121212';

export default function App() {
  const [loggedIn, setLoggedIn] = useState<firebase.User | null>(null);
  const [initializing, setInitializing] = useState(true);

  function onAuthStateChanged(user: firebase.User | null) {
    setLoggedIn(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [initializing]);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return (
    <UserProvider>
      <UserCommentsProvider>
        <MediaProvider>
          <PaperProvider>
          <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <NavigationContainer>
              {loggedIn ? <LoggedInView /> : <LoggedOutView />}
            </NavigationContainer>
          </View>
          </PaperProvider>
        </MediaProvider>
      </UserCommentsProvider>
    </UserProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BackgroundColor,
  },
});