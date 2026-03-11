import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useWishlist } from '../../app/WishlistContext';

// Card UI Component — matches SelectionPage Card design
const DressCard = ({ product, onPress }: { product: any; onPress: () => void }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [wishlistLoading, setWishlistLoading] = React.useState(false);

  const variant = product?.variant || (Array.isArray(product?.variants) ? product.variants[0] : product?.variants);
  const variantId = variant?._id || product.variantId;
  const imageUrl = variant?.images?.[0]?.url;
  const price = variant?.price || 0;
  const mrp = variant?.mrp || 0;
  // const discount = variant?.discount || (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);

  const isLiked = variantId ? isInWishlist(variantId) : true; // Default true since it's the wishlist page

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
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <View style={styles.shadowWrapper}>
        <View style={styles.imageWrapper}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.noImage]}>
              <Text style={styles.noImageText}>No Image</Text>
            </View>
          )}

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

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={10} color="#028a34" />
            <Text style={styles.ratingValue}>{product.ratings || '4.2'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={1}>
          {product?.name || 'Unnamed Product'}
        </Text>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{price}</Text>
        {mrp > price ? (
          <Text style={styles.oldPrice}>₹{mrp}</Text>
        ) : null}
        <Text style={styles.discount}>20-30 mins</Text>
      </View>
    </TouchableOpacity>
  );
};


// Wrapper Component with navigation
export default function WishlistCard({ product = [] }: { product?: any[] }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList
        data={product}
        keyExtractor={(item, index) => item._id || item.id || index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <DressCard
            product={item}
            onPress={() =>
              router.push({
                pathname: '/ProductDetail/productdetailpage' as any,
                params: {
                  id: item._id || item.id,
                  variantId: Array.isArray(item.variants)
                    ? item.variants[0]?._id
                    : item.variants?._id,
                },
              })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// Styles — matching SelectionPage Card
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  cardContainer: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  shadowWrapper: {
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
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  ratingValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F0F0F',
    fontFamily: 'Manrope-Bold',
  },
  noImage: {
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 12,
    color: '#8E8E93',
    fontFamily: 'Manrope',
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

