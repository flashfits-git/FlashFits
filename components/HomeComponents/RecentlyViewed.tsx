import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import jfrnfr from '../../assets/images/2.jpg';
import fmg from '../../assets/images/3.jpg';
import erv from '../../assets/images/54tg.jpeg';
import fg from '../../assets/images/33e.avif';

const { width } = Dimensions.get('window');

// Dummy data array
const dressData = [
  { id: 1, image: jfrnfr, title: "Quirky Fit Flare Dress", price: "1299", oldPrice: "1379", discount: "6%", rating: "4.7" },
  { id: 2, image: erv, title: "Bodycon Maxi Dress", price: "1349", oldPrice: "1459", discount: "8%", rating: "4.6" },
  { id: 3, image: fg, title: "Ruched Bodycon Dress", price: "1199", oldPrice: "1399", discount: "14%", rating: "4.5" },
  { id: 4, image: fmg, title: "Wrap Midi Dress", price: "1499", oldPrice: "1599", discount: "6%", rating: "4.8" },
];

const DressCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.ratingContainer}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{item.price}</Text>
        {/* <Text style={styles.oldPrice}>₹{item.oldPrice}</Text> */}
        {/* <Text style={styles.discount}>{item.discount} off</Text> */}
      </View>
    </TouchableOpacity>
  );
};

export default function ImageCardHome() {
  const scrollRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [direction, setDirection] = useState(1);
  const navigation = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const newX = scrollX + direction * 170;
        scrollRef.current.scrollTo({ x: newX, animated: true });
        setScrollX(newX);

        if (newX >= 170 * (dressData.length - 1)) setDirection(-1);
        if (newX <= 0) setDirection(1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [scrollX, direction]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        scrollEventThrottle={16}
        onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
      >
        {dressData.map((item) => (
          <DressCard
            key={item.id}
            item={item}
            onPress={() => navigation.navigate('(stack)/ProductDetail/productdetailpage', { dress: item })}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    // paddingBottom: 2,
    paddingTop: 15,
  },
  card: {
    margin: 5,
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    height: 200,
    width: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  ratingContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    opacity: 0.8,
  },
  star: {
    fontSize: 10,
    color: '#90d5ff',
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    marginVertical: 6,
    color: '#333',
    paddingHorizontal: 6,
            fontFamily: 'Montserrat',

  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingBottom: 10,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
            fontFamily: 'Montserrat',

  },
  oldPrice: {
    fontSize: 12,
    color: '#777',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  discount: {
    fontSize: 12,
    color: 'red',
    marginLeft: 6,
  },
});
