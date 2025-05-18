import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
// import PopularProducts from '../../components/HomeComponents/PopularProducts'; // Fixed typo
import PopupCart from '../../components/HomeComponents/PopupCart';
import RecentlyViewed from '../../components/HomeComponents/RecentlyViewed';
import Card from '../../components/HomeComponents/Card'
import Carousel from '@/components/HomeComponents/Carousel';
import Banner from '@/components/HomeComponents/Banner';
import ParentCategoryIndexing from '@/components/HomeComponents/ParentCategoryIndexing';
import SearchCartProfileButton  from '../../components/FlexibleComponents/SearchCartProfileButton';


// import TitleCard from '@/components/HomeComponents/TitleCard'



export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
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
            // bottom: 3,
            // marginLeft: 12,
            // marginRight: 12,
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
            // margin: 8,
           
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


        <Banner/>
        <View style={styles.header}>
          <View style={styles.locationWrapper}>
            <View style={styles.locationIcon}>
              <Ionicons name="location-outline" size={20} color="#091f5b" />
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
        {/* List */}
        <Animated.FlatList
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffset } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          ListHeaderComponent={
            <>
            <Carousel/>
            <RecentlyViewed />
            <ParentCategoryIndexing/>
            </>
          }
          ListFooterComponent={<View style={{ height: 20 }} />}
          data={[{ key: 'popular-products' }]}
          renderItem={() =>
            <>             
            <Card/>            
            </> 
            }
          keyExtractor={(item) => item.key}
        />
      {/* </LinearGradient> */}
      <PopupCart isTabBarVisible={isTabBarVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding:4,
    height:70
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
    marginRight: 8,
  },
  locationTextWrapper: {
    paddingRight:14,
    width: 200,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#091f5b',
    marginRight: 8,
    maxWidth: 200,
  },
  subText: {
    fontSize: 12,
    color: '#b4bcc4',
    lineHeight: 20,
  },
  notificationIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  
  flx: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12, // Spacing between icons (alternative: use marginRight on icon)
  },  
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 10,
    justifyContent: 'space-between',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 44,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: 'black',
    marginLeft: 8,
  },
  filterButton: {
    backgroundColor: '#a8cdff',
    borderRadius: 16,
    padding: 10,
    marginLeft: 8,
  },
});