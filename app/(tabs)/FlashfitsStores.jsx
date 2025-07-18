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
import {getMerchants} from '../api/merchatApis/getMerchantHome'
import Loader from '@/components/Loader/Loader';

// import { useCart } from './Context';

export default function FlashfitsStores() {
  // const [selectedMainCategory, setSelectedMainCategory] = useState('mens');
  // const [selectedSideCategory, setSelectedSideCategory] = useState('1');
  const navigation = useNavigation();
  const scrollOffset = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const [showStickySearch, setShowStickySearch] = useState(false);
  // const { cartCount } = useCart();

  const [loading, setLoading] = useState(true);
  const [merchants, setMerchants] = useState([]);
  
    useEffect(() => {
    const loadCategories = async () => {
    setLoading(true);
    try {
      const merchantResponse = await getMerchants();
      // console.log('Returned merchants:', merchantResponse);
      setMerchants(Array.isArray(merchantResponse.merchants) ? merchantResponse.merchants : []);
    } catch (err) {
      console.error("Error loading categories or merchants", err);
    } finally {
      setLoading(false);
    }
  };
  loadCategories();
}, []);

  useEffect(() => {
    const listener = scrollOffset.addListener(({ value }) => {
      const clampedValue = Math.max(0, value);

      // Show sticky search bar after scroll passes 60px
      setShowStickySearch(clampedValue > 60);

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
        navigation.setOptions({ tabBarStyle: { display: 'none' } });
      }

      currentOffset.current = clampedValue;
    });

    return () => {
      scrollOffset.removeListener(listener);
    };
  }, []);

  if (loading) return <Loader />;


  return (
    <View style={styles.container}>
      <NearbyHeaderBar  />

      {/* Sticky search bar appears only when scrolled past original */}
      {showStickySearch && (
        <View style={styles.stickySearchContainer}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={18} color="#888" style={styles.searchIcon} />
            <TextInput
              placeholder="Search FlashFits Enabled Stores"
              placeholderTextColor="#888"
              style={styles.searchInput}
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
        {/* Normal search bar (scrolls with content) */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={18} color="#888" style={styles.searchIcon} />
          <TextInput
            placeholder="Search FlashFits Enabled Stores"
            placeholderTextColor="#888"
            style={styles.searchInput}
          />
        </View>

        <Text style={styles.sectionTitle}>Stores Near You</Text>
        <NearbyStores merchantData={merchants} />

        <Text style={styles.sectionTitle}>Popular Stores</Text>
        <PopularStores merchantData={merchants} />
      </ScrollView>

      <PopupCart isTabBarVisible={isTabBarVisible} />
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
