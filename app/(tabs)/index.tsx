import Carousel from '@/components/HomeComponents/Carousel';
import CategorySwitcher from '@/components/HomeComponents/CategorySwitcher';
import HomeCategorySwitcherShops from '@/components/HomeComponents/HomeCategorySwitcherShops';
import ParentCategoryIndexing from '@/components/HomeComponents/ParentCategoryIndexing';
import Loader from '@/components/Loader/Loader';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../assets/theme/Colors';
import ErrorBoundary from '../../components/ErrorBoundary';
import SearchCartProfileButton from '../../components/FlexibleComponents/SearchCartProfileButton';
import Footer from '../../components/Footer';
import AnimatedSearchBar from '../../components/HomeComponents/AnimatedSearchBar';
import RecentlyViewed from '../../components/HomeComponents/RecentlyViewed';
import { useAddress } from '../AddressContext'; // ✅ NEW — use selectedAddress context'
import { useGender } from '../GenderContext';
import { fetchnewArrivalsProductsData, fetchTrendingProductsData, fetchRecommendedProductsData, fetchBanners } from '../api/productApis/products';
import { getPreviouslyViewed } from '../utilities/localStorageRecentlyViewd';
import ProductHorizontalList from '../../components/HomeComponents/ProductHorizontalList';

const ANIMATION_DURATION = 700;

