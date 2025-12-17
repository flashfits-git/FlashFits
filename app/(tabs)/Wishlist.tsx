import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Loader from '@/components/Loader/Loader';
import Footer from '../../components/Footer';

import WhishlistCard from '../../components/WhishlistComponents/WhishlistCard';
import HeaderWishlist from '../../components/WhishlistComponents/HeaderWishlist';
import { getMyWishlist } from '../api/productApis/products';

export default function WishlistScreen() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [newArrivalsProducts, setNewArrivalsProducts] = useState([]);

  // Scroll logic refs
  const scrollOffset = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const [showStickySearch, setShowStickySearch] = useState(false);

  useEffect(() => {
    getNewArrivalsProducts();
  }, []);

  const getNewArrivalsProducts = async () => {
    try {
      const response = await getMyWishlist();
      console.log(response.data, 'responceresponceresponceresponceresponce');

      setNewArrivalsProducts(response?.data?.map(w => ({
        wishlistId: w._id,
        addedAt: w.addedAt,
        ...w.product,     // 👈 flatten product
      })));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // TAB BAR SCROLL LOGIC
  // ------------------------------
  useEffect(() => {
    const listener = scrollOffset.addListener(({ value }) => {
      const clampedValue = Math.max(0, value);

      setShowStickySearch(clampedValue > 60);

      // Scroll up → show tab bar
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

      // Scroll down → hide tab bar
      else if (clampedValue > currentOffset.current + 5 && clampedValue > 3) {
        setIsTabBarVisible(false);
        navigation.setOptions({ tabBarStyle: { display: "none" } });
      }

      currentOffset.current = clampedValue;
    });

    return () => scrollOffset.removeListener(listener);
  }, []);

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <HeaderWishlist />
      <Animated.FlatList
        data={[1]}               // <-- only one item to allow scrolling
        keyExtractor={() => "wishlist-scroll"}
        renderItem={() => null} // no items rendered
        ListHeaderComponent={
          <WhishlistCard product={newArrivalsProducts} /> // unchanged
        }
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffset } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
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
