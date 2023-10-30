import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import PopularityView from '../SubViews/ExploreSubViews/PopularityView';
import GenreView from '../SubViews/ExploreSubViews/GenreView'
import AToZView from '../SubViews/ExploreSubViews/AToZView'

//Props
type ButtonProp = {
  type: number;
  title: string;
  onPress: () => void;
  isSelected: boolean;
}

//Variables
const popularityCategory = "Popularity"
const aToZCategory = "A-Z"
const genreCategory = "Genre"

const ActiveButtonColor = "#007BFF"


const CategoryButtons = (props: ButtonProp) => {
  var currentCategory: string;
  
  switch(props.type){
    case(1):
      currentCategory = genreCategory;
      break;
    case(2):
      currentCategory = aToZCategory;
      break;
    default: 
      currentCategory = popularityCategory
      break;
  }
  return(
    <View>
      <TouchableOpacity style={[styles.buttonCategory, {backgroundColor: props.isSelected ? ActiveButtonColor: "#333333"}]} onPress={props.onPress}>
        <Text style={styles.buttonTextStyle}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  )
}


//View
export default function ExploreView() {
  const [currentCategory, setCurrentCategory] = useState(popularityCategory);

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
  }  
  
  return (
      <View style={styles.container}>
        <View style={styles.buttonsContainer}>
          <CategoryButtons 
            title={popularityCategory} 
            type={0} 
            isSelected={currentCategory === popularityCategory} 
            onPress={() => handleCategoryChange(popularityCategory)} 
          />

          <CategoryButtons 
            title={genreCategory} 
            type={1} 
            isSelected={currentCategory === genreCategory} 
            onPress={() => handleCategoryChange(genreCategory)} 
          />

          <CategoryButtons 
            title={aToZCategory} 
            type={2} 
            isSelected={currentCategory === aToZCategory}  
            onPress={() => handleCategoryChange(aToZCategory)} 
          />
        </View>

        <View>
          {currentCategory === popularityCategory && <PopularityView />}
          {currentCategory === genreCategory && <GenreView />}
          {currentCategory === aToZCategory && <AToZView />}
        </View>
    </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'flex-start', 
    },

    buttonTextStyle: {
      textAlign: 'center',
      color: 'white'
    },
    buttonCategory: {
      marginHorizontal: 15,
      marginVertical: 20,
      width: 90,
      textAlign: 'center',
      backgroundColor: '#333333',
      color: 'white',
      padding: 5,
      borderRadius: 15,
      overflow: 'hidden',
    },
    buttonsContainer: {
      //backgroundColor: '#121212',  //this will end up being removed since background will handle it
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
    }

  });