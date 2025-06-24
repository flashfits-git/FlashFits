import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // ✅ Corrected import

// Card UI Component
const DressCard = ({ product, onPress }) => {
  const variant = product.variants?.[0];
  const image = { uri: variant?.mainImage?.url || '' };
  const discount = variant?.discount || 0;
  const price = product.price;
  const oldPrice = product.mrp;
  const rating = product.ratings;

  return (
    <TouchableOpacity style={styles.touchable} onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.imageWrapper}>
          <Image source={image} style={styles.image} />
          <View style={styles.ratingContainer}>
            <Text style={styles.star}>{'\u2605'}</Text>
            <Text style={styles.rating}>{rating}</Text>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{price}</Text>
          <Text style={styles.oldPrice}>₹{oldPrice}</Text>
          <Text style={styles.discount}>{discount}% off</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Wrapper Component with navigation
export default function Card({ product }) {
  const router = useRouter(); // ✅ Use expo-router's hook

  const handlePress = () => {
    console.log('Navigating to product:', product.name); // Optional: Debug log
    router.push({
      pathname: '(stack)/ProductDetail/productdetailpage',
      params: { item: JSON.stringify(product) },
    });
  };

  return <DressCard product={product} onPress={handlePress} />;
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
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    height: 250,
    width: '100%',
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
  },
  star: {
    fontSize: 10,
    color: '#90d5ff',
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
    fontFamily: 'Montserrat',
    paddingHorizontal: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Montserrat',
  },
  oldPrice: {
    fontSize: 12,
    color: '#777',
    textDecorationLine: 'line-through',
    marginLeft: 6,
    fontFamily: 'Montserrat',
  },
  discount: {
    fontSize: 12,
    color: '#ff6666',
    marginLeft: 6,
  },
});
