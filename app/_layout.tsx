import { Stack } from "expo-router";
import React, { useEffect, useState } from 'react';
import './global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { ActivityIndicator } from 'react-native';

import { GetCart } from './api/productApis/cartProduct';
import { CartProvider, useCart } from './ContextParent'; // ✅ Adjust path
import Loader from '@/components/Loader/Loader';



const InitializeCart = () => {
  const { setCartItems, setCartCount } = useCart();
  

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await GetCart();
        const items = cartData.items || [];
        console.log(items.length,'2222222222');
        
        setCartItems(items);
        setCartCount(items.length);
        // console.log();
        
      } catch (err) {
        console.error('Failed to load cart:', err);
      }
    };

    fetchCart();
  }, []);

  return null;
};

export default function RootLayout() {
  // const [isLoading, setIsLoading] = useState(true);

  // const [fontsLoaded, setFontsLoaded] = useState(false);

  // useEffect(() => {
  //   async function loadFonts() {
  //     await Font.loadAsync({
  //       'YourFont': require('../assets/fonts/Montserrat-VariableFont_wght.ttf'),
  //       'Oswald-Regular': require('../assets/fonts/Oswald-VariableFont_wght.ttf'),
  //       'Raleway': require('../assets/fonts/Raleway-VariableFont_wght.ttf')
  //     });
  //     setFontsLoaded(true);
  //     await SplashScreen.hideAsync();
  //   }
  //   loadFonts();
  // }, []);

  // if (!fontsLoaded) {
  //   return <ActivityIndicator size="large" />;
  // }

  //   if (isLoading) {
  //   return (   
  //       <Loader/>
  //   );
  // }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CartProvider>
          <InitializeCart />
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right', 'bottom']}>
            <StatusBar style="inverted" />
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaView>
        </CartProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
