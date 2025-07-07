import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Preload images
const images = [
  require('../../assets/images/shopshed.jpg'),
  require('../../assets/images/shopshed1.jpg'), 
  require('../../assets/images/shopshed2.jpg'), // Add your second image here
];

const ShopCard = ({ title, shopId, index }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push('/(stack)/ShopDetails/StoreDetailPage');
  };

  const selectedImage = images[index % images.length]; // Alternate images based on index

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={handlePress}>
      <Image
        source={selectedImage}
        style={styles.topImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.shopTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const CARD_WIDTH = width * 0.4;

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    overflow: 'visible',
  },
  cardContent: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    width: '100%',
    height: 30,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  shopTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    fontFamily: 'Montserrat',
  },
});

export default ShopCard;
