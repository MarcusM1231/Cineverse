import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GenreView() {
  return (
    <View style={styles.container}>
      <Text>Genre View</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
});