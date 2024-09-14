import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function AboutUsView() {
  const AppName = "Cineverse"  
  
  return (
      <ScrollView style={styles.container}>
        <View style={styles.textContainer}>
        <Text style={styles.header}>About {AppName}</Text>
          <Text style={styles.text}>
            Welcome to {AppName}, the ultimate platform where your love for TV shows 
            and movies meets community engagement. We combine the best of browsing, 
            collecting, and discussing your favorite content, offering a unique space that blends 
            the features of Letterboxd and Reddit.
          </Text>

          <Text style={styles.header}>Discover and Save</Text>
          <Text style={styles.text}>
            Explore an extensive library of shows and movies, all at your fingertips. Whether you're 
            hunting for a new series to binge-watch or curating your collection of all-time 
            favorites, {AppName} makes it easy to find, save, and organize the content that matters most to you. 
            Create custom collections, track your progress, and share your curated lists with friends and the community.
          </Text>

          <Text style={styles.header}>Engage and Discuss</Text>
          <Text style={styles.text}>
            Dive deeper into your favorite episodes with dedicated discussion threads. Under each episode, 
            you'll find a vibrant community eager to discuss plot twists, 
            character development, theories, and everything in between. 
            Whether you're catching up on the latest releases or rewatching classics, 
            our platform ensures there's always a conversation waiting for you.
          </Text>

          <Text style={styles.header}>Join the Community</Text>
          <Text style={styles.text}>
            {AppName} is more than just an app—it's a community of enthusiasts, critics, and casual viewers 
            coming together to share their thoughts, reviews, and recommendations. Engage in meaningful discussions, 
            discover new content, and connect with others who share your passion for TV and movies.
          </Text>

        </View>
    </ScrollView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
    },
    textContainer: {
      borderStyle: 'solid',
      borderColor: '#333333',
      // borderWidth: 1,
      padding: 20
    },
    text: {
      color: 'white',
      marginBottom: 20,
      fontSize: 17,
      textAlign: 'center'
    },
    header: {
      fontSize: 25,
      color: '#013b3b',
      marginBottom: 10,
      fontWeight: 'bold',
      textAlign: 'center'
    }
  });