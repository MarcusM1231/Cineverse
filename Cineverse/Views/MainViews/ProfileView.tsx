import { StyleSheet, Text, View} from 'react-native';
import ProfileHeaderComponent from '../../ViewComponents/ProfileComponents/ProfileHeaderComponent';

/*
This is the Profile view, the view with all the profile
functionality
*/


export default function ProfileView() {
    return (
      <View style={styles.container}>
        <ProfileHeaderComponent />
    </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });