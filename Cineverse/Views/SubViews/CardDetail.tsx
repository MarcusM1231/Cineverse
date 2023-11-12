import { Text, View, TouchableOpacity, StyleSheet, Image} from "react-native";
import { useRoute } from '@react-navigation/native';
import { MediaData } from "../../Data/MediaData";
import { ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import ThreadView from "./ThreadView";

const ActiveButtonColor = "#008080"

const MediaTypeLabel = ({ mediaType }: { mediaType: number }) =>{
    var mediaText;

    if(mediaType === 0){
        mediaText = "TV Show"
    }else{
        mediaText = "Movie"
    }
    return(
        
        <View>
            <Text style={styles.mediaType}>{mediaText}</Text>
        </View>
    );
}

const CardDetailInfo = () => {
    const route = useRoute();
    const {mediaData} = route.params as {mediaData: MediaData}

    if(!mediaData){
        return <Text>Data not available</Text>
    }

    const [likes, setLikes] = useState(mediaData.likes);
    const [dislikes, setDisLikes] = useState(mediaData.dislikes);

    //Handles the like button
    const likeButtonPress = () =>{
        if(mediaData.dislikedAlready){
            setDisLikes(dislikes - 1);
            mediaData.dislikes = dislikes - 1;
            mediaData.dislikedAlready = false;
        }
        if(!mediaData.likedAlready){
            setLikes(likes + 1);
            mediaData.likes = likes + 1;
            mediaData.likedAlready = true;
        } else {
            setLikes(likes - 1);
            mediaData.likes = likes - 1;
            mediaData.likedAlready = false;
        }
    };

    //Handles the dislike button
    const dislikeButtonPress = () =>{
        if(mediaData.likedAlready){
            setLikes(likes - 1);
            mediaData.likes = likes - 1;
            mediaData.likedAlready = false;
        }
        if(!mediaData.dislikedAlready){
            setDisLikes(dislikes + 1);
            mediaData.dislikes = dislikes + 1;
            mediaData.dislikedAlready = true;
        } else {
            setDisLikes(dislikes - 1);
            mediaData.dislikes = dislikes - 1;
            mediaData.dislikedAlready = false;
        }
    };

    const threads = Array.from({length: mediaData.episodeNumber}, (_, index) => (
        <View key={index}>
            <ThreadView episodeNumber={index + 1} />
        </View>
    ))

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator = {false}>

            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.mediaTitle}>{mediaData.title}</Text>
                    <MediaTypeLabel mediaType={mediaData.type} />
                </View>
            
            <View style={styles.imageContainer}>
                <Image style={styles.imageStyle} source={{uri: mediaData.image}} />
            </View>

            <View style={styles.likesDislikesContainer}>
                <View style={styles.likesDislikesContainer}>
                    <TouchableOpacity onPress={likeButtonPress} >
                        <Ionicons style={[styles.likesDislikesIcon, { color: mediaData.likedAlready ? ActiveButtonColor : "white", }]} name="thumbs-up" />
                    </TouchableOpacity>
                    <Text style={styles.likesDislikesText}>{likes}</Text>
                </View>

                <View style={styles.likesDislikesContainer}>
                    <TouchableOpacity onPress={dislikeButtonPress}>
                        <Ionicons style={[styles.likesDislikesIcon, { color: mediaData.dislikedAlready ? 'red' : 'white' }]} name="thumbs-down" />
                    </TouchableOpacity>                   
                    <Text style={styles.likesDislikesText}>{mediaData.dislikes}</Text>
                </View>
            </View>

            <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>{mediaData.mediaSummary}</Text>
            </View>

            <View style={styles.mediaDetails}>
                <Text style={styles.summaryText}>Release Date: {mediaData.releaseDate}</Text>
                <Text style={styles.summaryText}>Rating: {mediaData.rating}</Text>
            </View>

            <View style={styles.horizontalLine}></View>

            <View>
                <Text style={styles.threadsListTitle}>{mediaData.type === 1 ? 'Movie Thread': 'Episdode Threads'}:</Text>
                <View style={styles.threads}>
                    {threads}
                </View>
            </View>
            
        </View>
        </ScrollView>
        
    )
}

export default function CardDetail() {
    return (
        <View style={styles.container}>
            <CardDetailInfo />
        </View>
    )
}

const styles = StyleSheet.create ({
    container: {
        flex: 1, 
        paddingTop: 10,  
        paddingLeft: 5,
        backgroundColor: "#121212"
    },
    scrollContent: {
        paddingBottom: 30,
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 'auto',
        justifyContent: 'space-between'
    },
    mediaTitle: {
        fontSize: 25,
        width:'auto',
        maxWidth: 250,
        fontWeight: "bold",
        color: 'white'
    }, 
    mediaType: {
        marginRight: 10,
        backgroundColor: ActiveButtonColor,
        padding: 10,
        borderRadius: 20,
        width: 80,
        textAlign: 'center',
        overflow: 'hidden',
        color: 'white'
    },
    imageContainer: {
        width: 300,
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 2,
        alignSelf: 'center', 
        borderColor: '#333333',
        marginBottom: 30,
        marginTop: 20
    },
    imageStyle: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    summaryContainer: {
        width: 380,
        backgroundColor: '#333333',
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 20
    },
    summaryText: {
        color: 'white'
    },
    mediaDetails: {
        marginTop: 20,
        marginBottom: 10,
    },
    likesDislikesContainer: {
        flexDirection: "row",
        marginRight: 20,
        marginBottom: 8,
        alignItems: 'center',
        width: 50,
    },
    likesDislikesIcon: {
        fontSize: 20
    },
    likesDislikesText: {
        fontSize: 16,
        color: 'white'
    },
    threadsListTitle: {
        fontSize: 20,
        color: 'white'
    },
    threads: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 15,        
    },  
    horizontalLine: {
        borderBottomColor: '#333333',
        borderBottomWidth: 1,   
        marginVertical: 15,  
      },
})