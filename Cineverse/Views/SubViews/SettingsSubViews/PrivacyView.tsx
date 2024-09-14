import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PrivacyView() {
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    // Load the cached privacy setting on component mount
    const loadPrivacySetting = async () => {
      try {
        const storedSetting = await AsyncStorage.getItem('privacySetting');
        if (storedSetting !== null) {
          setIsPrivate(JSON.parse(storedSetting));
        }
      } catch (error) {
        console.error('Failed to load privacy setting:', error);
      }
    };

    loadPrivacySetting();
  }, []);

  const handleSwitchToggle = async (value: boolean) => {
    setIsPrivate(value);
    try {
      // Cache the privacy setting
      await AsyncStorage.setItem('privacySetting', JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save privacy setting:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Account Privacy</Text>
      <Switch
        value={isPrivate}
        onValueChange={handleSwitchToggle}
        trackColor={{ false: '#767577', true: '#013b3b' }}
      />
      <Text style={styles.explanation}>
        {isPrivate ? 'Your account is private. Only approved followers can see your posts.' : 'Your account is public. Anyone can see your posts and follow you.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  explanation: {
    color: 'white',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
});
