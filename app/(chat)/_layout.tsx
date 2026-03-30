import AppText from '@/components/AppText';
import { useUser } from '@clerk/clerk-expo';
import Entypo from '@expo/vector-icons/Entypo';
import { Link, Redirect, Stack, useRouter } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';


export default function RootLayout() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Redirect href={'/(auth)'} />;
  }


  const homeOptions = {
    headerTitle: () => (
      <View style={{ flexDirection: 'row', alignItems: "center", flex: 1, gap: 10 }}>
        {user?.imageUrl && (
          <Link href={'/profile'}>
            <Image
              source={{ uri: user.imageUrl }}
              style={{ width: 35, height: 35, borderRadius: 50 }}

            />
          </Link>
        )}
        <AppText style={{ color: 'white', fontWeight: '700', fontSize: 18 }}>
          Chat Rooms
        </AppText>
      </View>
    ),
    //headerLargeTitle: true,

    headerRight: () => (
      <>
        <Link href={'/new-room'} style={styles.newContainer}>
          <Entypo name="plus" size={20} color="white" />

        </Link>
      </>
    )
  }

  return (
    <Stack screenOptions={{
      contentStyle: {
        backgroundColor: '#000',
        paddingHorizontal: 12, paddingTop: 32
      },
    }}>
      <Stack.Screen
        name="index"
        options={homeOptions}
      />

      <Stack.Screen name="profile" options={{
        headerLeft: () => <Entypo name="chevron-small-left" size={32} color="white" onPress={() => router.back()} />
      }} />
      <Stack.Screen name="new-room" options={{
        headerTitle: 'New Chat Room',
        headerLeft: () => <>

          <Entypo name="chevron-small-left" size={32} color="white" onPress={() => router.back()} />
        </>
      }} />

      <Stack.Screen name="[chat]" options={{

        headerLeft: () => <Entypo name="chevron-small-left" size={32} color="white" onPress={() => router.back()} />
      }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  newContainer: {
    gap: 4,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,

  }
})