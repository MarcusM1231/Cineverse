import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ShowView() {
  return (
    <ScrollView contentContainerStyle={styles.container}  showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}>
      <View style={styles.content}>
        <Text>TV Shows</Text>
      </View>  
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 10,
    alignItems: 'center',
  },
  container: {

  }
});