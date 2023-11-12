import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MediaCard from '../MediaCard';
import ViewMoreCard from '../ViewMoreCard';
import { MediaData } from '../../../Data/MediaData';
import mediaData from '../../../Data/MediaData';

type MediaCategoryProps = {
  categoryType: string;
  mediaData: MediaData[];
} 

const HomeCategoryView = (props: MediaCategoryProps) => {
  const firstSixMedia = props.mediaData.slice(0, 6);

  const mediaCards = firstSixMedia.map((media, index) => (
    <MediaCard key={index} media={media} />
  ));
  
  return (
    <View>
      <View style={styles.horizontalLine}></View>
      <Text style={styles.categoryTitle}>{props.categoryType}</Text>      
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {mediaCards}
          <ViewMoreCard />
        </ScrollView>
        {/* <View style={styles.horizontalLine}></View> */}
      </View>
    </View>
  )
}

export default function HomeView() {
  return (
    <ScrollView contentContainerStyle={styles.container}  showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}>
      <View style={styles.content}>
        <HomeCategoryView categoryType='For You' mediaData={mediaData} />
        <HomeCategoryView categoryType='Trending' mediaData={mediaData} />
        <HomeCategoryView categoryType='New Release' mediaData={mediaData} />
        <HomeCategoryView categoryType='Recently Updated' mediaData={mediaData} />
        <HomeCategoryView categoryType='A-Z' mediaData={mediaData} />
      </View>  
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 80,
    width: '100%',
  },
  content: {
    flexDirection:"column",
  },
  categoryTitle: {
    fontSize: 20,
    marginTop: 8,
    marginLeft: 10,
    fontWeight: 'bold',
    color: 'white'
  },
  test: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  horizontalLine: {
    borderBottomColor: '#121212',
    borderBottomWidth: 1,   
    marginVertical: 1,  
  },
});