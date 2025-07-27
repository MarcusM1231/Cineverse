import { StyleSheet, Text, View} from 'react-native';
import ProfileHeaderView from '@views/SubViews/ProfileSubView/ProfileHeaderView';
import { useUser } from '@data/UserContext';

/*
This is the Profile view, the view with all the profile
functionality
*/


export default function ProfileView() {
  const user = useUser();
    return (
      <View style={styles.container}>
        <ProfileHeaderView userId={user.user?.uid}/>
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