import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const DressCard = ({ product, onPress }) => {
  // Handle both object and array cases for variants
  const variant = product?.variant || (Array.isArray(product?.variants) ? product.variants[0] : product?.variants);

  const imageUrl = variant?.images?.[0]?.url;

  // useEffect(() => {
  //   console.log('Rendering:', product?.name, '| Image:', imageUrl);
  // }, [product]);

  // if (!imageUrl) {
  //   console.warn('Missing image URL for product:', product?.name);
  //   return null;
  // }

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

      <Text style={styles.title} numberOfLines={1}>
        {product.name}
      </Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{variant?.price}</Text>
        <Text style={styles.oldPrice}>₹{variant?.mrp}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function ImageCardHome({ product = [], accecories = [] }) {
  const scrollRef = useRef(null);
  const navigation = useNavigation();

  const dataToRender = product.length ? product : accecories;

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={scrollRef}>
        {dataToRender.map((p, index) => (
          <DressCard
            key={p._id || p.id || index}
            product={p}
            onPress={() =>
              navigation.navigate('(stack)/ProductDetail/productdetailpage', {
                id: p._id || p.id,
                variantId: Array.isArray(p.variants) ? p.variants[0]?._id : p.variants?._id,
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

// Styles remain unchanged...
const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingLeft: 10,
  },
  card: {
    margin: 5,
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  shadowWrapper: {
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
    height: 200,
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 15,
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
    fontFamily: 'Montserrat',
  },
});
