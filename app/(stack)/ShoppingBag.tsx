import React, { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
// import RazorpayCheckout from 'react-native-razorpay';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Image, 
  Animated,
  PanResponder,
  Dimensions,
  StatusBar,
  Alert
} from 'react-native';
import BagProduct from '../../components/CartBagComponents/BagProduct';
import HeaderBag from '@/components/CartBagComponents/HeaderBag';
import BillSection from '@/components/CartBagComponents/BillSection';
import SelectAddressBottomSheet from '../../components/CartBagComponents/SelectAddressBottomSheet';
import RecentlyViewed from '../../components/HomeComponents/RecentlyViewed';
import { GetCart, deleteCartItem } from '../api/productApis/cartProduct';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { clearCart, UpdateCartQuantity } from '../api/productApis/cartProduct';
import Loader from '@/components/Loader/Loader';
import { useRouter } from 'expo-router';
import { useCart } from '../ContextParent';
import eed from '../../assets/images/shoppingbag/lih.png';
import { createOrder } from '../api/orderApis';
import { getSocket } from '../config/socket';
import {joinOrderRoom} from '../sockets/order.socket';
const { width } = Dimensions.get('window');
const maxSlide = width * 0.7;

const CartBag = () => {
  // const [] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { cartCount, setCartCount, cartItems, setCartItems} = useCart();
    const [activeTab, setActiveTab] = useState<'TryandBuy' | 'Payment'>('TryandBuy');
   const [showTryBuyInfo, setShowTryBuyInfo] = useState(false);
const popupOpacity = useRef(new Animated.Value(0)).current;
const scrollYAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const deliveryBarOpacity = useRef(new Animated.Value(0)).current;
  
  const fetchCart = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const cartData = await GetCart();
      const items = cartData.items || [];
      console.log(cartData,'cartDatacartData');
      
      setCartItems(items);
      setCartCount(items.length);    
      // Animate content entrance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        })
      ]).start();
      
    } catch (err) {
      console.error('Failed to load cart:', err);
      Alert.alert('Error', 'Failed to load your cart. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    fetchCart();
  }, []);

  // Handle scroll-based animations
  useEffect(() => {
    Animated.timing(deliveryBarOpacity, {
      toValue: scrollY > 10 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [scrollY]);

  useEffect(() => {
  scrollYAnim.addListener(({ value }) => {
    setScrollY(value);
    Animated.timing(deliveryBarOpacity, {
      toValue: value > 50 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  });

  return () => scrollYAnim.removeAllListeners();
}, []);

const handleDelete = async (itemId) => {

  console.log(itemId,'itemIditemIditemId');
  
  Alert.alert(
    'Remove Item',
    'Are you sure you want to remove this item from your bag?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            if (cartCount === 1) {
              await clearCart();
              console.log('cartCleat');
            } else {
              await deleteCartItem(itemId);
            }
            await fetchCart(false); // refresh cart after deletion or clear
          } catch (error) {
            console.error('Failed to delete cart item:', error);
            Alert.alert('Error', 'Failed to remove item. Please try again.');
          }
        },
      },
    ]
  );
};
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCart(false);
  };

  // console.log(cartItems,'ewfkhbkjewefwbkj');
  

