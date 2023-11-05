import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import HomeView from '../SubViews/ExploreSubViews/HomeView';
import MovieView from '../SubViews/ExploreSubViews/MovieView'
import ShowView from '../SubViews/ExploreSubViews/ShowView'

//Props
type ButtonProp = {
  type: number;
  title: string;
  onPress: () => void;
  isSelected: boolean;
}

//Variables
const homeCategory = "Home"
const showCategory = "TV Shows"
const movieCategory = "Movies"

const ActiveButtonColor = "#007BFF"
const InActiveButtonColor = "#333333"


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
      <TouchableOpacity style={[styles.buttonCategory, {backgroundColor: props.isSelected ? ActiveButtonColor : InActiveButtonColor}]} onPress={props.onPress}>
        <Text style={styles.buttonTextStyle}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  )
}


//View
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
      // backgroundColor: '#333333',
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