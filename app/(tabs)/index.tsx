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
import Loader from '@/components/Loader/Loader';
import {getPreviouslyViewed} from '../utilities/localStorageRecentlyViewd'
import HomeCategorySwitcherShops from '@/components/HomeComponents/HomeCategorySwitcherShops'
// import { useCart } from './Context';



export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const scrollOffset = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  // const [fontsLoaded, setFontsLoaded] = useState(false);
  const [newArrivalsProducts, setNewArrivalsProducts] = useState([])
  // const [merchantData, setMerchnatData] = useState()
    const [loading, setLoading] = useState(true);
    
  useEffect(() => {
    getNewArrivalsProducts()
    // getMerchantsData()
    setLoading(false)
  }, [])

  const getNewArrivalsProducts = async () => {
    try {
      const response = await fetchnewArrivalsProductsData()
      setNewArrivalsProducts(response)
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

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

  useEffect(() => {
  const loadRecentlyViewed = async () => {
    try {
      const data = await getPreviouslyViewed();
      
      setRecentlyViewed(data);
      // console.log(data);
      
    } catch (error) {
      console.error('Error loading previously viewed:', error);
    }
  };

  loadRecentlyViewed();
}, []);

  if (loading) return <Loader />;

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
          <SearchCartProfileButton/>
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
            <HomeCategorySwitcherShops />
            {newArrivalsProducts.length > 0 && (
  <>
    <RecentlyViewed product={recentlyViewed}/>
    <ParentCategoryIndexing products={newArrivalsProducts} />
  </>
)}
          </>
        }
      />
      <Footer/>
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
