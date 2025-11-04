import React, { useState, useEffect, useRef } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, Platform, StyleSheet, Animated, Easing, View, StatusBar } from 'react-native';
import Colors from '../../assets/theme/Colors';
// import { GetCart } from '../api/productApis/cartProduct';
// import { storeCartLocally } from '../utilities/cartItemsData';
// import { CartProvider, useCart } from './Context'; // adjust path accordingly


const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: Platform.OS === 'ios' ? 70 : 70,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 18,
    paddingTop: Platform.OS === 'ios' ? 18 : 10,
  },
});

const AnimatedIconWrapper = ({ focused, iconName, size, color, label }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.2 : 1,
        useNativeDriver: false,
      }),
      Animated.timing(bgAnim, {
        toValue: focused ? 1 : 0,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();
  }, [focused]);

  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', Colors.accent],
  });

  return (
    <Animated.View
      style={{
        backgroundColor,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        width: 55,
        height: 55,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <Ionicons name={iconName} size={focused ? 28 : 21} color={color} />
      <Text
        style={{
          fontSize: focused ? 6 : 10,
          marginTop: 2,
          color: focused ? Colors.dark1 : Colors.dark1,
          fontWeight: focused ? 'bold' : 'normal',
          fontFamily: 'Oswald-Regular',
        }}
      >
        {label}
      </Text>
    </Animated.View>
  );
};

function TabsWithCart() {

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: 'none',
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.dark1,
        tabBarInactiveTintColor: Colors.dark1,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = 'home-outline';
          let label = 'Home';

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
            label = 'Home';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'grid' : 'grid-outline';
            label = 'Categories';
          } else if (route.name === 'FlashfitsStores') {
            iconName = focused ? 'storefront' : 'storefront-outline';
            label = 'Stores';
          } else if (route.name === 'Wishlist') {
            iconName = focused ? 'heart' : 'heart-outline';
            label = 'Wishlist';
          }

          return (
            <AnimatedIconWrapper
              focused={focused}
              iconName={iconName}
              size={size}
              color={color}
              label={label}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="Categories" options={{ title: 'Categories' }} />
      <Tabs.Screen name="FlashfitsStores" options={{ title: 'FlashfitsStores' }} />
      <Tabs.Screen name="Wishlist" options={{ title: 'Wishlist' }} />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        // ✅ Top padding without SafeAreaView
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
      }}
    >
      <TabsWithCart />
    </View>

  );
}
