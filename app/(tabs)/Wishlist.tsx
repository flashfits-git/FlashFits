import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
// import df from '../../assets/images/3.jpg'
// import fefdf from '../../assets/images/4.jpg'
// import ddeff from '../../assets/images/2.jpg'
// import ddwdf from '../../assets/images/3.jpg'
import WhishlistCard from '../../components/WhishlistComponents/WhishlistCard'
import HeaderWishlist from '../../components/WhishlistComponents/HeaderWishlist'
// import PopupCart from '../../components/HomeComponents/PopupCart';
import { useCart } from './Context';

export default function WishlistScreen() {
  const navigation = useNavigation();
  const { cartCount } = useCart();

  return (

     <View style={styles.container}>
      <HeaderWishlist cartCount={cartCount}/>
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