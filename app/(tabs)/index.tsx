import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Animated,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import PopupCart from '../../components/HomeComponents/PopupCart';
import RecentlyViewed from '../../components/HomeComponents/RecentlyViewed';
import Card from '../../components/HomeComponents/Card';
import Carousel from '@/components/HomeComponents/Carousel';
import Banner from '@/components/HomeComponents/Banner';
import ParentCategoryIndexing from '@/components/HomeComponents/ParentCategoryIndexing';
import SearchCartProfileButton from '../../components/FlexibleComponents/SearchCartProfileButton';
import Colors from '../../assets/theme/Colors';
import {fetchnewArrivalsProductsData} from '../api/productApis/products'
import Footer from '../../components/Footer'
// import * as Font from 'expo-font';
// import * as SplashScreen from 'expo-splash-screen';


// SplashScreen.preventAutoHideAsync(); // Prevent hiding until fonts are loaded

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const scrollOffset = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  // const [fontsLoaded, setFontsLoaded] = useState(false);
    const [products, setProducts] = useState([
    {
      id:3e23,
      name: "Classic White Shirt",
      merchantId: { _id: "1", name: "Trendify Merchants" },
      brandId: { _id: "2", name: "UrbanClassics" },
      categoryId: { _id: "3", name: "Topwear" },
      subCategoryId: { _id: "4", name: "Shirts" },
      subSubCategoryId: { _id: "5", name: "Formal Shirts" },
      gender: "men",
      description: "A classic white shirt made from premium cotton A classic white shirt made from premium cotton  A classic white shirt made from premium cotton  ",
      mrp: 1499,
      price: 999,
      features: { fabric: "100% Cotton", fit: "Slim Fit", sleeve: "Full Sleeve" },
      tags: ["white", "shirt", "formal", "slim fit"],
      variants: [
        {
          color: { name: "White", hex: "#fff" },
          sizes: [
            { size: "S", stock: 3 },
            { size: "M", stock: 5 },
            { size: "L", stock: 4 },
            { size: "XL", stock: 2 },
          ],
          images: [
            {
              public_id: "white_shirt_1",
              url: "https://example.com/images/white-shirt-1.jpg",
            },
            {
              public_id: "white_shirt_2",
              url: "https://example.com/images/white-shirt-2.jpg",
            },
          ],
          mainImage: {
            public_id: "white_shirt_main",
            url: "https://example.com/images/white-shirt-main.jpg",
          },
          discount: 33,
        },
        {
          color: { name: "Off white", hex: "#000" },
          sizes: [
            { size: "S", stock: 6 },
            { size: "M", stock: 42 },
            { size: "L", stock: 4 },
            { size: "XL", stock: 8 },
          ],
          images: [
            {
              public_id: "white_shirt_1",
              url: "https://example.com/images/white-shirt-1.jpg",
            },
            {
              public_id: "white_shirt_2",
              url: "https://example.com/images/white-shirt-2.jpg",
            },
          ],
          mainImage: {
            public_id: "white_shirt_main",
            url: "https://example.com/images/white-shirt-main.jpg",
          },
          discount: 33,
        },
      ],
      ratings: 4.5,
      numReviews: 27,
      isActive: true,
    },
    {
      id:3234,
      name: "Denim Jacket Denim Jacket Denim Jacket",
      merchantId: { _id: "1", name: "Trendify Merchants" },
      brandId: { _id: "2", name: "UrbanClassics" },
      categoryId: { _id: "3", name: "Topwear" },
      subCategoryId: { _id: "4", name: "Jackets" },
      subSubCategoryId: { _id: "5", name: "Denim Jackets" },
      gender: "women",
            description: "A classic white shirt made from premium cotton A classic white shirt made from premium cotton  A classic white shirt made from premium cotton  ",
      mrp: 2999,
      price: 1999,
      features: { material: "Denim", pockets: "4", wash: "Medium" },
      tags: ["denim", "jacket", "casual"],
      variants: [
        {
          color: { name: "Blue", hex: "#1E3A8A" },
          sizes: [
            { size: "S", stock: 1},
            { size: "M", stock: 5 },
            { size: "L", stock: 3 },
          ],
          images: [
            {
              public_id: "denim_jacket_1",
              url: "https://example.com/images/denim-jacket-1.jpg",
            },
          ],
          mainImage: {
            public_id: "denim_jacket_main",
            url: "https://unsplash.com/photos/boy-in-white-crew-neck-t-shirt-wearing-black-sunglasses-PDZAMYvduVk",
          },
          discount: 25,
        },
      ],
      ratings: 4.8,
      numReviews: 54,
      isActive: true,
    },
  ]);

  // Scroll listener to toggle tab bar
  useEffect(() => {
    const listener = scrollOffset.addListener(({ value }) => {
      const clampedValue = Math.max(0, value);

      if (clampedValue < currentOffset.current - 5) {
        setIsTabBarVisible(true);
        navigation.setOptions({
          tabBarStyle: {
            position: 'absolute',
            height: Platform.OS === 'ios' ? 70 : 70,
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5,
            paddingTop: Platform.OS === 'ios' ? 18 : 10,
          },
        });
      } else if (clampedValue > currentOffset.current + 5 && clampedValue > 3) {
        setIsTabBarVisible(false);
        navigation.setOptions({
          tabBarStyle: { display: 'none' },
        });
      }
      currentOffset.current = clampedValue;
    });

    return () => {
      scrollOffset.removeListener(listener);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Banner />
      <View style={styles.header}>
        <View style={styles.locationWrapper}>
          <View style={styles.locationIcon}>
            <Ionicons name="location-sharp" size={26} color={Colors.dark1} />
          </View>
          <View style={styles.locationTextWrapper}>
            <View style={styles.locationRow}>
              <Text style={styles.cityText} numberOfLines={1} ellipsizeMode="tail">
                New York, USA
              </Text>
              <Ionicons name="chevron-down-outline" size={16} color="black" />
            </View>
            <Text style={styles.subText} numberOfLines={1} ellipsizeMode="tail">
              Explore trending styles around you!
            </Text>
          </View>
        </View>
        <View style={styles.notificationIcon}>
          <SearchCartProfileButton />
        </View>
      </View>

      <Animated.FlatList
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffset } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <>
            <Carousel />
            <RecentlyViewed product={products} />
            <ParentCategoryIndexing products={products}/>
            {/* <ParentCategoryIndexing products={products}/> */}
          </>
        }
      />
      <Footer/>

      {/* <PopupCart isTabBarVisible={isTabBarVisible} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 4,
  height: 70,
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,

},
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  locationIcon: {
    width: 32,
    height: 32,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  locationTextWrapper: {
    paddingRight: 14,
    width: 200,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityText: {
    fontSize: 14,
    color: Colors.dark1,
    marginRight: 8,
    maxWidth: 200,
    fontWeight: '400',
    fontFamily: 'Montserrat',
  },
  subText: {
    fontSize: 10,
    color: Colors.dark2,
    lineHeight: 20,
    fontWeight: '300',
    fontFamily: 'Montserrat',
  },
  notificationIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
});
