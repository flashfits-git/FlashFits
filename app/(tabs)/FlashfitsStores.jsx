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
import hgfgfh from '../(stack)/ShopDetails/StoreDetailPage'

export default function FlashfitsStores() {
  const [selectedMainCategory, setSelectedMainCategory] = useState('mens');
  const [selectedSideCategory, setSelectedSideCategory] = useState('1');
  const navigation = useNavigation();
  const scrollOffset = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);


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
      <NearbyHeaderBar />
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
                    placeholder="Search FlashFit Enabled Stores"
                    placeholderTextColor="#888"
                    style={styles.searchInput}
                  />
                  {/* <TouchableOpacity style={styles.iconContainer}>
                    <Icon name="sliders" size={22} color="#000" />
                  </TouchableOpacity> */}
                </View>
        <Text style={styles.sectionTitle}>Stores Near You</Text>
        <NearbyStores />
        

        <Text style={styles.sectionTitle}>Popular Stores</Text>
        <PopularStores />
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
    fontFamily:'Montserrat'

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
  alignSelf: 'center', // center the bar in parent
  marginVertical: 12,  // optional spacing around the bar
},
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
});