export default function Home() {
  const router = useRouter();
  const navigation = useNavigation();

  const { selectedAddress, setSelectedAddress } = useAddress(); // <-- now from context
  const { selectedGender } = useGender();
  // const insets = useSafeAreaInsets();

  const L_HEIGHT = 70; // Location header height
  const S_HEIGHT = 64; // Search bar height
  // const TOTAL_ABSOLUTE_HEIGHT = insets.top + L_HEIGHT + S_HEIGHT;

  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [newArrivalsProducts, setNewArrivalsProducts] = useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [sectionLoading, setSectionLoading] = useState(false);

  const isInitialRender = useRef(true);
  const scrollOffset = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const [isActive, setIsActive] = useState(true)
  const [refreshing, setRefreshing] = useState(false);
  const [isServiceable, setIsServiceable] = useState<boolean | null>(null);
  const [hasError, setHasError] = useState(false);

  // Animated values derived from scrollOffset
  const headerTranslateY = scrollOffset.interpolate({
    inputRange: [0, L_HEIGHT],
    outputRange: [0, -L_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollOffset.interpolate({
    inputRange: [0, L_HEIGHT * 0.75],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const searchBarTranslateY = scrollOffset.interpolate({
    inputRange: [0, L_HEIGHT],
    outputRange: [0, -L_HEIGHT + 10], // Margin when fixed
    extrapolate: 'clamp',
  });

  // ------------------- LOAD DATA -------------------
  const loadInitialData = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setSectionLoading(true);
    }
    
    try {
      // Pass selectedGender to all product fetches
      const genderMap: Record<string, string> = { Men: 'MEN', Women: 'WOMEN', Kids: 'KIDS' };
      const genderParam = selectedGender === 'All' ? undefined : genderMap[selectedGender];
      
      const [products, trending, recommended, viewed, bannerData, storedAddress] = await Promise.all([
        fetchnewArrivalsProductsData(genderParam),
        fetchTrendingProductsData(genderParam),
        fetchRecommendedProductsData(genderParam),
        getPreviouslyViewed(),
        fetchBanners(),
        SecureStore.getItemAsync('selectedAddress'),
      ]);

      setNewArrivalsProducts(products || []);
      setTrendingProducts(trending || []);
      setRecommendedProducts(recommended || []);
      setRecentlyViewed(viewed || []);
      
      const actualBanners = bannerData?.banners || bannerData || {};
      setBanners(actualBanners);

      // Set address from SecureStore to Context 
      if (storedAddress) {
        const parsed = JSON.parse(storedAddress);
        setSelectedAddress(parsed);
      }

      if (isInitialLoad) {
        setLoading(false);
      } else {
        setSectionLoading(false);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      setHasError(true);
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setSectionLoading(false);
      }
    }
  }, [selectedGender]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadInitialData(false),
      ]);
    } catch (e) {
      console.error('Refresh error:', e);
    } finally {
      setRefreshing(false);
    }
  }, [loadInitialData]);

  useEffect(() => {
    return () => setIsActive(false);
  }, []);

  useEffect(() => {
    if (!isActive) return;
    
    // First time mount, use the full screen loader. 
    // Subsequent gender changes, use the skeleton loader.
    if (isInitialRender.current) {
      loadInitialData(true);
      isInitialRender.current = false;
    } else {
      loadInitialData(false);
    }
  }, [isActive, selectedGender, loadInitialData]); // Re-fetch when gender changes







  useEffect(() => {
    const listener = scrollOffset.addListener(({ value }) => {
      const clampedValue = Math.max(0, value);
      const delta = clampedValue - currentOffset.current;

      // Hiding/Showing Tab Bar based on scroll direction
      if (delta > 10 && isTabBarVisible) {
        setIsTabBarVisible(false);
        navigation.setOptions({ tabBarStyle: { display: 'none' } });
      }
      else if (delta < -10 && !isTabBarVisible) {
        setIsTabBarVisible(true);
        navigation.setOptions({
          tabBarStyle: {
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
          },
        });
      }

      currentOffset.current = clampedValue;
    });

    return () => scrollOffset.removeListener(listener);
  }, [isTabBarVisible]);

  // ------------------- HEADER -------------------
  const Header = useMemo(
    () => (
      <>
        {/* Spacer for the absolute headers */}
        {/* <View style={{ height: 30 }} /> */}
        <HomeCategorySwitcherShops />
        <RecentlyViewed product={recentlyViewed} />
        <CategorySwitcher />
        
        {/* New dynamic sections */}
        <ProductHorizontalList 
          title="New Arrivals" 
          data={newArrivalsProducts} 
          isLoading={sectionLoading} 
          banner={banners['new_arrivals_banner']?.[0]}
        />
        <ProductHorizontalList 
          title="Trending Now" 
          data={trendingProducts} 
          isLoading={sectionLoading} 
          banner={banners['trending_banner']?.[0]}
        />
        <ProductHorizontalList 
          title="You May Like" 
          data={recommendedProducts} 
          isLoading={sectionLoading} 
          banner={banners['recommended_banner']?.[0]}
        />
      </>
    ),
    [newArrivalsProducts, trendingProducts, recommendedProducts, recentlyViewed, selectedGender, sectionLoading, banners],
  );

  if (loading) return <Loader />;

  if (hasError) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 32 }]}>
        <View style={{ alignItems: 'center' }}>
          <View style={{
            width: 80, height: 80, borderRadius: 40,
            backgroundColor: '#F2F2F2', justifyContent: 'center', alignItems: 'center', marginBottom: 24,
          }}>
            <Ionicons name="cloud-offline-outline" size={36} color="#8E8E93" />
          </View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#0F0F0F', fontFamily: 'Manrope-Bold', marginBottom: 8 }}>
            Unable to load
          </Text>
          <Text style={{ fontSize: 14, color: '#8E8E93', fontFamily: 'Manrope', textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
            Please check your connection and try again.
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#0F0F0F', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12 }}
            onPress={() => {
              setHasError(false);
              loadInitialData();
            }}
          >
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', fontFamily: 'Manrope-Bold' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        {/* FIXED POSITION HEADERS — transparent overlay so no white bg on scroll */}
        <View style={styles.headerContainer} pointerEvents="box-none">
          {/* LOCATION HEADER */}
          <Animated.View
            style={[
              styles.header,
              {
                height: L_HEIGHT,
                opacity: headerOpacity,
                transform: [{ translateY: headerTranslateY }],
              },
            ]}
          >
            <View style={styles.locationWrapper}>
              <Ionicons
                name="location-outline"
                size={30}
                color="black"
                style={styles.locationIcon}
              />

              <TouchableOpacity onPress={() => router.push("/(stack)/SavedAddressesScreen" as any)}
                style={{ paddingVertical: 20 }}>
                <View
                  style={styles.locationTextWrapper}
                >
                  <View style={styles.locationRow}>
                    <Text style={styles.cityText} numberOfLines={1}>
                      {selectedAddress?.addressType === 'Non-serviceable'
                        ? 'Oops! We don\'t deliver here'
                        : selectedAddress
                          ? [
                            selectedAddress.addressLine1,
                            selectedAddress.area,
                            selectedAddress.city,
                          ].filter(Boolean).join(', ')
                          : 'Select Location'}
                    </Text>
                  </View>

                  <View style={styles.subRow}>
                    <Text style={styles.subText} numberOfLines={1}>
                      {selectedAddress?.addressType === 'Non-serviceable'
                        ? 'We\'ll be there soon'
                        : selectedAddress?.addressType || 'Explore trending styles around you!'}
                    </Text>
                    <TouchableOpacity>
                      <Ionicons
                        name="chevron-down-outline"
                        size={16}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.notificationIcon}>
              <SearchCartProfileButton hideSearchIcon={true} />
            </View>
          </Animated.View>

          {/* SEARCH BAR */}
          <Animated.View style={{ height: S_HEIGHT, transform: [{ translateY: searchBarTranslateY }] }}>
            <AnimatedSearchBar />
          </Animated.View>
        </View>

        <Animated.FlatList
          data={[]}
          renderItem={null}
          ListHeaderComponent={Header}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffset } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: L_HEIGHT + S_HEIGHT, paddingBottom: 100 }}
          keyExtractor={() => 'dummy'}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="black"
            />
          }
        />

        <Footer />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  locationWrapper: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  locationIcon: { marginRight: 6, marginTop: 2 },
  locationTextWrapper: { flex: 1, paddingRight: 14 },
  locationRow: { flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  cityText: {
    fontSize: 14,
    color: Colors.dark1,
    fontWeight: 'bold',
    fontFamily: 'Manrope-Bold',
  },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  subText: {
    fontSize: 10,
    color: Colors.dark2,
    fontWeight: '300',
    fontFamily: 'Manrope',
  },
  notificationIcon: { marginRight: 20 },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
});
