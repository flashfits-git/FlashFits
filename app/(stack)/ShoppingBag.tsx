import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import BagProduct from '../../components/CartBagComponents/BagProduct';
import HeaderBag from '@/components/CartBagComponents/HeaderBag';
import BillSection from '@/components/CartBagComponents/BillSection';
import SelectAddressBottomSheet from '../../components/CartBagComponents/SelectAddressBottomSheet'
import RecentlyViewed from '../../components/HomeComponents/RecentlyViewed'
import { useRouter } from 'expo-router';

const CartBag = () => {
  const router = useRouter();
    const [products, setProducts] = useState([
    {
      id:3e23,
      name: "Classic White Shirt",
      merchantId: { _id: "1", name: "Trendify Merchants" },
      brandId: { _id: "2", name: "UrbanClassics" },
      categoryId: { _id: "3", name: "Topwear" },
      subCategoryId: { _id: "4", name: "Shirts" },
      subSubCategoryId: { _id: "5", name: "Formal Shirts" },
      gender: "men",
      description: "A classic white shirt made from premium cotton A classic white shirt made from premium cotton  A classic white shirt made from premium cotton  ",
      mrp: 1499,
      price: 999,
      features: { fabric: "100% Cotton", fit: "Slim Fit", sleeve: "Full Sleeve" },
      tags: ["white", "shirt", "formal", "slim fit"],
      variants: [
        {
          color: { name: "White", hex: "#fff" },
          sizes: [
            { size: "S", stock: 3 },
            { size: "M", stock: 5 },
            { size: "L", stock: 4 },
            { size: "XL", stock: 2 },
          ],
          images: [
            {
              public_id: "white_shirt_1",
              url: "https://example.com/images/white-shirt-1.jpg",
            },
            {
              public_id: "white_shirt_2",
              url: "https://example.com/images/white-shirt-2.jpg",
            },
          ],
          mainImage: {
            public_id: "white_shirt_main",
            url: "https://example.com/images/white-shirt-main.jpg",
          },
          discount: 33,
        },
        {
          color: { name: "Off white", hex: "#000" },
          sizes: [
            { size: "S", stock: 6 },
            { size: "M", stock: 42 },
            { size: "L", stock: 4 },
            { size: "XL", stock: 8 },
          ],
          images: [
            {
              public_id: "white_shirt_1",
              url: "https://example.com/images/white-shirt-1.jpg",
            },
            {
              public_id: "white_shirt_2",
              url: "https://example.com/images/white-shirt-2.jpg",
            },
          ],
          mainImage: {
            public_id: "white_shirt_main",
            url: "https://example.com/images/white-shirt-main.jpg",
          },
          discount: 33,
        },
      ],
      ratings: 4.5,
      numReviews: 27,
      isActive: true,
    },
    {
      id:3234,
      name: "Denim Jacket Denim Jacket Denim Jacket",
      merchantId: { _id: "1", name: "Trendify Merchants" },
      brandId: { _id: "2", name: "UrbanClassics" },
      categoryId: { _id: "3", name: "Topwear" },
      subCategoryId: { _id: "4", name: "Jackets" },
      subSubCategoryId: { _id: "5", name: "Denim Jackets" },
      gender: "women",
            description: "A classic white shirt made from premium cotton A classic white shirt made from premium cotton  A classic white shirt made from premium cotton  ",
      mrp: 2999,
      price: 1999,
      features: { material: "Denim", pockets: "4", wash: "Medium" },
      tags: ["denim", "jacket", "casual"],
      variants: [
        {
          color: { name: "Blue", hex: "#1E3A8A" },
          sizes: [
            { size: "S", stock: 1},
            { size: "M", stock: 5 },
            { size: "L", stock: 3 },
          ],
          images: [
            {
              public_id: "denim_jacket_1",
              url: "https://example.com/images/denim-jacket-1.jpg",
            },
          ],
          mainImage: {
            public_id: "denim_jacket_main",
            url: "https://unsplash.com/photos/boy-in-white-crew-neck-t-shirt-wearing-black-sunglasses-PDZAMYvduVk",
          },
          discount: 25,
        },
      ],
      ratings: 4.8,
      numReviews: 54,
      isActive: true,
    },
  ]);

  return (
    <>
    <View style={styles.container}>
      <HeaderBag />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BagProduct />
              <TouchableOpacity style={styles.confirmButton} onPress={() => router.push('/(stack)/ShopDetails/StoreDetailPage')}>
                <Text style={styles.confirmButtonText}>EXPLORE STORE MORE</Text>
              </TouchableOpacity>
        {/* create a section that having bg light grey in color and having a horizontal scroll view of RecentlyViewed in it  */}
          <View style={{ backgroundColor: '#fff', borderRadius: 10 , width:'100%'}}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, paddingHorizontal: 10, paddingTop: 15, fontFamily:'Montserrat'  }}>Matching Accessories in Store</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
            <RecentlyViewed product={products} />
          </ScrollView>
        </View>
        <BillSection />
      </ScrollView>
    </View>
    <SelectAddressBottomSheet/>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingTop: 5,
    paddingHorizontal: 16,
    paddingBottom: 100, // <-- give extra space for the bottom bar
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    zIndex: 999,
    elevation: 10,
    height:90
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 14,
  },
  breakup: {
    color: 'green',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#00B140',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
    confirmButton: {
    // bottom: 20,
    // left: 16,
    // right: 16,
    backgroundColor: '#000',
    padding:20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    marginHorizontal:25
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily:'Montserrat'
  },
});

export default CartBag;
