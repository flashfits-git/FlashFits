import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DressCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.imageWrapper}>
      {item?.selectedVariant?.images?.[0]?.url ? (
        <Image
          source={{ uri: item.selectedVariant.images[0].url }}
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
          <Text>No Image</Text>
        </View>
      )}

      <View style={styles.ratingContainer}>
        <Text style={styles.star}>★</Text>
        <Text style={styles.rating}>{item.ratings || '4.5'}</Text>
      </View>
    </View>
    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
      {item.name}
    </Text>
    <View style={styles.priceRow}>
      <Text style={styles.price}>₹{item.selectedVariant.price}</Text>
      <Text style={styles.oldPrice}>₹{item.selectedVariant.mrp}</Text>
      {item.selectedVariant.discount > 0 && (
        <Text style={styles.discount}>{item.selectedVariant.discount}% off</Text>
      )}
    </View>
  </TouchableOpacity>
);

export default function ImageCardHome({ products }) {
  const availableVariants = products
    .map(product => {
      // Find the first variant with at least one size in stock
      const inStockVariant = product.variants.find(variant =>
        variant.sizes.some(size => size.stock > 0)
      );
      // If a valid variant is found, return the product along with that variant
      if (inStockVariant) {
        return {
          ...product,
          selectedVariant: inStockVariant,
        };
      }

      return null;
    })
    .filter(item => item !== null);

  const navigation = useNavigation();

  const handleCardPress = (item) => {
    // console.log(item);
    
    navigation.navigate('(stack)/ProductDetail/productdetailpage', {
      id: item._id,
      variantId: item.selectedVariant._id
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {availableVariants.map((item) => (
          <DressCard
            key={`${item._id}-${item.selectedVariant._id}`}
            item={item}
            onPress={() => handleCardPress(item)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    margin: 5,
    paddingLeft: 6,
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    height: 300,
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
    opacity: 0.8,
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
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
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