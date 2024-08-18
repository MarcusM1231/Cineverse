import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationOption {
  id: string;
  label: string;
}
const STORAGE_KEY = 'notification_settings';

// Update the name of these once we know which notification options we want
const notificationOptions: NotificationOption[] = [
  { id: '1', label: 'Notification Option 1' },
  { id: '2', label: 'Notification Option 2' },
  { id: '3', label: 'Notification Option 3' },
];

const NotificationsView = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState<boolean>(false);
  const [notificationStates, setNotificationStates] = useState<Record<string, boolean>>({
    '1': false,
    '2': false,
    '3': false,
  });

  // Retrive notification values from storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedSettings) {
          const settings = JSON.parse(storedSettings);
          setIsNotificationsEnabled(settings.isNotificationsEnabled);
          setNotificationStates(settings.notificationStates);
        }
      } catch (error) {
        console.error('Failed to load settings from AsyncStorage', error);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    const saveSettings = async () => {
      try {
        const settings = {
          isNotificationsEnabled,
          notificationStates,
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save settings to AsyncStorage', error);
      }
    };

    saveSettings();
  }, [isNotificationsEnabled, notificationStates]);

  const handleEnableNotificationsToggle = (value: boolean) => {
    setIsNotificationsEnabled(value);

    if (value) {
      // Set all notification states to true when enabling notifications
      setNotificationStates((prevState) => {
        const updatedState = { ...prevState };
        notificationOptions.forEach(option => {
          updatedState[option.id] = true;
        });
        return updatedState;
      });
    } else {
      // Reset all notification states to false when notifications are disabled
      setNotificationStates({
        '1': false,
        '2': false,
        '3': false,
      });
    }
  };

  const handleNotificationToggle = (id: string) => {
    setNotificationStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Enable Notifications</Text>
        <Switch
          value={isNotificationsEnabled}
          onValueChange={handleEnableNotificationsToggle}
          trackColor={{ false: '#767577', true: '#008080' }}
        />
      </View>

      <View style={styles.notificationOptionsContainer}>
        {notificationOptions.map((option) => (
          <View key={option.id} style={styles.notificationOptionContainer}>
            <Text style={[
              styles.notificationOptionLabel,
              !isNotificationsEnabled && styles.disabledText,
            ]}>
              {option.label}
            </Text>
            <Switch
              value={notificationStates[option.id]}
              onValueChange={() => handleNotificationToggle(option.id)}
              trackColor={{ false: isNotificationsEnabled ? '#767577' : '#555555', true: '#008080' }}
              thumbColor={isNotificationsEnabled ? '#f4f3f4' : '#888888'}
              disabled={!isNotificationsEnabled}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    color: 'white',
    marginRight: 15,
    fontSize: 30,
    fontWeight: 'bold'
  },
  notificationOptionsContainer: {
    marginTop: 20,
  },
  notificationOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  notificationOptionLabel: {
    color: 'white',
    marginRight: 10,
    marginBottom: 20,
    flex: 1,
    fontSize: 20
  },
  disabledText: {
    color: '#888888',
  },
});

export default NotificationsView;
