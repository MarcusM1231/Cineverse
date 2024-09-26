import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRoute } from '@react-navigation/native';
import { Media } from '../../Data/MediaContext';
import { ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import ThreadBubble from "../ThreadComponents/ThreadBubble";

// const ActiveButtonColor = "#008080"
const ActiveButtonColor = '#013b3b'
const InactiveButtonColor = "#333333"
const FontColor = "#D3D3D3"

const MediaTypeLabel = ({ mediaType }: { mediaType: number }) => {
    const [movieSaved, setMovieSaved] = useState(false)

    const savedButtonPressed = () => {
        if (!movieSaved) {
            setMovieSaved(true);
        } else {
            setMovieSaved(false)
        }
    }
    return (
        <View style={styles.saveLabelView}>
            <TouchableOpacity onPress={savedButtonPressed}>
                <Ionicons name="bookmark" size={30} color={movieSaved ? ActiveButtonColor : '#D3D3D3'} />
            </TouchableOpacity>
            <View style={styles.labelbubble}>
                <Text style={styles.mediaType}>{mediaType === 0 ? "TV Show" : "Movie"}</Text>
            </View>
        </View>


    );
}

//Displays all the other details such as title image, summary, likes, and thread list
const CardDetailInfo = () => {
    const route = useRoute();
    const { mediaData } = route.params as { mediaData: Media }

    if (!mediaData) {
        return <Text>Data not available</Text>
    }

    //const [likes, setLikes] = useState(mediaData.likes);
    //const [dislikes, setDisLikes] = useState(mediaData.dislikes);

    //Handles the like button
    const likeButtonPress = () => {
        console.log('liked pressed')
    };

    //Handles the dislike button
    const dislikeButtonPress = () => {
        console.log('disliked pressed')
    };

    const threads = Array.from({ length: mediaData.numberOfEpisodes }, (_, index) => (
        <View key={index}>
            <ThreadBubble
                episodeNumber={index + 1}
                mediaData={mediaData}
                threadBubbleColor={ActiveButtonColor}
                buttonDisabled={false} />
        </View>
    ))

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.mediaTitle}>{mediaData.title}</Text>
                    <View style={styles.saveLabelView}>
                        <MediaTypeLabel mediaType={mediaData.type} />
                    </View>
                </View>

                <View style={styles.imageContainer}>
                    <Image style={styles.imageStyle} source={{ uri: mediaData.image }} />
                </View>

                <View style={styles.likesDislikesContainer}>
                    <View style={styles.likesDislikesContainer}>
                        <TouchableOpacity onPress={likeButtonPress} >
                            <Ionicons style={[styles.likesDislikesIcon, { color: mediaData.likedAlready ? ActiveButtonColor : FontColor, }]} name="heart" />
                        </TouchableOpacity>
                        <Text style={styles.likesDislikesText}>{mediaData.likes}</Text>
                    </View>

                    <View style={styles.likesDislikesContainer}>
                        <TouchableOpacity onPress={dislikeButtonPress}>
                            <Ionicons style={[styles.likesDislikesIcon, { color: mediaData.dislikedAlready ? 'red' : FontColor }]} name="thumbs-down" />
                        </TouchableOpacity>
                        <Text style={styles.likesDislikesText}>{mediaData.dislikes}</Text>
                    </View>
                </View>

                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryText}>{mediaData.summary}</Text>
                </View>

                <View style={styles.mediaDetails}>
                    <Text style={styles.summaryText}>Release Date: {mediaData.releaseDate}</Text>
                    <Text style={styles.summaryText}>Rating: {mediaData.rating}</Text>
                </View>

                <View style={styles.horizontalLine}></View>

                <View>
                    <Text style={styles.threadsListTitle}>{mediaData.type === 1 ? 'Movie Thread' : 'Episdode Threads'}:</Text>
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

const styles = StyleSheet.create({
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
        width: 'auto',
        maxWidth: 250,
        fontWeight: "bold",
        color: FontColor
    },
    mediaType: {
        marginRight: 10,
        backgroundColor: ActiveButtonColor,
        padding: 10,
        borderRadius: 20,
        width: 80,
        textAlign: 'center',
        overflow: 'hidden',
        color: FontColor
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
        marginTop: 20,
    },
    imageStyle: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    summaryContainer: {
        width: '98%',
        height: 'auto',
        marginHorizontal: 0,
        backgroundColor: '#013b3b',
        padding: 15,
        paddingBottom: 30,
        borderRadius: 20
    },
    summaryText: {
        color: FontColor
    },
    mediaDetails: {
        marginTop: 20,
        marginBottom: 10,
    },
    likesDislikesContainer: {
        flexDirection: "row",
        marginRight: 30,
        marginBottom: 8,
        alignItems: 'center',
        width: 50,
    },
    likesDislikesIcon: {
        fontSize: 30
    },
    likesDislikesText: {
        fontSize: 16,
        color: FontColor,

    },
    threadsListTitle: {
        fontSize: 20,
        color: FontColor
    },
    threads: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 15,
    },
    horizontalLine: {
        borderBottomColor: ActiveButtonColor,
        borderBottomWidth: 1,
        marginVertical: 15,
        marginHorizontal: -10,
    },
    saveLabelView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    labelbubble: {
        marginLeft: 10
    }
})