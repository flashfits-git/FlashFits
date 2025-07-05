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

const CartBag = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const cartData = await GetCart();
      const items = cartData.items || [];
      setCartItems(items);
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
        <Text style={styles.emptyText}>Your cart is empty</Text>
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

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => router.push('/(stack)/ShopDetails/StoreDetailPage')}
          >
            <Text style={styles.confirmButtonText}>EXPLORE STORE MORE</Text>
          </TouchableOpacity>

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
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    marginHorizontal: 25,
    backgroundColor: '#eee',
  },
  confirmButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'Montserrat',
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
