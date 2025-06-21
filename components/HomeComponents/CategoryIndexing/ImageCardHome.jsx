import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import jfrnfr from '../../../assets/images/2.jpg';
// import fmg from '../../../assets/images/3.jpg';

// const dummyData = [
//   {
//     id: 1,
//     image: require('../../../assets/images/1.jpg'),
//     title: 'Yellow Quirky Fit Flare Maxi Dress',
//     price: '1299',
//     oldPrice: '1379',
//     discount: '6%',
//     rating: '4.7',
//     delivery: '5 - 6 Days',
//     offerPrice: '1174',
//     image1: '../../../assets/images/1.jpg'
//   },
//   {
//     id: 2,
//     image: require('../../../assets/images/3.jpg'),
//     title: 'Pastel Pink Tiered Summer Dress',
//     price: '999',
//     oldPrice: '1149',
//     discount: '13%',
//     rating: '4.5',
//     delivery: '4 - 5 Days',
//     offerPrice: '869',
//     image1: '../../../assets/images/3.jpg'
//   },
//   {
//     id: 3,
//     image: require('../../../assets/images/4.jpg'),
//     title: 'Boho Floral Ankle Length Gown',
//     price: '1899',
//     oldPrice: '2099',
//     discount: '9%',
//     rating: '4.8',
//     delivery: '2 - 4 Days',
//     offerPrice: '1729',
//     image1: '../../../assets/images/4.jpg'
//   },
// ];

const DressCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.imageWrapper}>
      <Image source={item.selectedVariant.mainImage.url} style={styles.image} />
      <View style={styles.ratingContainer}>
        <Text style={styles.star}>★</Text>
        <Text style={styles.rating}>4.5</Text>
      </View>
    </View>
    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
      {item.name}
    </Text>
    <View style={styles.priceRow}>
      <Text style={styles.price}>₹{item.price}</Text>
      <Text style={styles.oldPrice}>₹{item.mrp}</Text>
      {/* <Text style={styles.discount}>{item.discount} off</Text> */}
    </View>
  </TouchableOpacity>
);

export default function ImageCardHome({products}) {

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
  // console.log(availableVariants);
  

  const navigation = useNavigation();

const handleCardPress = (item) => {
  navigation.navigate('(stack)/ProductDetail/productdetailpage', {
    item: JSON.stringify(item)
  });
};

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {availableVariants.map((item) => (
          <DressCard key={`${item.name}-${item.selectedVariant.color.name}`} item={item} onPress={() => handleCardPress(item)} />
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
    fontWeight:'500'
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
    fontWeight:'500'
  },
  oldPrice: {
    fontSize: 12,
    color: '#777',
    textDecorationLine: 'line-through',
    marginLeft: 6,
        fontFamily: 'Montserrat',
    // fontWeight:'400'
  },
  discount: {
    fontSize: 12,
    color: '#ff6666',
    marginLeft: 6,
    
  },
});
