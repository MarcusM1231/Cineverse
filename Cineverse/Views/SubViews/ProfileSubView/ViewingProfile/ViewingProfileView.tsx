import { StyleSheet, Text, View} from 'react-native';
import ProfileHeaderView from '@views/SubViews/ProfileSubView/ProfileHeaderView';
import { useUser } from '@data/UserContext';
import { User } from '@data/User';


export default function ViewingProfileView({route} : {route: any}) {
    const { userId } = route.params as {userId: string}
    console.log("UserId: ", userId)
    return (
      <View style={styles.container}>
        <ProfileHeaderView userId={userId} />
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