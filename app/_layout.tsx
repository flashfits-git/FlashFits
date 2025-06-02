import { Stack } from "expo-router";
import React, { useEffect, useRef , useState} from 'react';
import './global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import {
  ActivityIndicator
} from 'react-native';
// import Colors from '../assets/theme/Colors'; 

export default function RootLayout() {
// const { routerr } = useLocalSearchParams();

    const [fontsLoaded, setFontsLoaded] = useState(false);
  
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'YourFont': require('../assets/fonts/Montserrat-VariableFont_wght.ttf'),
        'Oswald-Regular': require('../assets/fonts/Oswald-VariableFont_wght.ttf'),
        'Raleway' : require('../assets/fonts/Raleway-VariableFont_wght.ttf')
      });
      setFontsLoaded(true);
      await SplashScreen.hideAsync();
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar style="inverted" />
        <Stack screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
