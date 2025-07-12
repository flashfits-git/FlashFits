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

const ShopCard = ({ title, index, merchantId, shopData }) => {
  // console.log(shopData.logo.url);
  
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/(stack)/ShopDetails/StoreDetailPage',
      params: { id: merchantId }, // ✅ Use correct ID
    });
  };

  const selectedImage = images[index % images.length];

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={handlePress}>
      <Image source={selectedImage} style={styles.topImage} resizeMode="cover" />
      <View style={styles.cardContent}>
      <View style={styles.cardContent}>
  {shopData?.logo?.url ? (
    <Image
      source={{ uri: shopData.logo.url }}
      style={styles.logoImage}
      resizeMode="contain"
    />
  ) : (
    <Text style={styles.noImageText}>No Image</Text>
  )}
</View>

      </View>
    </TouchableOpacity>
  );
};


const CARD_WIDTH = width * 0.25;

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: '#fff',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    overflow: 'visible',
  },
  logoImage: {
    width: CARD_WIDTH * 0.6,   // ~60 % of card width
    height: CARD_WIDTH * 0.35, // adjust to taste
  },
  noImageText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
  cardContent: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    width: '100%',
    height: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  shopTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    fontFamily: 'Montserrat',
  },
});

export default ShopCard;
