import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from 'expo-router';

const DressCard = ({ image, title, price, oldPrice, discount, rating, merchantId }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('(stack)/ShopDetails/StoreDetailPage', {
          merchantId: merchantId,
        })
      }
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.ratingContainer}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.rating}>{rating}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{price}</Text>
        <Text style={styles.oldPrice}>₹{oldPrice}</Text>
        <Text style={styles.discount}>{discount} off</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function CardinStores({ merchantId, products }) {

  console.log(products,'products');
  
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products.length > 0 ? (
          products.map((product) => (
            <DressCard
              key={product._id}
              image={product.images?.[0]?.url || 'https://via.placeholder.com/140'}
              title={product.name}
              price={product.price}
              oldPrice={product.mrp || product.price + 100}
              discount={'0%'}
              rating={product.ratings || '4.5'}
              merchantId={product.merchantId}
            />
          ))
        ) : (
          <Text style={styles.noProductsText}>No products available</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  card: {
    margin: 5,
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    height: 170,
    width: 140,
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
    flexWrap: 'wrap',
    marginBottom: 6,
    marginLeft: 4,
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
    color: '#ff6666',
    marginLeft: 6,
  },
});
