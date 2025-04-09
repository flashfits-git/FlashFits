import React from 'react';
import { useRouter } from "expo-router";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import productImage from '../../assets/images/1.jpg';
import pro from '../../assets/images/2.jpg';
import pae from '../../assets/images/3.jpg';
import ur from '../../assets/images/4.jpg';
// import jfejfef from '../DetailPageComponents/ProductDetail'

const products = [
  { id: '1', name: 'Shopping bag', category: 'Basic', price: '$23.45', image: productImage },
  { id: '2', name: 'Warning T-shirt', category: 'Basic', price: '$23.45', image: pro },
  { id: '3', name: 'Sneakers', category: 'Basic', price: '$23.45', image: pae },
  { id: '4', name: 'Black T-shirt', category: 'Basic', price: '$23.45', image: ur },
  { id: '5', name: 'Black T-shirt', category: 'Basic', price: '$23.45', image: ur },
  { id: '6', name: 'Black T-shirt', category: 'Basic', price: '$23.45', image: ur },
  { id: '7', name: 'Sneakers', category: 'Basic', price: '$23.45', image: pae },
  { id: '3', name: 'Sneakers', category: 'Basic', price: '$23.45', image: pae },
  { id: '3', name: 'Sneakers', category: 'Basic', price: '$23.45', image: pae },
  { id: '3', name: 'Sneakers', category: 'Basic', price: '$23.45', image: pae },
  { id: '3', name: 'Sneakers', category: 'Basic', price: '$23.45', image: pae },
];

const PopularProducts = () => {
  const router  = useRouter();
  
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/ProductDetail/[id]",
          params: {
            id: item.id,
          },
        })
      }      
    >
      <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.productImage} />
      <TouchableOpacity style={styles.heartIcon}>
        <Ionicons style={styles.heartIconhear} name="heart-outline" size={20} color="#000" />
      </TouchableOpacity>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productCategory}>{item.category}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Popular products</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  heartIconhear: {
    paddingTop: 4,
    paddingRight: 4,
    color: '#7B4F32',
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: '#7B4F32',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#8E8E8E',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default PopularProducts;
