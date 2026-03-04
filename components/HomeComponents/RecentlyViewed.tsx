import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { memo, useRef } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const DressCard = memo(({ product, onPress }: { product: any; onPress: () => void }) => {
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
        <TouchableOpacity style={styles.wishlistButton}>
          <Ionicons name="heart-outline" size={18} color="#fff" />
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
          <Text style={styles.deliveryTime}>15-20 mins</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{price}</Text>
          <Text style={styles.oldPrice}>₹{mrp}</Text>
          {/* <View style={styles.addButton}>
            <Text style={styles.addText}>ADD</Text>
            <Ionicons name="add" size={14} color="#02b075" />
          </View> */}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const RecentlyViewed = ({ product = [], accecories = [], deataiPageproducts = [] }: any) => {
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();

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
        {dataToRender.map((p: any, index: number) => (
          <DressCard
            key={p._id || p.id || index}
            product={p}
            onPress={() =>
              router.push({
                pathname: '/ProductDetail/productdetailpage' as any,
                params: {
                  id: p._id || p.id,
                  variantId:
                    Array.isArray(p.variants)
                      ? p.variants[0]?._id
                      : p.variants?._id || p.variantId,
                }
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingLeft: 12,
  },
  card: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 18,
    marginRight: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
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
  deliveryTime: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
    fontFamily: 'Manrope-Medium',
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#02b075',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    position: 'absolute',
    right: 0,
    bottom: 0,
    elevation: 2,
    shadowColor: '#02b075',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addText: {
    color: '#02b075',
    fontWeight: '800',
    fontSize: 12,
    marginRight: 2,
  },
});

export default memo(RecentlyViewed);
