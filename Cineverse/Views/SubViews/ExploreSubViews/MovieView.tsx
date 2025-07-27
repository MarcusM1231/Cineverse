import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MediaCard from '@components/MediaCardComponents/MediaCard';
import ViewMoreCard from '@components/MediaCardComponents/ViewMoreCard';
import { useMedia } from '@data/MediaContext';
import { Media } from '@data/MediaContext';

//Props
type MediaCategoryProps = {
  categoryType: string;
  mediaData: Media[];
} 

const BackgroundColor = '#121212'
const FontColor = 'white'

const MovieCategoryView = (props: MediaCategoryProps) => {  
  const [shuffledMedia, setShuffledMedia] = useState<Media[]>([]);

  //Remove later
  useEffect(() => {
    const shuffleArray = (array: Media[]) => {
      return array.sort(() => Math.random() - 0.5);
    };

    const shuffled = shuffleArray(props.mediaData.filter(media => media.type === 1));
    setShuffledMedia(shuffled);
  }, [props.mediaData]);

  const firstSixMedia = shuffledMedia.slice(0, 6);
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
      </View>
    </View>
  )
}

export default function MovieView() {

  const mediaData = useMedia();

  if (!mediaData) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}  showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}>
      <View style={styles.content}>
        <MovieCategoryView categoryType='For You' mediaData={mediaData} />
        <MovieCategoryView categoryType='New Release' mediaData={mediaData} />
        <MovieCategoryView categoryType='Coming Soon' mediaData={mediaData} />
        <MovieCategoryView categoryType='Top 100' mediaData={mediaData} />
        <MovieCategoryView categoryType='Random Movies' mediaData={mediaData} />
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
    color: FontColor
  },
  horizontalLine: {
    borderBottomColor: BackgroundColor,
    borderBottomWidth: 1,   
    marginVertical: 1,  
  },
});