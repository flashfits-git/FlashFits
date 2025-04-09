import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter  } from 'expo-router';
const productImage = require('../../../assets/images/1.jpg');
const pro = require('../../../assets/images/2.jpg');
const pae = require('../../../assets/images/3.jpg');
const ur = require('../../../assets/images/4.jpg');

const products = [
  { id: '1', name: 'Shopping bag', category: 'Basic', price: '$23.45', image: productImage },
  { id: '2', name: 'Warning T-shirt', category: 'Basic', price: '$23.45', image: pro },
  { id: '3', name: 'Sneakers', category: 'Basic', price: '$23.45', image: pae },
  { id: '4', name: 'Black T-shirt', category: 'Basic', price: '$23.45', image: ur },
];

const ProductDetail = () => {
  const { id } = useLocalSearchParams();
  console.log(id);
  const router = useRouter();
  
  const item = products.find((x) => x.id === id);
  console.log(item);
  

  return (
    <ScrollView style={styles.container}>
      {/* Product Image */}
      <Image
        source={item.image}
        style={styles.productImage}
        resizeMode="cover"
      />

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.productTitle}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>

        {/* Color Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color</Text>
          <View style={styles.colorOptions}>
            <TouchableOpacity style={[styles.colorOption, { backgroundColor: 'black' }]} />
            <TouchableOpacity style={[styles.colorOption, { backgroundColor: 'white', borderWidth: 1 }]} />
            <TouchableOpacity style={[styles.colorOption, { backgroundColor: 'blue' }]} />
          </View>
        </View>

        {/* Size Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Size</Text>
          <View style={styles.sizeOptions}>
            <TouchableOpacity style={styles.sizeOption}><Text>S</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.sizeOption, styles.selectedSize]}><Text>M</Text></TouchableOpacity>
            <TouchableOpacity style={styles.sizeOption}><Text>L</Text></TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            This is a detailed description of {item.name}. Experience quality and style like never before!
          </Text>
        </View>

        {/* Add to Cart Button */}
<TouchableOpacity
  className="bg-blue-600 px-4 py-2 rounded-full"
  onPress={() => {
    router.push({
      pathname: '/Basket',
      params: {
        namee: item.name,
        price: item.price,
      },
    });
  }}
>
  <Text className="text-white text-center font-semibold">Add to Cart</Text>
</TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  productImage: { width: '100%', height: 300 },
  infoContainer: { padding: 20 },
  productTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  productPrice: { fontSize: 22, color: '#2a2a2a', marginBottom: 8 },
  productCategory: { fontSize: 16, color: '#8E8E8E', marginBottom: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  colorOptions: { flexDirection: 'row', gap: 10 },
  colorOption: { width: 30, height: 30, borderRadius: 15 },
  sizeOptions: { flexDirection: 'row', gap: 10 },
  sizeOption: {
    width: 40, height: 40, borderRadius: 5, borderWidth: 1,
    borderColor: '#ddd', justifyContent: 'center', alignItems: 'center',
  },
  selectedSize: { borderColor: '#000', backgroundColor: '#f0f0f0' },
  description: { fontSize: 16, lineHeight: 24, color: '#555' },
  addToCartButton: {
    backgroundColor: '#000', padding: 15, borderRadius: 5,
    alignItems: 'center', marginTop: 20,
  },
  addToCartText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default ProductDetail;