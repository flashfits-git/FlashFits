import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Card UI Component
const DressCard = ({ product, onPress }) => {
  const variant = product?.variant || (Array.isArray(product?.variants) ? product.variants[0] : product?.variants);
  const imageUrl = variant?.images?.[0]?.url;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
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
          {product.name}
        </Text>
        <Text style={styles.deliveryText}>13 mins</Text>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{variant?.price || '0'}</Text>
        <Text style={styles.oldPrice}>₹{variant?.mrp || '0'}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Wrapper Component with navigation
export default function WishlistCard({ product = [] }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <FlatList
        data={product}
        keyExtractor={(item, index) => item._id || item.id || index.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <DressCard
            product={item}
            onPress={() =>
              navigation.navigate('(stack)/ProductDetail/productdetailpage', {
                id: item._id || item.id,
                variantId: Array.isArray(item.variants)
                  ? item.variants[0]?._id
                  : item.variants?._id,
              })
            }
          />
        )}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    width: '48%',
    marginBottom: 12,
    marginHorizontal: '1%',
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
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'Montserrat',
    flex: 1,
    marginRight: 6,
  },
  deliveryText: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
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
});
