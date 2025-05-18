import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import jfrnfr from '../../assets/images/2.jpg'
import fmg from '../../assets/images/2.jpg'



const DressCard = ({ image, title, price, oldPrice, discount, rating, delivery, offerPrice }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={image} style={styles.image} />
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
    </View>
  );
};

export default function CardinStores() {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <DressCard
          image={jfrnfr}
          title="Yellow Quirky Fit Flare Maxi Dress"
          price="1299"
          oldPrice="1379"
          discount="6%"
          rating="4.7"
          delivery="5 - 6 Days"
          offerPrice="1174"
        />
        <DressCard
          image={fmg}
          title="Yellow Bodycon Maxi Dress"
          price="1349"
          oldPrice="1459"
          discount="8%"
          rating="4.6"
          delivery={null}
          offerPrice="1224"
        />
                <DressCard
          image={fmg}
          title="Yellow Bodycon Maxi Dress"
          price="1349"
          oldPrice="1459"
          discount="8%"
          rating="4.6"
          delivery={null}
          offerPrice="1224"
        />
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
    
    margin:5,
    // paddingLeft:2,
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 10,
    backgroundColor:'white'
  },
  imageWrapper: {
    position: 'relative',
  },

  image: {
    height: 170,
    width: 140,
    borderRadius:10,
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
    opacity:.8
  },
  star: {
    fontSize: 10,
    color: '#90d5ff',
    padding:2
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
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  oldPrice: {
    fontSize: 12,
    color: '#777',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  discount: {
    fontSize: 12,
    color: 'red',
    marginLeft: 6,
  },
  offerText: {
    fontSize: 13,
    marginTop: 4,
    color: '#1aaf1a',
  },
  code: {
    color: '#000',
  },
  codeBold: {
    fontWeight: 'bold',
  },
  delivery: {
    fontSize: 12,
    color: '#f4a300',
    marginTop: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#800000',
    marginTop: 8,
  },
});
