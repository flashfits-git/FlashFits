import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
// import Card from '../HomeComponents/Card';
import CardYouMaylike from '../DetailPageComponents/CardYouMaylike';
import { useNavigation } from 'expo-router'; // or useNavigation from '@react-navigation/native'
import {  getYouMayLikeProducts} from '../../app/api/productApis/products';


function YouMayLike({ merchantId, subSubCategoryId, products = [] }) {
  const navigation = useNavigation();
  const [youMayLikeProducts, setYouMayLikeProducts] = useState([]);

  // console.log(youMayLikeProducts,'youMayLikeProductsyouMayLikeProducts');

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchYouMayLikeProducts = async () => {
      try {
        const data = await getYouMayLikeProducts(merchantId, subSubCategoryId);
        setYouMayLikeProducts(data || []);
      } catch (error) {
        console.error('Error fetching "You May Like" products:', error);
      }
    };

    fetchYouMayLikeProducts();
  }, []);

  // const handlePress = (item) => {
  //   // Define navigation or onPress logic here
  // };
  // console.log(youMayLikeProducts);
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You May Also Like</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
           {(youMayLikeProducts.length ? youMayLikeProducts : products).map((item, index) => (
          <View key={index} style={styles.cardWrapper}>
            <CardYouMaylike product={item} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
container: {
  marginVertical: 5,
  paddingHorizontal: 16,
},
cardWrapper:{
  width:200
},
title: {
  fontSize: 18,
  fontWeight: '600',
  marginBottom: 12,
  fontFamily: 'Montserrat',
},
});

export default YouMayLike;
