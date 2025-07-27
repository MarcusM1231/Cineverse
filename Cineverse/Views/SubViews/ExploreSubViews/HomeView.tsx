import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MediaCard from '@components/MediaCardComponents/MediaCard';
import ViewMoreCard from '@components/MediaCardComponents/ViewMoreCard';
import { useMedia } from '@data/MediaContext';
import { Media } from '@data/MediaContext';

// Props
type MediaCategoryProps = {
  categoryType: string;
  mediaData: Media[];
}

const BackgroundColor = '#121212'

// Displays the first six media cards for each section on home view
const HomeCategoryView = (props: MediaCategoryProps) => {  
  const [shuffledMedia, setShuffledMedia] = useState<Media[]>([]);

  //Remove later
  useEffect(() => {
    const shuffleArray = (array: Media[]) => {
      return array.sort(() => Math.random() - 0.5);
    };

    const shuffled = shuffleArray(props.mediaData);
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

export default function HomeView() {
  const mediaData = useMedia();

  if (!mediaData) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <View style={styles.content}>
        <HomeCategoryView categoryType='For You' mediaData={mediaData} />
        <HomeCategoryView categoryType='Trending' mediaData={mediaData} />
        <HomeCategoryView categoryType='New Release' mediaData={mediaData} />
        <HomeCategoryView categoryType='Coming Soon' mediaData={mediaData} />
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
    flexDirection: "column",
  },
  categoryTitle: {
    fontSize: 20,
    marginTop: 8,
    marginLeft: 10,
    fontWeight: 'bold',
    color: 'white'
  },
  horizontalLine: {
    borderBottomColor: BackgroundColor,
    borderBottomWidth: 1,
    marginVertical: 1,
  },
});