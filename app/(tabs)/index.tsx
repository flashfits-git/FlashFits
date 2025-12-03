import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Platform
} from 'react-native';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { Modalize } from 'react-native-modalize';
import * as SecureStore from 'expo-secure-store';
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
import { getAddresses } from '../api/productApis/cartProduct';

const HEADER_HEIGHT = 70;
const SCROLL_THRESHOLD = 5;

export default function Home() {
  const addressModalRef = useRef(null);
  const router = useRouter();
  const [addresses, setAddresses] = useState({ addresses: [] });
  const [addressLoading, setAddressLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const [searchQuery] = useState('');
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastOffsetY = useRef(0);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [newArrivalsProducts, setNewArrivalsProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollOffset = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);
  const [showStickySearch, setShowStickySearch] = useState(false);

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

      if (storedAddress) {
        setSelectedAddress(JSON.parse(storedAddress));
        console.log(selectedAddress, 'selectedAddress');

      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const openAddressModal = async () => {
    setAddressLoading(true);
    try {
      const res = await getAddresses();
      console.log(res, 'res');
      setAddresses(res || []);
    } catch (err) {
      console.log("Error fetching addresses", err);
    } finally {
      setAddressLoading(false);
    }
    addressModalRef.current?.open();

  };

  const selectAddress = async (item: any) => {
    setSelectedAddress(item);
    await SecureStore.setItemAsync("selectedAddress", JSON.stringify(item));
    addressModalRef.current?.close();
  };

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    const listener = scrollOffset.addListener(({ value }) => {
      const clampedValue = Math.max(0, value);

      // --- Show sticky search bar ---
      setShowStickySearch(clampedValue > 60);

      // --- Tab bar show/hide logic ---
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
      } else if (
        clampedValue > currentOffset.current + 5 &&
        clampedValue > 3
      ) {
        setIsTabBarVisible(false);
        navigation.setOptions({ tabBarStyle: { display: 'none' } });
      }

      currentOffset.current = clampedValue;
    });

    return () => {
      scrollOffset.removeListener(listener);
    };
  }, []);


  // ------------------- TAB BAR SCROLL -------------------
  const handleScroll = useCallback(
    Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
      useNativeDriver: false,
      listener: (event: any) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        const diff = currentOffset - lastOffsetY.current;

        if (Math.abs(diff) < SCROLL_THRESHOLD) return;

        const visible = diff < 0 || currentOffset <= 0;
        if (visible !== isTabBarVisible) setIsTabBarVisible(visible);

        lastOffsetY.current = currentOffset;
      },
    }),
    [isTabBarVisible, scrollY]
  );

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
    <>
      <View style={styles.container}>
        <Banner />

        {/* Fixed Header */}
        <View style={styles.header}>
          <View style={styles.locationWrapper}>
            <Ionicons
              name="location-outline"
              size={30}
              color="black"
              style={styles.locationIcon}
            />

            <View style={styles.locationTextWrapper}>
              <View style={styles.locationRow}>
                <Text style={styles.cityText} numberOfLines={1}>
                  {selectedAddress
                    ? [selectedAddress.addressLine1, selectedAddress.area, selectedAddress.city]
                      .map(v => v?.trim())     // <<< REMOVE extra spaces
                      .filter(Boolean)
                      .join(', ')
                    || 'Location'
                    : 'Select Location'}
                </Text>
              </View>
              <View style={styles.subRow}>
                <Text style={styles.subText} numberOfLines={1}>
                  {selectedAddress
                    ? `${selectedAddress.addressType || 'Address'}`
                    : 'Explore trending styles around you!'}
                </Text>

                <TouchableOpacity onPress={openAddressModal}>
                  <Ionicons name="chevron-down-outline" size={16} color="black" />
                </TouchableOpacity>
              </View>
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
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffset } } }],
            { useNativeDriver: false }
          )}
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
      <Modalize ref={addressModalRef} adjustToContentHeight>
        <View style={{ padding: 20, marginBottom: 12 }}>
          {addressLoading ? (
            <ActivityIndicator size="large" color="black" />

          ) : addresses?.addresses.length === 0 ? (
            <>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 15 }}>
                No Address Found
              </Text>
              <TouchableOpacity
                onPress={() => {
                  addressModalRef.current?.close();
                  router.push('/(stack)/SelectLocationScreen');
                }}
                style={{
                  backgroundColor: '#000',
                  paddingVertical: 12,
                  borderRadius: 10,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                  Add Address
                </Text>
              </TouchableOpacity>
            </>

          ) : (

            // =========== ADDRESS LIST ===========
            <View style={{ padding: 10, width: '100%' }}>

              {/* Title + Button in same row */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 15,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                  }}
                >
                  Select Address
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    addressModalRef.current?.close();
                    router.push('/(stack)/SelectLocationScreen');
                  }}
                  style={{
                    backgroundColor: '#000',
                    paddingVertical: 8,
                    paddingHorizontal: 15,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
                    Add Address
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Address List */}
              {addresses.addresses.map((item) => (
                <TouchableOpacity
                  key={item._id}
                  onPress={() => selectAddress(item)}
                  style={{
                    padding: 15,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    marginBottom: 12,
                    backgroundColor: '#fafafa',
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '700' }}>{item.addressType}</Text>

                  <Text style={{ fontSize: 13, color: '#555', marginTop: 3 }}>
                    {item.addressLine1}
                  </Text>

                  <Text style={{ fontSize: 13, marginTop: 5 }}>
                    {item.name} • {item.phone}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

        </View>
        <View style={{ marginBottom: 50 }} />

      </Modalize>

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
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  locationWrapper: { flexDirection: 'row', alignItems: 'center', flex: 1 },
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
  locationIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  timeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  timeText1: { color: '#fff', fontSize: 20, fontWeight: '600' },
  locationTextWrapper: { flex: 1, paddingRight: 14 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  cityText: {
    fontSize: 14,
    color: Colors.dark1,
    marginRight: 8,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // optional spacing
  },
  subText: {
    fontSize: 10,
    color: Colors.dark2,
    fontWeight: '300',
    fontFamily: 'Montserrat',
  },
  notificationIcon: { marginRight: 20 },
});
