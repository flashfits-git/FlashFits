import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Platform,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import PopupCart from '../../components/HomeComponents/PopupCart';
import RecentlyViewed from '../../components/HomeComponents/RecentlyViewed';
import Carousel from '@/components/HomeComponents/Carousel';
import Banner from '@/components/HomeComponents/Banner';
import ParentCategoryIndexing from '@/components/HomeComponents/ParentCategoryIndexing';
import SearchCartProfileButton from '../../components/FlexibleComponents/SearchCartProfileButton';
import Colors from '../../assets/theme/Colors';
import { fetchnewArrivalsProductsData } from '../api/productApis/products';
import Footer from '../../components/Footer';
import Loader from '@/components/Loader/Loader';
import { getPreviouslyViewed } from '../utilities/localStorageRecentlyViewd';
import HomeCategorySwitcherShops from '@/components/HomeComponents/HomeCategorySwitcherShops';

const HEADER_HEIGHT = 70;
const SCROLL_THRESHOLD = 5;

export default function Home() {
  const [searchQuery] = useState(''); // Not used, but kept if needed later
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastOffsetY = useRef(0);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [newArrivalsProducts, setNewArrivalsProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [products, viewed] = await Promise.all([
        fetchnewArrivalsProductsData(),
        getPreviouslyViewed(),
      ]);
      setNewArrivalsProducts(products || []);
      setRecentlyViewed(viewed || []);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Tab Bar Visibility on Scroll
  const handleScroll = useCallback(
    Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      {
        useNativeDriver: false,
        listener: (event: any) => {
          const currentOffset = event.nativeEvent.contentOffset.y;
          const diff = currentOffset - lastOffsetY.current;

          if (Math.abs(diff) < SCROLL_THRESHOLD) return;

          const visible = diff < 0 || currentOffset <= 0;
          if (visible !== isTabBarVisible) {
            setIsTabBarVisible(visible);
            navigation.setOptions({
              tabBarStyle: visible
                ?
                {
                  position: 'absolute',
                  height: Platform.OS === 'ios' ? 80 : 90,
                  backgroundColor: '#fff',
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                  paddingTop: Platform.OS === 'ios' ? 18 : 18,
                  paddingBottom: Platform.OS === 'ios' ? 10 : 10,
                }
                : { display: 'none' },
            });
          }
          lastOffsetY.current = currentOffset;
        },
      }
    ),
    [isTabBarVisible, navigation, scrollY]
  );

  // Memoized Header Component
  const Header = useMemo(
    () => (
      <>
        <Carousel />
        <HomeCategorySwitcherShops />
        {newArrivalsProducts.length > 0 && (
          <>
            <RecentlyViewed product={recentlyViewed} />
            <ParentCategoryIndexing products={newArrivalsProducts} />
          </>
        )}
      </>
    ),
    [newArrivalsProducts, recentlyViewed]
  );

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <Banner />

      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.locationWrapper}>
          <View style={styles.timeBox}>
            <Text style={styles.timeText1}>10</Text>
            <Text style={styles.timeText}>min</Text>
          </View>

          <View style={styles.locationTextWrapper}>
            <View style={styles.locationRow}>
              <Text style={styles.cityText} numberOfLines={1}>
                Kadavanthra, Kochi
              </Text>
              <Ionicons name="chevron-down-outline" size={16} color="black" />
            </View>
            <Text style={styles.subText} numberOfLines={1}>
              Explore trending styles around you!
            </Text>
          </View>
        </View>

        <View style={styles.notificationIcon}>
          <SearchCartProfileButton />
        </View>
      </View>

      {/* Scrollable Content */}
      <Animated.FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={Header}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="never"
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyExtractor={() => 'dummy'}
      />
      <PopupCart isTabBarVisible={isTabBarVisible} />
      <Footer />
    </View>
  );
}

// Optimized Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    height: HEADER_HEIGHT,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timeBox: {
    width: 50,
    height: 50,
    backgroundColor: '#000',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  timeText1: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  locationTextWrapper: {
    flex: 1,
    paddingRight: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityText: {
    fontSize: 14,
    color: Colors.dark1,
    marginRight: 8,
    fontWeight: '400',
    fontFamily: 'Montserrat',
  },
  subText: {
    fontSize: 10,
    color: Colors.dark2,
    fontWeight: '300',
    fontFamily: 'Montserrat',
  },
  notificationIcon: {
    marginRight: 20,
  },
});