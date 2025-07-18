import React, { useState, useRef, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';
import TrendingStyles from '../../../components/ShopDetailPage/TrendingStyles ';
import FeaturedDress from '../../../components/ShopDetailPage/FeaturedDress ';
import ShopOffersCarousel from '../../../components/ShopDetailPage/ShopOffersCarousel';
import RecentlyViewed from '../../../components/HomeComponents/RecentlyViewed';
import jfnefn from '../../../assets/images/2.jpg';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import {getMerchantById, getProductsByMerchantId} from '../../api/merchatApis/getMerchantHome'
import Loader from '@/components/Loader/Loader';


const StoreDetailPage = () => {  

  const [loading, setLoading] = useState(true);
  const [merchantData, setMerchantData] = useState(null);
  const [productss, setProductss] = useState([]);

  // console.log(merchantData,'3777777777');
  
  const router = useRouter();
  const route = useRoute();
  const { merchantId } = route.params;


useEffect(() => {
  if (!merchantId) return;

  const fetchMerchantandProducts = async () => {
    try {
      setLoading(true);

      const merchantData = await getMerchantById(merchantId);
      
      const products = await getProductsByMerchantId(merchantId);
      console.log(products,'eragumbo parayne');
      setMerchantData(merchantData);
      setProductss(products); // ✅ this is now the array
    } catch (error) {
      console.error('Error fetching merchant or products:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchMerchantandProducts();
}, [merchantId]);

  
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


  if (loading) return <Loader />;


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>

        <View style={styles.header}>
          <Image source={jfnefn} style={styles.avatar} />
          <View>
            <Text style={styles.userName}>Max</Text>
            <Text style={styles.welcomeText}>Vytila | 30 min</Text>
          </View>
        </View>
        
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => router.push('(tabs)/FlashfitsStores')} style={styles.iconButton}>
            <Ionicons name="storefront-outline" size={24} color="#000" />
            <Text style={styles.iconLabel}>Stores</Text>
          </TouchableOpacity>
        </View>
      </View>

      <LinearGradient colors={['#fff', '#fff']} style={styles.body}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionContainer}>
            <ShopOffersCarousel />
          </View>

          <Text style={styles.sectionTitle}>Products in Store</Text>

          <View style={styles.sectionContainer}>
            <RecentlyViewed product={products}/>
          </View>
          <View style={styles.sectionContainer}>
            <RecentlyViewed product={products}/>
          </View>
          <View style={styles.sectionContainer}>
            <RecentlyViewed product={products}/>
          </View>
          <View style={styles.sectionContainer1}>
            <FeaturedDress />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // vertically center the content
    paddingHorizontal: 16,
    marginVertical: 12,
  },
    sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    // marginBottom: 12,
    marginTop: 16,
    fontFamily: 'Montserrat',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  userName: {
    fontSize: 30,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Montserrat',
  },
  welcomeText: {
    fontSize: 13,
    color: '#444',
    fontFamily: 'Montserrat',
  },
  iconContainer: {
    marginLeft: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  body: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 12,
    overflow: 'hidden', // to handle radius clipping
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  sectionContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',

  },
    sectionContainer1: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    borderTopWidth:1,
    
  },

iconButton: {
  alignItems: 'center',  // center icon and text horizontally
},

iconLabel: {
  fontSize: 12,
  marginTop: 2,
  color: '#000',
  fontFamily: 'Montserrat',
}
});

export default StoreDetailPage;
