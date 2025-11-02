import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Already imported

const DressCard = ({ product, onPress }) => {
  const imageUrl = product?.images?.[0]?.url;



















  
  return (
    <TouchableOpacity style={[styles.cardContainer, styles.card]} onPress={onPress}>
      <View style={styles.shadowWrapper}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {product.ratings || '0.0'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={1}>
          {product?.name || 'Unnamed Product'}
        </Text>
        <Text style={styles.deliveryText}>13 mins</Text>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{product?.price || '0'}</Text>
        {product?.mrp && product?.mrp > product?.price ? (
          <Text style={styles.oldPrice}>₹{product?.mrp}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '48%',
    // marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },  shadowWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    borderRadius: 15,
    marginBottom: 10,
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
  ratingText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Montserrat',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginRight: 6,
  },
  deliveryText: {
    fontSize: 12,
    color: '#999',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  oldPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
});

export default function Card({ product }) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '(stack)/ProductDetail/productdetailpage',
      params: {
        id: product?._id,
        variantId: product?.variantId,
      },
    });
  };

  return <DressCard product={product} onPress={handlePress} />;
} 