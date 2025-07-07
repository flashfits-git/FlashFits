import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import BagProduct from '../../components/CartBagComponents/BagProduct';
import HeaderBag from '@/components/CartBagComponents/HeaderBag';
import BillSection from '@/components/CartBagComponents/BillSection';
import SelectAddressBottomSheet from '../../components/CartBagComponents/SelectAddressBottomSheet';
import RecentlyViewed from '../../components/HomeComponents/RecentlyViewed';
import { GetCart, deleteCartItem } from '../api/productApis/cartProduct';
import Loader from '@/components/Loader/Loader';
import { useRouter } from 'expo-router'; // assuming you're using expo-router
import { useCart } from '../ContextParent';

const CartBag = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
      const { cartCount, setCartCount } = useCart();
  

  const fetchCart = async () => {
    try {
      const cartData = await GetCart();
      const items = cartData.items || [];
      setCartItems(items);
      setCartCount(items.length)
      setLoading(false);
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleDelete = async (itemId) => {
    try {
      await deleteCartItem(itemId);
      await fetchCart(); // Refresh cart after delete
    } catch (error) {
      console.error("Failed to delete cart item:", error);
    }
  };

  const productData = cartItems.map((item) => {
    const product = item.productId || {};
    const firstVariant = product.variants?.[0] || {};
    return {
      name: product.name || '',
      price: firstVariant.price || null,
      mrp: firstVariant.mrp || null,
      size: item.size || null,
      quantity: item.quantity || 1,
      merchantName: item.merchantId?.shopName || '',
      imageURL: 'ddd',
      id: product._id,
    };
  });

  if (loading) return <Loader />;

  // 🟥 If cart is empty
  if (cartItems.length === 0) {
    return (
      <>
        <HeaderBag />
      <View style={styles.emptyCartContainer}>
        <Text style={styles.emptyText}>Your Bag is empty</Text>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)')}
          style={styles.returnButton}
        >
    
          <Text style={{ color: '#fff', fontWeight: 'bold',fontFamily: 'Montserrat',  }}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
      </>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <HeaderBag />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <BagProduct productData={productData} onDelete={handleDelete} />

            <View style={{ marginTop: 20, marginBottom: 20 }}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => router.push('/(stack)/ShopDetails/StoreDetailPage')}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmButtonText}>EXPLORE STORE MORE</Text>
              </TouchableOpacity>
            </View>

          <View style={{ backgroundColor: '#fff', borderRadius: 10, width: '100%' }}>
            <Text style={styles.accessoriesTitle}>Matching Accessories in Store</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <RecentlyViewed accecories={cartItems} />
            </ScrollView>
          </View>

          <BillSection />
        </ScrollView>
      </View>
      <SelectAddressBottomSheet />
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
    paddingBottom: 100,
  },
confirmButton: {
  backgroundColor: '#fff',
  paddingVertical: 16,
  paddingHorizontal: 32,
  borderRadius: 30,
  alignItems: 'center',
  justifyContent: 'center',
  marginHorizontal: 25,
  height: 60,

  // Shadow for iOS
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 6,

  // Shadow for Android
  elevation: 6,

  // borderWidth: 1,
  borderColor: '#ccc', // Optional soft border
},
confirmButtonText: {
  color: '#000',
  fontSize: 16,
  fontWeight: 'bold',
  fontFamily: 'Montserrat',
  letterSpacing: 0.5,
},
  accessoriesTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 10,
    paddingTop: 15,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },
  returnButton: {
    height: 70,
    backgroundColor: '#000',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
});

export default CartBag;
