import React, { useRef, useEffect, useState } from 'react';
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
  // const mainImageUrl = product?.variants?.image[0]?.url;

  // if (!mainImageUrl) return null; // skip rendering if no image available

  const imageUrl = product?.variant?.images?.[0]?.url;

if (!imageUrl) {
  console.warn('Image URL missing for product:', product);
  return null;
}


  const discountPercent = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.ratingContainer}>
          {/* <Text style={styles.star}>★</Text> */}
          {/* <Text style={styles.rating}>{product.ratings}</Text> */}
        </View>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {product.name}
      </Text>

      <View style={styles.priceRow}>
        {/* <Text style={styles.price}>₹{product.price}</Text> */}
        <Text style={styles.oldPrice}>₹{product.mrp}</Text>
        <Text style={styles.discount}>{discountPercent}% off</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function ImageCardHome({product=[]}) {
  // console.log(product[0].variant.images[0].url); 
  const scrollRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [direction, setDirection] = useState(1);
  const navigation = useNavigation();

  useEffect(() => {
    if (product.length < 2) return; // skip auto-scroll for single item

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const newX = scrollX + direction * 170;
        scrollRef.current.scrollTo({ x: newX, animated: true });
        setScrollX(newX);

        if (newX >= 170 * (product.length - 1)) setDirection(-1);
        if (newX <= 0) setDirection(1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [scrollX, direction, product.length]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        scrollEventThrottle={16}
        onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
      >
        {/* <Text>jfjdjdj</Text> */}
        {product.map((p) => (
          <DressCard
            key={p.id}
            product={p}
            onPress={() =>
              navigation.navigate('(stack)/ProductDetail/productdetailpage', {
                item: JSON.stringify(p),
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
  },
  card: {
    margin: 5,
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    height: 200,
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
    opacity: 0.8,
  },
  star: {
    fontSize: 10,
    color: '#90d5ff',
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
  discount: {
    fontSize: 12,
    color: 'red',
    marginLeft: 6,
    fontFamily: 'Montserrat',
  },
});
