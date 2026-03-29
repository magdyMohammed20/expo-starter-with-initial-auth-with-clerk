import { useUser } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';


export default function RootLayout() {

  const { isSignedIn } = useUser()

  if (isSignedIn) {
    return <Redirect href={'/(chat)'} />
  }


  return (
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: {
        backgroundColor: '#000',
      },
    }}>
      <Stack.Screen name='index' />
    </Stack>
  );
}
