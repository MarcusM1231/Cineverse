import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MediaCard from '../MediaCard';
import ViewMoreCard from '../ViewMoreCard';

type MediaCategoryProps = {
  categoryType: string
} 

const HomeCategoryView = (props: MediaCategoryProps) => {
  const mediaCards = Array.from({ length: 6 }, (_, index) => (
    <MediaCard key={index} />
  ));
  
  return (
    <View>
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
  return (
    <ScrollView contentContainerStyle={styles.container}  showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}>
      <View style={styles.content}>
        <HomeCategoryView categoryType='For You' />
        <HomeCategoryView categoryType='Trending' />
        <HomeCategoryView categoryType='New Release' />
        <HomeCategoryView categoryType='Recently Updated' />
        <HomeCategoryView categoryType='A-Z' />
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
    fontWeight: 'bold'
  },
  test: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});