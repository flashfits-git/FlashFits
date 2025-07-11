import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Loader from '@/components/Loader/Loader';

import WhishlistCard from '../../components/WhishlistComponents/WhishlistCard'
import HeaderWishlist from '../../components/WhishlistComponents/HeaderWishlist'
import {fetchnewArrivalsProductsData} from '../api/productApis/products'
import ImageCardHome from '../../components/HomeComponents/CategoryIndexing/ImageCardHome';



export default function WishlistScreen() {
  const navigation = useNavigation();
      const [loading, setLoading] = useState(true);
      const [newArrivalsProducts, setNewArrivalsProducts] = useState([])
      
  
  // const { cartCount } = useCart();

    useEffect(() => {
      getNewArrivalsProducts()
      // getMerchantsData()
      setLoading(false)
    }, [])
  
    const getNewArrivalsProducts = async () => {
      try {
        const response = await fetchnewArrivalsProductsData()
        
        // console.log(response,'HYGG');
        
        setNewArrivalsProducts(response)
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

  if (loading) return <Loader />;


  return (

     <View style={styles.container}>
      <HeaderWishlist />
      <WhishlistCard product={newArrivalsProducts}/>
      {/* <ImageCardHome products={newArrivalsProducts}/> */}
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