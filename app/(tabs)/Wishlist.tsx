import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import df from '../../assets/images/3.jpg'
import fefdf from '../../assets/images/4.jpg'
import ddeff from '../../assets/images/2.jpg'
import ddwdf from '../../assets/images/3.jpg'
import WhishlistCard from '../../components/WhishlistComponents/WhishlistCard'
import HeaderWishlist from '../../components/WhishlistComponents/HeaderWishlist'
import PopupCart from '../../components/HomeComponents/PopupCart';


const products = [
  {
    id: '1',
    image: df,
    brand: 'Kook N Keech Disney',
    price: '₹725',
    originalPrice: '₹2,199',
    discount: '67% OFF',
    rating: 4.4,
    reviews: 59,
    note: 'Price dropped by ₹44',
  },
  {
    id: '2',
    image: fefdf,
    brand: 'HERE&NOW',
    price: '₹376',
    originalPrice: '₹1,299',
    discount: '71% OFF',
    rating: 3.9,
    reviews: 50,
    note: 'Only Few Left!',
  },
  {
    id: '3',
    image: ddeff,
    brand: 'Roadster',
    price: '₹499',
    originalPrice: '₹899',
    discount: '45% OFF',
    rating: 4.3,
    reviews: 317,
    note: '',
  },
  {
    id: '4',
    image:ddwdf,
    brand: 'HRX',
    price: '₹399',
    originalPrice: '₹799',
    discount: '50% OFF',
    rating: 4.9,
    reviews: 8,
    note: '',
  },
  {
    id: '5',
    image:ddwdf,
    brand: 'HRX',
    price: '₹399',
    originalPrice: '₹799',
    discount: '50% OFF',
    rating: 4.9,
    reviews: 8,
    note: '',
  },  {
    id: '6',
    image:ddwdf,
    brand: 'HRX',
    price: '₹399',
    originalPrice: '₹799',
    discount: '50% OFF',
    rating: 4.9,
    reviews: 8,
    note: '',
  },  {
    id: '7',
    image:ddwdf,
    brand: 'HRX',
    price: '₹399',
    originalPrice: '₹799',
    discount: '50% OFF',
    rating: 4.9,
    reviews: 8,
    note: '',
  },
  {
    id: '8',
    image:ddwdf,
    brand: 'HRX',
    price: '₹399',
    originalPrice: '₹799',
    discount: '50% OFF',
    rating: 4.9,
    reviews: 8,
    note: '',
  },
  {
    id: '9',
    image:ddwdf,
    brand: 'HRX',
    price: '₹399',
    originalPrice: '₹799',
    discount: '50% OFF',
    rating: 4.9,
    reviews: 8,
    note: '',
  },
  {
    id: '4',
    image:ddwdf,
    brand: 'HRX',
    price: '₹399',
    originalPrice: '₹799',
    discount: '50% OFF',
    rating: 4.9,
    reviews: 8,
    note: '',
  },
];

export default function WishlistScreen() {
  const navigation = useNavigation();

  return (

     <View style={styles.container}>
      <HeaderWishlist/>
      <WhishlistCard/>
     </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingTop: 5,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});