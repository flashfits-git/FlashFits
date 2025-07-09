import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Image, Animated } from 'react-native';
import BagProduct from '../../components/CartBagComponents/BagProduct';
import HeaderBag from '@/components/CartBagComponents/HeaderBag';
import BillSection from '@/components/CartBagComponents/BillSection';
import SelectAddressBottomSheet from '../../components/CartBagComponents/SelectAddressBottomSheet';
import RecentlyViewed from '../../components/HomeComponents/RecentlyViewed';
import { GetCart, deleteCartItem } from '../api/productApis/cartProduct';
import Loader from '@/components/Loader/Loader';
import { useRouter } from 'expo-router';
import { useCart } from '../ContextParent';
import eed from '../../assets/images/shoppingbag/lih.png';

const CartBag = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();
  const { cartCount, setCartCount } = useCart();

  const fetchCart = async () => {
    try {
      const cartData = await GetCart();
      const items = cartData.items || [];
      setCartItems(items);
      setCartCount(items.length);
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
      await fetchCart();
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

  if (cartItems.length === 0) {
    return (
      <>
        <HeaderBag />
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyText}>Your Bag is empty</Text>
          <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.returnButton}>
            <Text style={styles.returnButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <HeaderBag />

        {/* Fixed delivery bar on top */}
          {scrollY > 10 && (
            <View style={styles.fixedDeliveryBar}>
              <LinearGradient
                colors={['#eee', '#FFFFFF']}
                style={styles.deliveryInfo1}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <View style={styles.leftSection}>
                  <Text>
                      Bag will be deliver in <Text style={{ fontWeight: 'bold' }}>2 hr</Text>
                      </Text>
                  <View style={styles.badge}>
                    <Image source={eed} style={styles.icon} />
                    <Text style={styles.badgeText}>Superfast</Text>
                  </View>
                </View>
                <Text style={styles.itemText}>
                  {productData.length} item{productData.length > 1 ? 's' : ''}
                </Text>
              </LinearGradient>
            </View>
          )}

<ScrollView
  contentContainerStyle={styles.scrollContent}
  showsVerticalScrollIndicator={false}
  onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
  scrollEventThrottle={16}
>
  <View style={styles.deliveryInfoWrapper}>
    <LinearGradient
      colors={['#FFFFFF', '#eee']} // Bottom to top gradient
      style={styles.deliveryInfo}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
    >
      <View style={styles.leftSection}>
        <Text>
          Bag will be deliver in <Text style={{ fontWeight: 'bold' }}>2 hr</Text>
        </Text>
        <View style={styles.badge}>
          <Image source={eed} style={styles.icon} />
          <Text style={styles.badgeText}>Superfast</Text>
        </View>
      </View>
      <Text style={styles.itemText}>
        {productData.length} item{productData.length > 1 ? 's' : ''}
      </Text>
    </LinearGradient>
  </View>

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
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: {  paddingHorizontal: 16, paddingBottom: 100 },
  confirmButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 25,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    borderColor: '#000',
    borderWidth:2
  },
  confirmButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    letterSpacing: 0.5,
    //  fontWeight: 'bold' 
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
  returnButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
deliveryInfoWrapper: {
  marginTop: 20,    // ✅ Add this
  marginBottom: 4,
  
},
  fixedDeliveryBar: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 10,
    // width:'100%'
  },
    fixedDeliveryBar1: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 17,
    paddingVertical: 9,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
    deliveryInfo1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 9,
    // borderTopLeftRadius: 12,
    // borderTopRightRadius: 12,
    // width:'100%',
    // overflow: 'hidden',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2B2B2B',
    marginRight: 6,
    fontFamily: 'Montserrat',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F8F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  icon: {
    width: 12,
    height: 12,
    marginRight: 4,
    resizeMode: 'contain',
  },
  badgeText: {
    fontSize: 12,
    color: '#00B386',
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  itemText: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Montserrat',
  },
});

export default CartBag;
