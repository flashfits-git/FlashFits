import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import TitleCard from './CategoryIndexing/TitleCard';
import ImageCardHome from './CategoryIndexing/ImageCardHome';
import { useNavigation } from '@react-navigation/native';
import SelecefeftionPage from '../../assets/images/3,jpg'

const productData = [
  {
    image: '../../assets/images/3.jpg',
    title: 'Item 1',
    price: 29.99,
    oldPrice: 59.99,
    discount: '50%',
    rating: 4.2,
  },
  {
    image: '../../assets/images/3.jpg',
    title: 'Item 2',
    price: 39.99,
    oldPrice: 79.99,
    discount: '50%',
    rating: 4.7,
  },
];

const Categories = () => {
  const navigation = useNavigation();

  const handleTitlePress = () => {
    navigation.navigate('(stack)/SelectionPage');
  };


  const handleViewAll = () => {
    navigation.navigate('(stack)/SelectionPage');
    // navigation logic or other action can go here
  };



  

  return (
    <>
      <TouchableOpacity onPress={handleTitlePress} activeOpacity={0.8}>
        <TitleCard />
      </TouchableOpacity>
      <ImageCardHome  />
      <TouchableOpacity style={styles.button} onPress={handleViewAll}>
        <Text style={styles.text}>View All</Text>
      </TouchableOpacity>
    </>
  );
};

export default Categories;

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginVertical: 24,
    width: '90%',
    alignItems: 'center',  // Center the text horizontally
    justifyContent: 'center', // Center the text vertically
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
          fontFamily:'Montserrat'
  
  },
});

