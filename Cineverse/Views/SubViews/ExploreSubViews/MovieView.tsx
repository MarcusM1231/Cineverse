import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MediaCard from '../../../ViewComponents/MediaCardComponents/MediaCard';
import ViewMoreCard from '../../../ViewComponents/MediaCardComponents/ViewMoreCard';
import { MediaData } from '../../../Data/MediaData';
import mediaData from '../../../Data/MediaData';

//Props
type MediaCategoryProps = {
  categoryType: string;
  mediaData: MediaData[];
} 

//Displays the first six media cards for each section on movie view
const MovieCategoryView = (props: MediaCategoryProps) => {  
  const mediaCards = props.mediaData
    .filter((media) => media.type === 1)
    .map((media, index) => <MediaCard key={index} media={media} />);
  
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