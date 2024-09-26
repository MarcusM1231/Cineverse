import { StyleSheet, Text, View} from 'react-native';
import ProfileHeaderView from '../ProfileHeaderView';
import { useUser } from '../../../../Data/UserContext';
import { User } from '../../../../Data/User';


export default function ViewingProfileView({route} : {route: any}) {
    const { userId } = route.params || {};
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