import { Manrope_200ExtraLight, Manrope_300Light, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from "@expo-google-fonts/manrope";
import { WorkSans_100Thin, WorkSans_200ExtraLight, WorkSans_300Light, WorkSans_400Regular, WorkSans_500Medium, WorkSans_600SemiBold, WorkSans_700Bold, WorkSans_800ExtraBold, WorkSans_900Black } from "@expo-google-fonts/work-sans";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AddressProvider } from './AddressContext';
import { CartProvider } from './ContextParent';
import { GenderProvider } from './GenderContext';
import './global.css';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Manrope': Manrope_400Regular,
    'Manrope-ExtraLight': Manrope_200ExtraLight,
    'Manrope-Light': Manrope_300Light,
    'Manrope-Medium': Manrope_500Medium,
    'Manrope-SemiBold': Manrope_600SemiBold,
    'Manrope-Bold': Manrope_700Bold,
    'Manrope-ExtraBold': Manrope_800ExtraBold,
    'WorkSans': WorkSans_400Regular,
    'WorkSans-Thin': WorkSans_100Thin,
    'WorkSans-ExtraLight': WorkSans_200ExtraLight,
    'WorkSans-Light': WorkSans_300Light,
    'WorkSans-Medium': WorkSans_500Medium,
    'WorkSans-SemiBold': WorkSans_600SemiBold,
    'WorkSans-Bold': WorkSans_700Bold,
    'WorkSans-ExtraBold': WorkSans_800ExtraBold,
    'WorkSans-Black': WorkSans_900Black,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <CartProvider>
        <AddressProvider>
          <GenderProvider>
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
              <StatusBar style="dark" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: '#FFFFFF' }
                }}
              />
            </View>
          </GenderProvider>
        </AddressProvider>
      </CartProvider>
    </GestureHandlerRootView>
  );
}
