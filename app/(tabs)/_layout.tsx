import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Text,
  Platform,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: Platform.OS === 'ios' ? 70 : 70,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10, // slightly deeper shadow
    },
    // borderColor:'#000',
    shadowOpacity: 0.15, // more visible
    shadowRadius: 12,    // softer blur
    elevation: 18,
    paddingTop: Platform.OS === 'ios' ? 18 : 10,
  },
});

const AnimatedIconWrapper = ({
  focused,
  iconName,
  size,
  color,
  label,
}: {
  focused: boolean;
  iconName: string;
  size: number;
  color: string;
  label: string;
}) => {
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
    outputRange: ['transparent', '#e4f3ff'],
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
          fontSize: focused ? 6:10,
          marginTop: 2,
          color: focused ? '#008ab7' : '#006486',
          fontWeight: focused ? 'bold' : 'normal',
        }}
      >
        {label}
      </Text>
    </Animated.View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#008ab7',
        tabBarInactiveTintColor: '#006486',
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
          
          // else if (route.name === 'CartBag') {
          //   iconName = focused ? 'bag-handle' : 'bag-handle-outline';
          //   label = 'Cart';
          // }

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
      {/* <Tabs.Screen name="CartBag" options={{ title: 'CartBag' }} /> */}
    </Tabs>
  );
}
