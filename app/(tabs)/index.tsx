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
import { addressModalRef } from "./_layout";
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
import AddressSelectionModalize from '../';

import { useAddress } from '../AddressContext'; // ✅ NEW — use selectedAddress context

const HEADER_HEIGHT = 70;
const SCROLL_THRESHOLD = 5;

export default function Home() {
  const router = useRouter();
  const navigation = useNavigation();

  // ---------------- CONTEXT ----------------
  const { selectedAddress, setSelectedAddress } = useAddress(); // <-- now from context

  // ---------------- LOCAL STATES ----------------
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [newArrivalsProducts, setNewArrivalsProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollOffset = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  // ------------------- LOAD DATA -------------------
  const loadInitialData = useCallback(async () => {
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
    loadInitialData();
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
        <ParentCategoryIndexing products={newArrivalsProducts} />
      </>
    ),
    [newArrivalsProducts, recentlyViewed],
  );

  if (loading) return <Loader />;

  return (
    <>
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

            <TouchableOpacity onPress={() => {
              try {
                addressModalRef.current?.open();
              } catch (err) {
                console.log("Modal open error:", err);
              }
            }} 
            style={{paddingVertical:20}}>
              <View
                style={styles.locationTextWrapper}
              >
                <View style={styles.locationRow}>
                  <Text style={styles.cityText} numberOfLines={1}>
                    {selectedAddress
                      ? [
                        selectedAddress.addressLine1,
                        selectedAddress.area,
                        selectedAddress.city,
                      ]
                        .map((v) => v?.trim())
                        .filter(Boolean)
                        .join(', ')
                      : 'Select Location'}
                  </Text>
                </View>

                <View style={styles.subRow}>
                  <Text style={styles.subText} numberOfLines={1}>
                    {selectedAddress
                      ? `${selectedAddress.addressType}`
                      : 'Explore trending styles around you!'}
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
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyExtractor={() => 'dummy'}
        />

        <PopupCart isTabBarVisible={isTabBarVisible} />
        <Footer />
      </View>
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
