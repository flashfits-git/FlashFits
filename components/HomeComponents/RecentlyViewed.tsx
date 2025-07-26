import React, { useRef } from 'react';
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
import { Ionicons } from '@expo/vector-icons'; // Already imported

const { width } = Dimensions.get('window');

const DressCard = ({ product, onPress }) => {
  const imageUrl =
    product?.images?.[0]?.url ||
    product?.variants?.[0]?.images?.[0]?.url ||
    product?.variants?.images?.[0]?.url ||
    '';

  const price =
    product?.price ||
    product?.variants?.[0]?.price ||
    product?.variants?.price;

  const mrp =
    product?.mrp ||
    product?.variants?.[0]?.mrp ||
    product?.variants?.mrp;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.shadowWrapper}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={10} color="#000" style={{ marginRight: 2 }} />
          <Text style={styles.ratingText}>{product.ratings || '0.0'}</Text>
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
        <Text style={styles.price}>₹{price}</Text>
        <Text style={styles.oldPrice}>₹{mrp}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function ImageCardHome({ product = [], accecories = [], deataiPageproducts = [] }) {
  const scrollRef = useRef(null);
  const navigation = useNavigation();

  const dataToRender =
    deataiPageproducts.length > 0
      ? deataiPageproducts
      : product.length > 0
      ? product
      : accecories;

  return (
    <View style={styles.container}>
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  ref={scrollRef}
  contentContainerStyle={{ flexDirection: 'row' }}
>
  {dataToRender.map((p, index) => (
    <DressCard
      key={p._id || p.id || index}
      product={p}
      onPress={() =>
        navigation.navigate('(stack)/ProductDetail/productdetailpage', {
          id: p._id || p.id,
          variantId:
            Array.isArray(p.variants)
              ? p.variants[0]?._id
              : p.variants?._id || p.variantId,
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
  },
  shadowWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
  color: '#333',
  fontFamily: 'Montserrat',
  flex: 1,
  marginRight: 6,
},
titleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 6,
  marginVertical: 4,
},
deliveryText: {
  fontSize: 11,
  color: '#888',
  fontFamily: 'Montserrat',
  flexShrink: 0,
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
