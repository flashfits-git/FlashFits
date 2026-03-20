import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { memo } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useWishlist } from '../../app/WishlistContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 24; // Small padding
const BANNER_HEIGHT = (BANNER_WIDTH * 7) / 27;

interface ProductHorizontalListProps {
  title: string;
  data: any[];
  isLoading?: boolean;
  banner?: {
    imageUrl: string;
    actionUrl?: string;
  };
}

const DressCard = memo(({ product, onPress }: { product: any; onPress: () => void }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [wishlistLoading, setWishlistLoading] = React.useState(false);

  const variantId = Array.isArray(product.variants)
    ? product.variants[0]?._id
    : product.variants?._id || product.variantId;

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

  const isLiked = variantId ? isInWishlist(variantId) : false;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: String(imageUrl) }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.bestsellerBadge}>
          <Text style={styles.bestsellerText}>Bestseller</Text>
        </View>
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

      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {product.name}
        </Text>

        <View style={styles.ratingRow}>
          <View style={styles.starRating}>
            <Ionicons name="star" size={10} color="#028a34" />
            <Text style={styles.ratingValue}>{product.ratings || '4.2'}</Text>
          </View>
          {product.isTriable && (
            <View style={styles.tryContainer}>
              <Text style={styles.tryText}>Try & Buy</Text>
            </View>
          )}
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{price}</Text>
          {mrp ? <Text style={styles.oldPrice}>₹{mrp}</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const ProductHorizontalList: React.FC<ProductHorizontalListProps> = ({
  title,
  data,
  isLoading = false,
  banner
}) => {
  const router = useRouter();

  if (!isLoading && (!data || data.length === 0)) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {/* <Text style={styles.sectionTitle}>{title}</Text> */}
      </View>

      {banner && banner.imageUrl && banner.imageUrl.trim() !== '' && (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.bannerContainer}
          onPress={() => {
            if (banner.actionUrl) {
              // Handle deep link or navigation
              router.push(banner.actionUrl as any);
            }
          }}
        >
          <Image
            source={{ uri: banner.imageUrl }}
            style={styles.bannerImage}
            contentFit="cover"
            transition={300}
            placeholder={{ uri: 'https://via.placeholder.com/800x200/F0F0F0/8E8E93?text=...' }}
            cachePolicy="memory-disk"
          />
        </TouchableOpacity>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          // Render 4 skeletons
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          data.map((item, index) => (
            <DressCard
              key={item._id || item.id || index}
              product={item}
              onPress={() => {
                const vId = Array.isArray(item.variants)
                  ? item.variants[0]?._id
                  : item.variants?._id || item.variantId;

                router.push({
                  pathname: '/ProductDetail/productdetailpage' as any,
                  params: {
                    id: item._id || item.id,
                    variantId: vId,
                  }
                });
              }}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const SkeletonCard = () => {
  return (
    <View style={styles.card}>
      <View style={[styles.imageContainer, { backgroundColor: '#E1E9EE' }]} />
      <View style={styles.detailsContainer}>
        <View style={{ height: 14, width: '80%', backgroundColor: '#E1E9EE', borderRadius: 4, marginBottom: 8 }} />
        <View style={styles.ratingRow}>
          <View style={{ height: 12, width: '30%', backgroundColor: '#E1E9EE', borderRadius: 4 }} />
        </View>
        <View style={styles.priceContainer}>
          <View style={{ height: 16, width: '40%', backgroundColor: '#E1E9EE', borderRadius: 4 }} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Manrope-Bold',
  },
  bannerContainer: {
    marginHorizontal: 12,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    height: BANNER_HEIGHT,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  card: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 18,
    marginRight: 14,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  bestsellerBadge: {
    position: 'absolute',
    top: 8,
    left: 0,
    backgroundColor: '#0F0F0F',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  bestsellerText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    fontFamily: 'Manrope-ExtraBold',
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
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 6,
    borderRadius: 20,
  },
  detailsContainer: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F0F0F',
    marginBottom: 4,
    fontFamily: 'Manrope-Bold',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  starRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F0F0F',
    fontFamily: 'Manrope-Bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F0F0F',
    fontFamily: 'Manrope-ExtraBold',
  },
  oldPrice: {
    fontSize: 11,
    color: '#8E8E93',
    textDecorationLine: 'line-through',
    marginLeft: 4,
    fontFamily: 'Manrope-Medium',
  },
});

export default memo(ProductHorizontalList);
