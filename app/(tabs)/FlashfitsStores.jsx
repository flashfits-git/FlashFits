import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  TextInput,
  TouchableOpacity
} from 'react-native';
import NearbyStores from '../../components/NearByShopsComponents/NearbyStores';
import NearbyHeaderBar from '../../components/NearByShopsComponents/NearbyHeaderBar';
import PopularStores from '../../components/NearByShopsComponents/PopularStores';
import { useNavigation } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import React, { useState, useRef, useEffect } from 'react';
import PopupCart from '../../components/HomeComponents/PopupCart';
import { getMerchants, getProductsBatch } from '../api/merchatApis/getMerchantHome';
import Loader from '@/components/Loader/Loader';
import Footer from '../../components/Footer';

export default function FlashfitsStores() {
  const navigation = useNavigation();
  const scrollOffset = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [merchants, setMerchants] = useState([]);
  const [productsByMerchant, setProductsByMerchant] = useState({}); // New state for batch products
  const [searchQuery, setSearchQuery] = useState('');
  // console.log(merchants,'merchantsmerchantsmerchantsmerchants');


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch merchants
        const merchantResponse = await getMerchants();
        const merchantsArray = Array.isArray(merchantResponse.merchants) ? merchantResponse.merchants : [];
        setMerchants(merchantsArray);

        // Extract unique merchant IDs and fetch products in batch
        const merchantIds = [...new Set(merchantsArray.map(m => m._id))]; // Dedupe IDs
        if (merchantIds.length > 0) {
          const productsResponse = await getProductsBatch(merchantIds);
          // console.log(productsResponse,'productsResponse');
          setProductsByMerchant(productsResponse || {});
        }
      } catch (err) {
        console.error("Error loading merchants or products", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const listener = scrollOffset.addListener(({ value }) => {
      const clampedValue = Math.max(0, value);
      setShowStickySearch(clampedValue > 60);

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
      } else if (clampedValue > currentOffset.current + 5 && clampedValue > 3) {
        setIsTabBarVisible(false);
        navigation.setOptions({ tabBarStyle: { display: 'none' } });
      }
      currentOffset.current = clampedValue;
    });



    return () => {
      scrollOffset.removeListener(listener);
    };
  }, []);

  const filteredMerchants = merchants.filter((item: any) => {
    const query = searchQuery.toLowerCase();

    const shopName = item?.shopName?.toLowerCase() || '';
    const category = item?.category?.toLowerCase() || '';
    const city = item?.address?.city?.toLowerCase() || '';

    return (
      shopName.includes(query) ||
      category.includes(query) ||
      city.includes(query)
    );
  });

  // console.log(filteredMerchants, 'filteredMerchantsfilteredMerchantsfilteredMerchants');


  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <NearbyHeaderBar />

      {showStickySearch && (
        <View style={styles.stickySearchContainer}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={18} color="#888" style={styles.searchIcon} />
            <TextInput
              placeholder="Search FlashFits Enabled Stores"
              placeholderTextColor="#888"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffset } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.searchContainer}>
          <Icon name="search" size={18} color="#888" style={styles.searchIcon} />
          <TextInput
            placeholder="Search FlashFits Enabled Stores"
            placeholderTextColor="#888"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={styles.sectionTitle}>Brands Near You</Text>
        {/* <NearbyStores merchantData={merchants} productsByMerchant={productsByMerchant} /> */}
        <NearbyStores
          merchantData={filteredMerchants}
          productsByMerchant={productsByMerchant}
        />
        <Text style={styles.sectionTitle}>Popular Brands</Text>

        <PopularStores
          merchantData={filteredMerchants}
          productsByMerchant={productsByMerchant}
        />
        {/* <NearbyStores merchantData={merchants} productsByMerchant={productsByMerchant} /> */}
      </ScrollView>

      {/* <PopupCart isTabBarVisible={isTabBarVisible} /> */}
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
    marginTop: 16,
    marginLeft: 20,
    marginBottom: 12,
    fontFamily: 'Montserrat',
    fontSize: 20,
    fontWeight: '800',
    color: '#1c1c1c',
    letterSpacing: -0.2,
  },
  iconContainer: {
    marginLeft: 'auto',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    width: '90%',
    alignSelf: 'center',
    marginVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    fontFamily: 'Montserrat',
  },
  stickySearchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 70, // adjust based on NearbyHeaderBar height
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: '#fff',
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    elevation: 3,
  },
});
