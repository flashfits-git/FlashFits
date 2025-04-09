import { Stack } from "expo-router";
import './global.css';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter  } from 'expo-router';

export default function RootLayout() {
const { routerr } = useLocalSearchParams();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar style="inverted" />
        <Stack screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
