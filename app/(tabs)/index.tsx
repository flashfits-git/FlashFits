import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Animated,
  TextInputBase,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

import Category from '../../components/HomeComponents/Category';
import PopularProducts from '../../components/HomeComponents/PopulatProducts';
import PopupCart from '../../components/CartComponents/PopupCart';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const scrollOffset = useRef(new Animated.Value(0)).current;
  // console.log(scrollOffset);

  const currentOffset = useRef(0);
  // console.log(currentOffset);
  const isScrollingDown = useRef(false);
  console.log("hi",isScrollingDown);
  
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  // const [scroll, setScroll] = useEffect(false)

  // useEffect(() => {
  //   const listener = scrollOffset.addListener(({ value }) => { 
  //     if (value <= currentOffset.current && !isScrollingDown.current) {    
  //       isScrollingDown.current = true;
  //       setIsTabBarVisible(false);
  //       navigation.setOptions({
  //         tabBarStyle: { display: 'none' },
  //       });
  //     } else if (value > currentOffset.current && isScrollingDown.current) {
  //       isScrollingDown.current = false;
  //       setIsTabBarVisible(true);
  //       navigation.setOptions({
  //         tabBarStyle: {
  //           position: 'absolute',
  //           bottom: 0,
  //           left: 20,
  //           right: 20,
  //           height: 70,
  //           backgroundColor: '#fff',
  //           borderRadius: 16,
  //           shadowColor: '#000',
  //           shadowOffset: { width: 0, height: 5 },
  //           shadowOpacity: 0.1,
  //           shadowRadius: 10,
  //           elevation: 5,
  //           paddingTop: 10,
  //         },
  //       });
  //     }
  //     currentOffset.current = value;
  //   });

  //   return () => {
  //     scrollOffset.removeListener(listener);
  //   };
  // }, []);

  // useEffect(() => {
  //   const listener = scrollOffset.addListener(({ value }) => {
  //     // SCROLLING DOWN → HIDE TAB BAR
  //     if (value > currentOffset.current + 5) {
  //       setIsTabBarVisible(false);
  //       navigation.setOptions({
  //         tabBarStyle: { display: 'none' },
  //       });
  //     }
  
  //     // SCROLLING UP → SHOW TAB BAR
  //     else if (value < currentOffset.current - 5) {
  //       setIsTabBarVisible(true);
  //       navigation.setOptions({
  //         tabBarStyle: {
  //           position: 'absolute',
  //           bottom: 0,
  //           left: 20,
  //           right: 20,
  //           height: 70,
  //           backgroundColor: '#fff',
  //           borderRadius: 16,
  //           shadowColor: '#000',
  //           shadowOffset: { width: 0, height: 5 },
  //           shadowOpacity: 0.1,
  //           shadowRadius: 10,
  //           elevation: 5,
  //           paddingTop: 10,
  //         },
  //       });
  //     }
  
  //     currentOffset.current = value;
  //   });
  
  //   return () => {
  //     scrollOffset.removeListener(listener);
  //   };
  // }, []);
  

  
  // useEffect(() => {
  //   const listener = scrollOffset.addListener(({ value }) => {
  //     // SCROLLING UP (user dragging content down)
  //     if (value < currentOffset.current - 5) {
  //       setIsTabBarVisible(true);
  //       navigation.setOptions({
  //         tabBarStyle: {
  //           position: 'absolute',
  //           bottom: 0,
  //           left: 20,
  //           right: 20,
  //           height: 70,
  //           backgroundColor: '#fff',
  //           borderRadius: 16,
  //           shadowColor: '#000',
  //           shadowOffset: { width: 0, height: 5 },
  //           shadowOpacity: 0.1,
  //           shadowRadius: 10,
  //           elevation: 5,
  //           paddingTop: 10,
  //         },
  //       });
  //     }
  
  //     // SCROLLING DOWN (user dragging content up)
  //     else if (value > currentOffset.current + 5) {
  //       setIsTabBarVisible(false);
  //       navigation.setOptions({
  //         tabBarStyle: { display: 'none' },
  //       });
  //     }
  
  //     // Update current offset for next comparison
  //     currentOffset.current = value;
  //   });
  
  //   return () => {
  //     scrollOffset.removeListener(listener);
  //   };
  // }, []);

  useEffect(() => {
    const listener = scrollOffset.addListener(({ value }) => {
      // Prevent negative scroll values
      const clampedValue = Math.max(0, value);
  
      // SCROLLING UP (user dragging content down)
      if (clampedValue < currentOffset.current - 5) {
        setIsTabBarVisible(true);
        navigation.setOptions({
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 20,
            right: 20,
            height: 70,
            backgroundColor: '#fff',
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5,
            paddingTop: 10,
          },
        });
      }
  
      // SCROLLING DOWN (user dragging content up),
      // only hide tab bar if not at top of screen
      else if (
        clampedValue > currentOffset.current + 5 &&
        clampedValue > 30 // Avoid hiding when near top or on initial load
      ) {
        setIsTabBarVisible(false);
        navigation.setOptions({
          tabBarStyle: { display: 'none' },
        });
      }
  
      // Update current offset for next comparison
      currentOffset.current = clampedValue;
    });
  
    return () => {
      scrollOffset.removeListener(listener);
    };
  }, []);
  
  

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#f7f7f7a', '#f7f7f7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Header Section */}
        <View className="flex-row items-center justify-between p-1">
          <View className="flex-row items-center ml-2 p-2">
            <View className="w-8 h-8 bg-white rounded-lg items-center justify-center mr-2">
              <Ionicons name="location-outline" size={20} color="#6E4E37" />
            </View>
            <View className="w-[200px]">
              <View className="flex-row items-center">
                <Text
                  className="text-base font-bold text-black mr-2 max-w-[200px]"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  New York, USA
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={16}
                  color="black"
                />
              </View>
              <Text
                className="text-sm text-[#868c8f] leading-5"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Explore trending styles around you!
              </Text>
            </View>
          </View>
          <View className="justify-center items-center mr-5">
            <Ionicons name="notifications-outline" size={30} color="#000" />
          </View>
        </View>

        {/* Search Section */}
        <View className="flex-row items-center mx-5 mb-2">
          <View className="flex-row items-center bg-[#F0F0F0] rounded-xl px-3 h-11 flex-1">
            <Ionicons name="search" size={20} color="#868c8f" />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#868c8f"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 h-full text-sm text-black ml-2"
            />
          </View>
          <View className="bg-[#7B4F32] rounded-xl p-2.5 ml-2">
            <Ionicons name="git-branch-outline" size={24} color="#fff" />
          </View>
        </View>

        {/* FlatList with Scroll Listener */}
        <Animated.FlatList
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffset } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          ListHeaderComponent={<Category />}
          ListFooterComponent={<View className="h-5" />}
          data={[{ key: 'popular-products' }]}
          renderItem={() => <PopularProducts />}
          keyExtractor={(item) => item.key}
        />
      </LinearGradient>

      {/* PopupCart Positioned Above Bottom Tab */}
      <PopupCart isTabBarVisible={isTabBarVisible} />
    </View>
  );
}
