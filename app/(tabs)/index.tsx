import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { RefreshControl } from 'react-native';
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
import { getMyWishlist } from '../api/productApis/products'
import { useAddress } from '../AddressContext'; // ✅ NEW — use selectedAddress context'
import CategorySwitcher from '@/components/HomeComponents/CategorySwitcher';
import { GenderProvider } from '@/app/GenderContext'

const HEADER_HEIGHT = 70;
const SCROLL_THRESHOLD = 5;

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

  // ------------------- TAB BAR SCROLL -------------------
  useEffect(() => {
    const listener = scrollOffset.addListener(({ value }) => {
      const clampedValue = Math.max(0, value);

      if (clampedValue < currentOffset.current - 5) {
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
      } else if (clampedValue > currentOffset.current + 5) {
        setIsTabBarVisible(false);
        navigation.setOptions({ tabBarStyle: { display: 'none' } });
      }

      currentOffset.current = clampedValue;
    });

    return () => scrollOffset.removeListener(listener);
  }, []);

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

  return (
    <>
      <GenderProvider>
        <View style={styles.container}>
          <Banner />

          {/* FIXED HEADER */}
          <View style={styles.header} >
            <View style={styles.locationWrapper}>
              <Ionicons
                name="location-outline"
                size={30}
                color="black"
                style={styles.locationIcon}
              />

              <TouchableOpacity onPress={() => router.push("/(stack)/SavedAddressesScreen")}
                style={{ paddingVertical: 20 }}>
                <View
                  style={styles.locationTextWrapper}
                >
                  <View style={styles.locationRow}>
                    <Text style={styles.cityText} numberOfLines={1}>
                      {selectedAddress?.addressType === 'Non-serviceable'
                        ? 'Oops! We don’t deliver here yet' // or use selectedAddress.fullMessage
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
                        ? 'We’ll be there soon'
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
              <SearchCartProfileButton />
            </View>
          </View>

          {/* MAIN CONTENT */}
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


          {/* <PopupCart isTabBarVisible={isTabBarVisible} /> */}
          <Footer />
        </View>
      </GenderProvider>
    </>
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
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  cityText: {
    fontSize: 14,
    color: Colors.dark1,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  subText: {
    fontSize: 10,
    color: Colors.dark2,
    fontWeight: '300',
    fontFamily: 'Montserrat',
  },
  notificationIcon: { marginRight: 20 },
});
