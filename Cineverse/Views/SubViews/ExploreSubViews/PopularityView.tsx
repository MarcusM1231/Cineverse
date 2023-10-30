import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MediaCard from '../MediaCard';

export default function PopularityView() {
  return (
    <View style={styles.container}>
      <MediaCard/>
      <MediaCard/>
      <MediaCard/>
      <MediaCard/>   
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',    
  },
});