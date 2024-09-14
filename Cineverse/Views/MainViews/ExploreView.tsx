import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import HomeView from '../SubViews/ExploreSubViews/HomeView';
import MovieView from '../SubViews/ExploreSubViews/MovieView'
import ShowView from '../SubViews/ExploreSubViews/ShowView'
import styles from '../../css/ExploreStylesheet'

type ButtonProp = {
  type: number;
  title: string;
  onPress: () => void;
  isSelected: boolean;
}

const homeCategory = "Home"
const showCategory = "TV Shows"
const movieCategory = "Movies"

const PrimaryColor = '#013b3b'
const SecondaryColor = '#333333'

const CategoryButtons = (props: ButtonProp) => {
  var currentCategory: string;
  
  switch(props.type){
    case(1):
      currentCategory = movieCategory;
      break;
    case(2):
      currentCategory = showCategory;
      break;
    default: 
      currentCategory = homeCategory
      break;
  }
  return(
    <View>
      <TouchableOpacity style={[styles.buttonCategory, {backgroundColor: props.isSelected ? PrimaryColor : SecondaryColor}]} onPress={props.onPress}>
        <Text style={styles.buttonTextStyle}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function ExploreView() {
  const [currentCategory, setCurrentCategory] = useState(homeCategory);

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
  }  
  
  return (
      <View style={styles.container}>
        <View style={styles.buttonsContainer}>
          <CategoryButtons 
            title={homeCategory} 
            type={0} 
            isSelected={currentCategory === homeCategory} 
            onPress={() => handleCategoryChange(homeCategory)} 
          />

          <CategoryButtons 
            title={movieCategory} 
            type={1} 
            isSelected={currentCategory === movieCategory} 
            onPress={() => handleCategoryChange(movieCategory)} 
          />

          <CategoryButtons 
            title={showCategory} 
            type={2} 
            isSelected={currentCategory === showCategory}  
            onPress={() => handleCategoryChange(showCategory)} 
          />
        </View>

        <View>
          {currentCategory === homeCategory && <HomeView />}
          {currentCategory === movieCategory && <MovieView />}
          {currentCategory === showCategory && <ShowView />}
        </View>
    </View>
    );
  }