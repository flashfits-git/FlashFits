import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Animated, Platform} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import frfef from '../../assets/images/3.jpg';
import { useNavigation } from 'expo-router';
import PopupCart from '../../components/HomeComponents/PopupCart';



const DressCard = ({ image, title, price, oldPrice, discount, rating }) => (
  <View style={styles.card}>
    <View style={styles.imageWrapper}>
      <Image source={image} style={styles.image} />
      <View style={styles.promoTag}>
        <Text style={styles.promoText}>15% off - FIRST15</Text>
      </View>
      <View style={styles.ratingTag}>
        <Text style={styles.ratingText}>{rating} ★</Text>
      </View>
    </View>

    <View style={styles.info}>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{price}</Text>
        {oldPrice && <Text style={styles.oldPrice}>₹{oldPrice}</Text>}
        {discount && <Text style={styles.discount}>{discount} off</Text>}
        <TouchableOpacity style={styles.trashIcon}>
          <AntDesign name="delete" size={18} color="#0093d7" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.viewBtn}>
        <Text style={styles.viewBtnText}>View</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function WhishlistCard() {
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




  const products = [
    { id: '1', image: frfef, title: 'Black T-Shirt', price: '459', oldPrice: '479', discount: '5%', rating: '4.8' },
    { id: '2', image: frfef, title: 'Red Dress', price: '899', rating: '4.8' },
    { id: '3', image: frfef, title: 'Blue Hoodie', price: '999', rating: '4.9' },
    { id: '4', image: frfef, title: 'Green Kurti', price: '599', rating: '4.7' },
    { id: '5', image: frfef, title: 'Yellow Top', price: '699', rating: '4.6' },
    { id: '6', image: frfef, title: 'White Shirt', price: '749', rating: '4.5' },
    { id: '7', image: frfef, title: 'White Shirt', price: '749', rating: '4.5' },
  ];
  return (
    <View style={styles.container}>
<FlatList
  data={products}
  keyExtractor={(item) => item.id}
  numColumns={2}
  columnWrapperStyle={styles.cardGrid}
  contentContainerStyle={styles.listContent}
  showsVerticalScrollIndicator={false}
  renderItem={({ item }) => <DressCard {...item} />}
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollOffset } } }],
    { useNativeDriver: false }
  )}
  scrollEventThrottle={16}
/>
      <PopupCart isTabBarVisible={isTabBarVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    backgroundColor: '#fff',
    padding: 10,
  },
  cardGrid: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: '#eee',
    borderWidth: 1,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  promoTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  promoText: {
    fontSize: 11,
    color: '#0093d7',
    fontWeight: '600',
  },
  ratingTag: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    elevation: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0093d7',
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  oldPrice: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  discount: {
    fontSize: 12,
    color: 'red',
    marginLeft: 6,
  },
  trashIcon: {
    marginLeft: 'auto',
  },
  viewBtn: {
    backgroundColor: '#90d5ff',
    borderRadius: 5,
    paddingVertical: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  viewBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
