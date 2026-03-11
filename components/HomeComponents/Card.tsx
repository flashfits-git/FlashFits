import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useWishlist } from '../../app/WishlistContext';


const DressCard = ({ product, onPress }: { product: any; onPress: () => void }) => {

  console.log(product, 'product');

  const { toggleWishlist, isInWishlist } = useWishlist();
  const [wishlistLoading, setWishlistLoading] = React.useState(false);

  const variant = product?.variant || (Array.isArray(product?.variants) ? product.variants[0] : product?.variants);
  const variantId = variant?._id || product.variantId;
  const imageUrl = variant?.images?.[0]?.url || product?.images?.[0]?.url;
  console.log(imageUrl, 'imageUrl')
  const price = variant?.price || product?.price || 0;
  const mrp = variant?.mrp || product?.mrp || 0;

  const isLiked = variantId ? isInWishlist(variantId) : false;

  const handleWishlistToggle = async () => {
    if (wishlistLoading || !variantId) return;
    setWishlistLoading(true);
    try {
      await toggleWishlist(product._id || product.id, String(variantId));
    } catch (err) {
      console.log('Wishlist toggle error:', err);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <TouchableOpacity style={[styles.cardContainer, styles.card]} onPress={onPress}>
      <View style={styles.shadowWrapper}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUrl }} style={styles.image} />

          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={handleWishlistToggle}
            disabled={wishlistLoading}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={18}
              color={isLiked ? '#FF4444' : '#fff'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={1}>
          {product?.name || 'Unnamed Product'}
        </Text>
      </View>

      <View style={styles.ratingRow}>
        <View style={styles.ratingContainerInner}>
          <Ionicons name="star" size={10} color="#028a34" />
          <Text style={styles.ratingValue}>{product.ratings || '4.2'}</Text>
        </View>
        {product.isTriable && (
          <View style={styles.tryContainer}>
            <Text style={styles.tryText}>Try & Buy</Text>
          </View>
        )}
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{price}</Text>
        {mrp > price ? (
          <Text style={styles.oldPrice}>₹{mrp}</Text>
        ) : null}
        {/* <Text style={styles.discount}>13-20 mins</Text> */}
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
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  shadowWrapper: {
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // elevation: 6,
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 4,
    gap: 8,
  },
  ratingContainerInner: {
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  tryContainer: {
    backgroundColor: '#e6f7ef',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#028a34',
  },
  tryText: {
    fontSize: 9,
    color: '#028a34',
    fontWeight: '700',
    fontFamily: 'Manrope-Bold',
  },
  ratingValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F0F0F',
    fontFamily: 'Manrope-Bold',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 6,
    borderRadius: 20,
    zIndex: 10,
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
    fontFamily: 'Manrope-Medium',
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
    fontFamily: 'Manrope-Bold',
  },
  oldPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
    fontFamily: 'Manrope',
  },
  discount: {
    fontSize: 11,
    color: '#242424ff',
    marginLeft: 6,
    fontWeight: '600',
    fontFamily: 'Manrope-SemiBold',
  },
});

export default function Card({ product }: { product: any }) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/ProductDetail/productdetailpage' as any,
      params: {
        id: product?._id,
        variantId: product?.variantId,
      },
    });
  };

  return <DressCard product={product} onPress={handlePress} />;
} 