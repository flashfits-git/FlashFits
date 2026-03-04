import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';

import Loader from '@/components/Loader/Loader';
import { useNavigation } from '@react-navigation/native';
import Footer from '../../components/Footer';

import HeaderWishlist from '../../components/WhishlistComponents/HeaderWishlist';
import WhishlistCard from '../../components/WhishlistComponents/WhishlistCard';
import { useWishlist } from '../WishlistContext';


export default function WishlistScreen() {
  const navigation = useNavigation<any>();
  const { wishlistItems, loading, refreshWishlist } = useWishlist();

  const [refreshing, setRefreshing] = useState(false);

  // Scroll logic refs
  const scrollOffset = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const [showStickySearch, setShowStickySearch] = useState(false);

  const formattedProducts = React.useMemo(() => {
    return wishlistItems.map(w => ({
      wishlistId: w._id,
      addedAt: w.addedAt,
      ...w.product,
    })) || [];
  }, [wishlistItems]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshWishlist();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const listener = scrollOffset.addListener(({ value }) => {
      const clampedValue = Math.max(0, value);
      setShowStickySearch(clampedValue > 60);

      if (clampedValue < currentOffset.current - 5) {
        setIsTabBarVisible(true);
        navigation.setOptions({
          tabBarStyle: {
            position: "absolute",
            height: Platform.OS === "ios" ? 80 : 90,
            backgroundColor: "#fff",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            paddingTop: Platform.OS === "ios" ? 18 : 18,
            paddingBottom: Platform.OS === "ios" ? 10 : 10,
          },
        });
      }
      else if (clampedValue > currentOffset.current + 5 && clampedValue > 3) {
        setIsTabBarVisible(false);
        navigation.setOptions({ tabBarStyle: { display: "none" } });
      }
      currentOffset.current = clampedValue;
    });

    return () => scrollOffset.removeListener(listener);
  }, [navigation, scrollOffset]);

  if (loading && wishlistItems.length === 0) return <Loader />;

  return (
    <View style={styles.container}>
      <HeaderWishlist />
      <Animated.FlatList
        data={[1]}
        keyExtractor={() => "wishlist-scroll"}
        renderItem={() => null}
        ListHeaderComponent={
          <WhishlistCard product={formattedProducts} />
        }
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffset } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
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
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  stickySearch: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "#fff",
    elevation: 4,
    zIndex: 20,
  }
});