const productData = cartItems.map((item) => {
  const product = item.productId || {};
  const firstVariant = product.variants?.[0] || {};

  return {
    id: product._id,                      // product ID
    cartId: item._id,                     // ✅ cart item ID
    name: product.name || '',
    price: item.price || 0,
    mrp: item.mrp || 0,
    size: item.size || null,
    quantity: item.quantity || 1,
    stockQuantity: item.stockQuantity || 0,
    merchantName: item.merchantId?.shopName || '',
    image: item.image?.url || null,
    variantId: item.variantId || firstVariant._id  // Use item.variantId for safety
  };
});

  const totalItems = productData.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = productData.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handlePaymentComplete = async () => {
    try {
      
      const orderData = await createOrder();
      console.log(orderData,"orderData");
      // console.log(orderData.order._id, 'orderData');
      await joinOrderRoom(orderData.order._id);
      console.log("📡 Joined room for order:", orderData.order._id);
      //back to home
      router.replace({
      pathname: '/(stack)/OrderDetail/OrderTrackingPage',
      params: { orderId: JSON.stringify(orderData.order._id) }, // must stringify objects
    });
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

// const handleQuantityChange = async (cartId, newQty) => {
//   if (!cartId || typeof newQty !== 'number') {
//     console.error('Missing required data for updating quantity');
//     return;
//   }
//   try {
//     // Call backend API with just cartId and new quantity
//     await UpdateCartQuantity({ cartId, quantity: newQty });

//     // Update local cart state for the matching cartId
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item._id === cartId
//           ? { ...item, quantity: newQty }
//           : item
//       )
//     );
//   } catch (err) {
//     console.error('Error updating quantity:', err);
//     Alert.alert('Error', 'Failed to update quantity. Please try again.');
//   }
// };

const SlideToPay = ({ label, onComplete }) => {
  const slideAnimation = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0 && gestureState.dx <= maxSlide) {
          slideAnimation.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx >= maxSlide * 0.7) {
          Animated.timing(slideAnimation, {
            toValue: maxSlide,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onComplete();
            slideAnimation.setValue(0);
          });
        } else {
          Animated.timing(slideAnimation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (label === 'tryandbuy') {
    return (
      <View style={styles.slideToPayContainer}>
        <LinearGradient
          colors={['#111111ff', '#1c1c1cd9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.slideTrack}
        >
          {/* Try and Buy: Red Arrows */}
          <Animated.View
            style={[styles.slideThumb, { transform: [{ translateX: slideAnimation }] }]}
            {...panResponder.panHandlers}
          >
            <View style={styles.slideArrows}>
              <Ionicons name="chevron-forward" size={18} color="#000" />
              <Ionicons name="chevron-forward" size={18} color="#000" />
            </View>
          </Animated.View>
          <Text style={styles.slideText}>Try then Buy</Text>
        </LinearGradient>
      </View>
    );
  }

  if (label === 'prepaid') {
    return (
      <View style={styles.slideToPayContainer}>
        <LinearGradient
          colors={['#61b3f6ff', '#61b3f6d1']}  
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.slideTrack}
        >
          {/* Prepaid: Blue Arrows */}
          <Animated.View
            style={[styles.slideThumb, { transform: [{ translateX: slideAnimation }] }]}
            {...panResponder.panHandlers}
          >
            <View style={styles.slideArrows}>
              <Ionicons name="chevron-forward" size={18} color="#61b3f6ff" />
              <Ionicons name="chevron-forward" size={18} color="#61b3f6ff" />
            </View>
          </Animated.View>
          <Text style={styles.slideText}>Pay Now</Text>
        </LinearGradient>
      </View>
    );
  }

  // fallback (should not occur if only used for these two labels)
  return null;
};

  if (loading) return <Loader />;
  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <HeaderBag />
        
        <Animated.View style={[
          styles.emptyCartContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>🛍️</Text>
          </View>
          
          <Text style={styles.emptyTitle}>Your Bag is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Looks like you haven't added anything to your bag yet
          </Text>
          
          <TouchableOpacity 
            onPress={() => router.replace('/(tabs)')} 
            style={styles.shopNowButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#000', '#333']}
              style={styles.shopNowGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.shopNowButtonText}>Start Shopping</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/favorites')}
            style={styles.wishlistButton}
            activeOpacity={0.7}
          >
            <Text style={styles.wishlistButtonText}>View Wishlist</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <HeaderBag />

          {/* Order type selection */}  
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 5, marginHorizontal: 15 }}>
          
          {/* Try and Buy Tab */}
          <TouchableOpacity
            onPress={() => setActiveTab('TryandBuy')}
            style={styles.tabButton}
            activeOpacity={0.9}
          >
            {activeTab === 'TryandBuy' && (
              <LinearGradient
                colors={['#111111ff', '#1c1c1cd9']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={[StyleSheet.absoluteFill, { borderRadius: 60 }]}
              />
            )}
            <View style={styles.flexRow}>
              <MaterialIcons
                name="auto-fix-high"
                size={18}
                color="white"
                style={[styles.tabText, activeTab === 'TryandBuy' && styles.activeTabText]}
              />
              <Text style={[styles.tabText, activeTab === 'TryandBuy' && styles.activeTabText]}>
                Try then Buy
              </Text>

              {/* ❓ Help icon with toggle */}
          <TouchableOpacity
            onPress={() => {
              setShowTryBuyInfo(true);
              popupOpacity.setValue(0);
              Animated.timing(popupOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }).start(() => {
                setTimeout(() => {
                  Animated.timing(popupOpacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                  }).start(() => setShowTryBuyInfo(false));
                }, 4000);
              });
            }}
            style={[styles.tabText, activeTab === 'TryandBuy' && styles.activeTabText]}
          >
            <MaterialIcons
              name="help"
              size={15}
              color={activeTab === 'TryandBuy' ? '#fff' : '#000'}
            />
          </TouchableOpacity>

            </View>
          </TouchableOpacity>
          {/* Payment Tab */}
          <TouchableOpacity
            onPress={() => setActiveTab('Payment')}
            style={styles.tabButton}
            activeOpacity={0.9}
          >
            {activeTab === 'Payment' && (
              <LinearGradient
                colors={['#61b3f6ff', '#61b3f6d1']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={[StyleSheet.absoluteFill, { borderRadius: 60 }]}
              />
            )}
            <View style={styles.flexRow}>
              <MaterialIcons name="payments" size={18} color="black" style={[styles.tabText, activeTab === 'Payment' && styles.activeTabText]} />
              <Text style={[styles.tabText, activeTab === 'Payment' && styles.activeTabText]}>
                Pay Order
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
          {/* Try and Buy Tab info pop up*/}
        {showTryBuyInfo && (
  <Animated.View style={[styles.popupContainer, { opacity: popupOpacity }]}>
<View style={styles.popupContent}>
  <Text style={styles.popupText}>
    🛍️ Try before you buy at your doorstep!{'\n'}
    ✅ Keep what you love{'\n'}
    🔄 Instant return for the rest!
  </Text>
</View>
  </Animated.View>
          )}

     {/* Fixed Delivery Bar */}
      <Animated.View 
        style={[
          styles.fixedDeliveryBar,
          { opacity: deliveryBarOpacity }
        ]}
        pointerEvents={scrollY > 10 ? 'auto' : 'none'}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.68)', 'rgba(255, 255, 255, 0.98)']}
          style={styles.fixedDeliveryContent}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.deliveryLeftSection}>
            <Text style={styles.deliveryText}>
              Delivery in <Text style={styles.deliveryTime}>2 hrs</Text>
            </Text>
            <View style={styles.superFastBadge}>
              <Image source={eed} style={styles.badgeIcon} />
              <Text style={styles.badgeText}>Superfast</Text>
            </View>
          </View>
          <View style={styles.itemCountContainer}>
            <Text style={styles.itemCountText}>{totalItems} item{totalItems > 1 ? 's' : ''}</Text>
            <Text style={styles.totalValueText}>₹{totalValue.toLocaleString()}</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      >

        {/* Main Delivery Info */}
<Animated.View 
  style={[
    styles.deliveryInfoWrapper,
    {
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }]
    }
  ]}
>
  <LinearGradient
    colors={['#FFFFFF', '#F8F9FA']}
    style={styles.deliveryInfo}
    start={{ x: 0, y: 1 }}
    end={{ x: 0, y: 0 }}
  >
    <View style={styles.deliveryHeader}>
      <View style={styles.deliveryLeftSection}>
        <View style={styles.deliveryTimeContainer}>
          <Text style={styles.deliveryMainText}>Delivery in</Text>
          <Text style={styles.deliveryTimeText}>2 hours</Text>
        </View>
        <View style={styles.superFastBadge}>
          <Image source={eed} style={styles.badgeIcon} />
          <Text style={styles.badgeText}>Superfast</Text>
        </View>
      </View>
      
      <View style={styles.deliveryRightSection}>
        <Text style={styles.itemSummaryText}>{totalItems} items</Text>
        <Text style={styles.totalAmountText}>₹{totalValue.toLocaleString()}</Text>
      </View>
    </View>
  </LinearGradient>
</Animated.View>

        {/* Products Section */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <BagProduct
            product={productData}
            onDelete={handleDelete}
              onQuantityChange={(cartId, newQty) => {
              setCartItems(prev =>
                prev.map(item =>
                  item._id === cartId
                    ? { ...item, quantity: newQty }
                    : item
                )
              );
            }}
          />
        </Animated.View>

        {/* Coupon Section */}
        <Animated.View
          style={[
            styles.couponSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity style={styles.couponButton} activeOpacity={0.8}>
            <View style={styles.couponLeft}>
              <Ionicons name="pricetag" size={5} color="black" style={styles.couponIcon} />
              <View>
                <Text style={styles.couponTitle}>Apply Coupon</Text>
                <Text style={styles.couponSubtitle}>Save more on your order</Text>
              </View>
            </View>
            <Text style={styles.couponArrow}>›</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Matching Accessories */}
        <Animated.View
          style={[
            styles.accessoriesSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.accessoriesHeader}>
            <Text style={styles.accessoriesTitle}>Matching Accessories</Text>
            <Text style={styles.accessoriesSubtitle}>Complete your look</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.accessoriesScroll}
          >
            <RecentlyViewed accecories={cartItems} />
          </ScrollView>
        </Animated.View>        
        
        {/* Explore Store Button */}
        <Animated.View
          style={[
            styles.exploreSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => {
              if (productData.length > 0) {
                const merchantId = cartItems[0]?.merchantId?._id;
                router.push({
                  pathname: '/(stack)/ShopDetails/StoreDetailPage',
                  params: { merchantId },
                });
              }
            }}
          >
            <LinearGradient
              colors={['#F8F9FA', '#FFFFFF']}
              style={styles.exploreGradient}
            >
              <Text style={styles.exploreButtonText}>EXPLORE STORE MORE</Text>
              <Text style={styles.exploreSubtext}>Discover similar products</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

            {/* slide bar swiching */}
      {activeTab === 'Payment' && (
                  <>
                    <View style={styles.paymentMethodContainer}>
                      <View style={styles.paymentMethod}>
                        <View style={styles.paymentMethodLeft}>
                          <View style={styles.googlePayIcon}>
                            {/* <Image source={require('../../assets/images/1.jpg')} style={styles.googlePayImage} /> */}
                            <Image source={require('../../assets/images/paymentIcons/icons8-google-pay-700.png')} style={styles.googlePayImage} />
          
                          </View>
                          <View>
                            <Text style={styles.payUsingText}>Pay using</Text>
                            <Text style={styles.googlePayText}>Google Pay</Text>
                          </View>
                        </View>
                        <TouchableOpacity style={styles.changeButton}>
                          <Text style={styles.changeButtonText}>Change</Text>
                          <MaterialIcons name="keyboard-arrow-right" size={20} color="#FF6B00" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <SlideToPay label="prepaid" onComplete={handlePaymentComplete} />
                  </>
      )}
       {activeTab === 'TryandBuy' && (
                  <>
                            <View style={styles.paymentMethodContainer}>
                      <View style={styles.paymentMethod}>
                        <View style={styles.paymentMethodLeft}>
                          <View style={styles.googlePayIcon}>
                            <Image source={require('../../assets/images/paymentIcons/icons8-google-pay-700.png')} style={styles.googlePayImage} />
                          </View>
                          <View>
                            <Text style={styles.payUsingText}>Pay using</Text>
                            <Text style={styles.googlePayText}>Delivery Charge |  ₹45</Text>
                          </View>
                        </View>
                        <TouchableOpacity style={styles.changeButton}>
                          <Text style={styles.changeButtonText}>Change</Text>
                          <MaterialIcons name="keyboard-arrow-right" size={20} color="#FF6B00" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  <SlideToPay label="tryandbuy" onComplete={handlePaymentComplete} />
                  </>
       )}

      {/* <SelectAddressBottomSheet /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  // Base Container
  container: { flex: 1, backgroundColor: '#fff' },

  // Empty Cart States
  emptyCartContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 32 },
  emptyIconContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 24, fontWeight: '700', color: '#1A1A1A', marginBottom: 8, fontFamily: 'Montserrat', textAlign: 'center' },
  emptySubtitle: { fontSize: 16, color: '#666', marginBottom: 32, fontFamily: 'Montserrat', textAlign: 'center', lineHeight: 22 },

  // Buttons
  shopNowButton: { width: '100%', height: 56, borderRadius: 28, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8,  },
  shopNowGradient: { flex: 1, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  shopNowButtonText: { color: '#fff', fontSize: 16, fontWeight: '700', fontFamily: 'Montserrat', letterSpacing: 0.5 },
  wishlistButton: { paddingVertical: 16, paddingHorizontal: 24 },
  wishlistButtonText: { color: '#666', fontSize: 16, fontWeight: '500', fontFamily: 'Montserrat' },

  // Popup
  popupContainer: { position: 'absolute', top: 60, left: 20, right: 20, zIndex: 999, alignItems: 'center' },
  popupContent: { backgroundColor: '#fff', padding: 12, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6,  maxWidth: '90%' },
  
  popupText: { lineHeight: 20,color: '#333', fontSize: 13, fontFamily: 'Montserrat', textAlign: 'center' ,},
  // Scroll & Content
  scrollContent: { paddingHorizontal: 16 },

  // Fixed Delivery Bar
  fixedDeliveryContentfixedDeliveryBar: { marginHorizontal: 16, marginTop: 2, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,shadowRadius: 8},
  fixedDeliveryContent: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 13,
  paddingVertical: 10,
  borderRadius: 12,
  backgroundColor: 'rgba(255,255,255,0.95)',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
},
fixedDeliveryBar: {
  position: 'absolute',
  top: 120, // or StatusBar.currentHeight + Header height
  left: 0,
  right: 0,
  zIndex: 800,
  width: '100%',
  paddingHorizontal: 10,
},
  // Delivery Info
  deliveryInfoWrapper: {
  borderRadius: 16,
  overflow: 'hidden',
  marginVertical: 8, // Add some spacing from adjacent elements
  backgroundColor: '#fff', // Prevent visual gaps
},
  deliveryInfo: { borderRadius: 16, padding: 20, overflow: 'hidden' },
  deliveryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  deliveryLeftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  deliveryTimeContainer: { marginRight: 12 },
  deliveryMainText: { fontSize: 14, color: '#666', fontFamily: 'Montserrat' },
  deliveryTimeText: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', fontFamily: 'Montserrat' },
  deliveryText: { fontSize: 14, color: '#666', fontFamily: 'Montserrat', marginRight: 8 },
  deliveryTime: { fontWeight: '700', color: '#1A1A1A' },

  // Badge
  superFastBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E7F8F2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeIcon: { width: 12, height: 12, marginRight: 4, resizeMode: 'contain' },
  badgeText: { fontSize: 11, color: '#00B386', fontWeight: '600', fontFamily: 'Montserrat' },

  // Right Section
  deliveryRightSection: { alignItems: 'flex-end' },
  itemSummaryText: { fontSize: 13, color: '#666', fontFamily: 'Montserrat' },
  totalAmountText: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', fontFamily: 'Montserrat' },
  itemCountContainer: { alignItems: 'flex-end' },
  itemCountText: { fontSize: 12, color: '#666', fontFamily: 'Montserrat' },
  totalValueText: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', fontFamily: 'Montserrat' },

  // Coupon Section
  couponSection: { marginVertical: 12 },
  couponButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#cbfed7ff', padding: 16, borderRadius: 12, borderColor: '#FFE0B2' },
  couponLeft: { flexDirection: 'row', alignItems: 'center' },
  couponIcon: { fontSize: 24, marginRight: 12 },
  couponTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', fontFamily: 'Montserrat' },
  couponSubtitle: { fontSize: 12, color: '#666', fontFamily: 'Montserrat' },
  couponArrow: { fontSize: 24, color: '#00ff11ff', fontWeight: '300' },

  // Explore Section
  exploreSection: { marginVertical: 16 },
  exploreButton: { borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 },
  exploreGradient: { paddingVertical: 20, paddingHorizontal: 24, alignItems: 'center', borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 16 },
  exploreButtonText: { color: '#1A1A1A', fontSize: 16, fontWeight: '700', fontFamily: 'Montserrat', letterSpacing: 0.5, marginBottom: 4 },
  exploreSubtext: { color: '#666', fontSize: 12, fontFamily: 'Montserrat' },

  // Accessories Section
  accessoriesSection: { backgroundColor: '#fff', borderRadius: 16, marginVertical: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  accessoriesHeader: { padding: 20, paddingBottom: 16, alignItems: 'center' },
  accessoriesTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', fontFamily: 'Montserrat', marginBottom: 4 },
  accessoriesSubtitle: { fontSize: 14, color: '#666', fontFamily: 'Montserrat' },
  accessoriesScroll: { paddingHorizontal: 16, paddingBottom: 20 },

  // Tab Styles
  tabButton: { width: '50%', paddingVertical: 15, backgroundColor: '#ffffffff', justifyContent: 'center', alignItems: 'center', borderRadius: 60, margin: 3, borderWidth:.5, borderColor:'#c1c1c1ff'},
  tabText: { marginRight: 6, fontSize: 16, color: '#000', fontFamily: 'Montserrat', fontWeight: 'bold', },
  activeTabText: { color: '#fff', fontWeight: 'bold' },
  flexRow: { flexDirection: 'row', alignItems: 'center' },

  // Payment Method
  paymentMethodContainer: { backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  paymentMethod: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentMethodLeft: { flexDirection: 'row', alignItems: 'center' },
  googlePayIcon: { marginRight: 12 },
  googlePayImage: { width: 40, height: 30 },
  payUsingText: { fontSize: 13, color: '#666' },
  googlePayText: { fontSize: 16, fontWeight: '600', color: '#000' },
  changeButton: { flexDirection: 'row', alignItems: 'center' },
  changeButtonText: { fontSize: 16, fontWeight: '600', color: '#000' },

  // Slide to Pay
  slideContainer: { padding: 16, backgroundColor: '#fff' },
  slideTrack: { height: 70, borderRadius: 28, justifyContent: 'center', alignItems: 'center', position: 'relative', marginHorizontal: 16, },
  slideThumb: { position: 'absolute', left: 5, width: 56, height: 56, borderRadius: 25, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 4 },
  slideArrows: { flexDirection: 'row', alignItems: 'center' },
  slideText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default CartBag;