import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MediaCard from '../MediaCard';

export default function PopularityView() {
  return (
    <ScrollView contentContainerStyle={styles.container}  showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}>
      <View style={styles.content}>
        <Text>Popularity View</Text>
      </View>  
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10
  },
});