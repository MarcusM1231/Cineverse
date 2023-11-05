import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MovieView() {
  return (
    <View style={styles.container}>
      <Text>Movie View</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
});