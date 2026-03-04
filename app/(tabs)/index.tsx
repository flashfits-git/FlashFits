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
  Easing,
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
import { fetchnewArrivalsProductsData, getMyWishlist } from '../api/productApis/products';
import { getPreviouslyViewed } from '../utilities/localStorageRecentlyViewd';

const HEADER_HEIGHT = 70;
const SCROLL_THRESHOLD = 5;
const ANIMATION_DURATION = 700;

export default function Home() {
  const router = useRouter();
  const navigation = useNavigation();

  const { selectedAddress, setSelectedAddress } = useAddress(); // <-- now from context

  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [newArrivalsProducts, setNewArrivalsProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollOffset = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const [isActive, setIsActive] = useState(true)
  const [refreshing, setRefreshing] = useState(false);
  const [isServiceable, setIsServiceable] = useState<boolean | null>(null);
  const [hasError, setHasError] = useState(false);

  // ------------------- HEADER ANIMATION -------------------
  const headerAnim = useRef(new Animated.Value(0)).current; // 0 = expanded, 1 = collapsed
  const isHeaderCollapsed = useRef(false);

  const collapseHeader = useCallback(() => {
    if (isHeaderCollapsed.current) return;
    isHeaderCollapsed.current = true;
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [headerAnim]);

  const expandHeader = useCallback(() => {
    if (!isHeaderCollapsed.current) return;
    isHeaderCollapsed.current = false;
    Animated.timing(headerAnim, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [headerAnim]);

  // Animated values derived from headerAnim
  const headerHeight = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [HEADER_HEIGHT, 0],
    extrapolate: 'clamp',
  });

  const headerOpacity = headerAnim.interpolate({
    inputRange: [0, 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerTranslateY = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadInitialData(),
        syncWishlistVariants(),
      ]);
    } catch (e) {
      console.error('Refresh error:', e);
    } finally {
      setRefreshing(false);
    }
  }, [loadInitialData, syncWishlistVariants]);

  useEffect(() => {
    return () => setIsActive(false);
  }, []);

  // ------------------- LOAD DATA -------------------
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [products, viewed, storedAddress] = await Promise.all([
        fetchnewArrivalsProductsData(),
        getPreviouslyViewed(),
        SecureStore.getItemAsync('selectedAddress'),
      ]);
      // console.log(viewed, 'viewsss');

      setNewArrivalsProducts(products || []);
      setRecentlyViewed(viewed || []);

      // Set address from SecureStore to Context 
      if (storedAddress) {
        const parsed = JSON.parse(storedAddress);
        setSelectedAddress(parsed);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setHasError(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isActive) return;

    loadInitialData();
  }, []);

  useEffect(() => {
    syncWishlistVariants();
  }, [syncWishlistVariants]);

  const syncWishlistVariants = useCallback(async () => {
    try {
      const response = await getMyWishlist();
      const wishlist = response?.data || [];

      const wishlistMap = wishlist.reduce((acc: any, item: any) => {
        const variantId = item?.product?.variant?._id;
        const wishlistItemId = item?._id;
        if (variantId && wishlistItemId) {
          acc[String(variantId)] = String(wishlistItemId);
        }
        return acc;
      }, {});

      await SecureStore.setItemAsync('Wishlist', JSON.stringify(wishlistMap));
    } catch (e) {
      console.error(e);
    }
  }, []);



  // ------------------- TAB BAR + HEADER SCROLL -------------------
  useEffect(() => {
    const listener = scrollOffset.addListener(({ value }) => {
      const clampedValue = Math.max(0, value);
      const delta = clampedValue - currentOffset.current;

      // Scrolling DOWN (finger moves up) → collapse header + hide tab bar
      if (delta > SCROLL_THRESHOLD) {
        collapseHeader();
        setIsTabBarVisible(false);
        navigation.setOptions({ tabBarStyle: { display: 'none' } });
      }
      // Scrolling UP (finger moves down) → expand header + show tab bar
      else if (delta < -SCROLL_THRESHOLD) {
        expandHeader();
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
  }, [collapseHeader, expandHeader]);

  // ------------------- HEADER -------------------
  const Header = useMemo(
    () => (
      <>
        <Carousel />
        <HomeCategorySwitcherShops />
        <RecentlyViewed product={recentlyViewed} />
        <CategorySwitcher />
        <ParentCategoryIndexing products={newArrivalsProducts} />
      </>
    ),
    [newArrivalsProducts, recentlyViewed],
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
        {/* COLLAPSIBLE LOCATION HEADER */}
        <Animated.View
          style={[
            styles.header,
            {
              height: headerHeight,
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslateY }],
              overflow: 'hidden',
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

        {/* SEARCH BAR — always visible */}
        <AnimatedSearchBar />

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
          contentContainerStyle={{ paddingBottom: 100 }}
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
    paddingHorizontal: 4,
    height: HEADER_HEIGHT,
    backgroundColor: '#fff',
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
});
