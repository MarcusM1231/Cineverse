import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MediaCard from '../MediaCard';

//MediaCard view can be deleted, just here to test scroll bar right now
export default function AToZView() {
  return (
    <ScrollView contentContainerStyle={styles.container}  showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}>
      <View style={styles.content}>
        <MediaCard/>
        <MediaCard/>
        <MediaCard/>
        <MediaCard/>
        <MediaCard/>
        <MediaCard/>
        <MediaCard/>
        <MediaCard/>
        <MediaCard/>
        <MediaCard/>
        <MediaCard/>
        <MediaCard/>
        <MediaCard/>
        <MediaCard/>
        <MediaCard/>
        <MediaCard/>
        <MediaCard/>
        <MediaCard/>
        <MediaCard/>
        <MediaCard/>
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
    justifyContent: 'center'
  },
});