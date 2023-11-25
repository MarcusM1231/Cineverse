import { StyleSheet, Text, View} from 'react-native';
import ProfileHeaderView from '../SubViews/ProfileSubView/ProfileHeaderView';

/*
This is the Profile view, the view with all the profile
functionality
*/


export default function ProfileView() {
    return (
      <View style={styles.container}>
        <ProfileHeaderView />
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