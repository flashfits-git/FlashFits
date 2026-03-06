import { Manrope_200ExtraLight, Manrope_300Light, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from "@expo-google-fonts/manrope";
import { WorkSans_100Thin, WorkSans_200ExtraLight, WorkSans_300Light, WorkSans_400Regular, WorkSans_500Medium, WorkSans_600SemiBold, WorkSans_700Bold, WorkSans_800ExtraBold, WorkSans_900Black } from "@expo-google-fonts/work-sans";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ErrorBoundary from '../components/ErrorBoundary';
import { AddressProvider } from './AddressContext';
import { AuthProvider, useAuth } from './AuthContext';
import { CartProvider } from './ContextParent';
import { GenderProvider } from './GenderContext';
import { WishlistProvider } from './WishlistContext';
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
      // We don't hide splash screen here anymore since auth needs to resolve
      // SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <AuthProvider>
        <CartProvider>
          <AddressProvider>
            <GenderProvider>
              <WishlistProvider>
                <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                  <StatusBar style="dark" />
                  <ErrorBoundary>
                    <RootNavigator />
                  </ErrorBoundary>
                </View>
              </WishlistProvider>
            </GenderProvider>
          </AddressProvider>
        </CartProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

// --------------------------------------------
// Secure Navigator Layer
// --------------------------------------------
function RootNavigator() {
  const { isAuthenticated, isLoading, signOut } = useAuth();

  useEffect(() => {
    // Listen for global auth expiration events (e.g. from axiosConfig interceptors)
    const handleUnauthorized = () => {
      console.log('Unauthorized event received, signing out...');
      signOut();
    };

    const subscription = DeviceEventEmitter.addListener('auth_unauthorized', handleUnauthorized);

    return () => {
      subscription.remove();
    };
  }, [signOut]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null; // Keep splash screen visible while loading auth state
  }

  return (
    <Stack
      key={isAuthenticated ? 'authenticated' : 'unauthenticated'}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
        gestureEnabled: isAuthenticated, // Disable gestures on auth screens
      }}
    >
      {/* If authenticated, load the main app stacks */}
      {isAuthenticated ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(profile)" options={{ headerShown: false }} />
          <Stack.Screen name="(stack)" options={{ headerShown: false }} />
        </>
      ) : (
        /* If not authenticated, load the auth stack */
        <Stack.Screen name="(auth)" options={{ headerShown: false, animation: 'fade' }} />
      )}
    </Stack>
  );
}
