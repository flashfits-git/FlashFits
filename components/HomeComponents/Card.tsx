import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import jfrnfr from '../../assets/images/2.jpg';
import fmg from '../../assets/images/4.jpg';
import { useNavigation } from 'expo-router';

// Dummy Data
const dressData = [
  {
    image: jfrnfr,
    title: "Yellow Quirky Fit Flare Maxi Dress",
    price: "1299",
    oldPrice: "1379",
    discount: "6%",
    rating: "4.7",
    delivery: "5 - 6 Days",
    offerPrice: "1174",
  },
  {
    image: fmg,
    title: "Yellow Bodycon Maxi Dress",
    price: "1349",
    oldPrice: "1459",
    discount: "8%",
    rating: "4.6",
    delivery: null,
    offerPrice: "1224",
  },
];

// DressCard Component
const DressCard = ({ image, title, price, oldPrice, discount, rating, delivery, offerPrice }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={image} style={styles.image} />
        <View style={styles.ratingContainer}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.rating}>{rating}</Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{price}</Text>
        <Text style={styles.oldPrice}>₹{oldPrice}</Text>
        <Text style={styles.discount}>{discount} off</Text>
      </View>
      <Text style={styles.offerText}>
        Get it at ₹{offerPrice}
        <Text style={styles.code}> with <Text style={styles.codeBold}>frst15</Text></Text>
      </Text>
    </View>
  );
};

// Main Card List Component
export default function Card() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {dressData.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.touchable}
          onPress={() => navigation.navigate('(stack)/ProductDetail/productdetailpage ')}
        >
          <DressCard {...item} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  touchable: {
    width: '48%',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    height: 250,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  star: {
    fontSize: 10,
    color: '#FFD700',
    padding: 2,
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
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
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
  offerText: {
    fontSize: 13,
    marginTop: 4,
    color: '#1aaf1a',
  },
  code: {
    color: '#000',
  },
  codeBold: {
    fontWeight: 'bold',
  },
});
