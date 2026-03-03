import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AddressProvider } from './AddressContext';
import { CartProvider } from './ContextParent';
import { GenderProvider } from './GenderContext';
import './global.css';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CartProvider>
        <AddressProvider>
          <GenderProvider>
            <StatusBar style="inverted" />
            <Stack screenOptions={{ headerShown: false }} />
          </GenderProvider>
        </AddressProvider>
      </CartProvider>
    </GestureHandlerRootView>
  );
}
