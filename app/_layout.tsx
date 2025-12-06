import { Stack } from "expo-router";
import React, { useEffect, useState } from 'react';
import './global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
// import { GetCart } from './api/productApis/cartProduct';
import { CartProvider, useCart } from './ContextParent'; // ✅ Adjust path
import {AddressProvider} from './AddressContext';
import Loader from '@/components/Loader/Loader';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <SafeAreaProvider> */}
        <CartProvider>
          <AddressProvider>

          {/* <InitializeCart /> */}
          {/* <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right', 'bottom']}> */}
            <StatusBar style="inverted" />
            <Stack screenOptions={{ headerShown: false }} />

          </AddressProvider>
          {/* </SafeAreaView> */}
        </CartProvider>
      {/* </SafeAreaProvider> */}
    </GestureHandlerRootView>
  );
}
