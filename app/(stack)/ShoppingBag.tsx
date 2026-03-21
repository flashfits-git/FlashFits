import HeaderBag from '@/components/CartBagComponents/HeaderBag';
import Loader from '@/components/Loader/Loader';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  PanResponder,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import BagProduct from '../../components/CartBagComponents/BagProduct';
// import RecentlyViewed from '../../components/HomeComponents/RecentlyViewed';
import { useAddress } from '@/app/AddressContext'; // Import context
import * as SecureStore from 'expo-secure-store';
import eed from '../../assets/images/star.png';
import { createOrder, verifyPaymentAndConfirmOrder } from '../api/orderApis';
import { clearCart, deleteCartItem, getCartbyPassAdress } from '../api/productApis/cartProduct';
import { useCart } from '../ContextParent';
import { joinOrderRoom } from '../sockets/order.socket';
import { calculateDistanceKm, calculateEstimatedTime } from '../utils/locationHelper';
import AddressSelectionModalize from './AddressSelectionModalize';
const { width } = Dimensions.get('window');
const maxSlide = width * 0.7;

const CartBag = () => {
  const addressRef = useRef<any>(null);
  const [shouldAskAddress, setShouldAskAddress] = useState(false);
  const [addressModalOpenedOnce, setAddressModalOpenedOnce] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [returnCharge, setReturnCharge] = useState(0);
  const [deliveryTip, setDeliveryTip] = useState(0);
  const [serviceGST, setServiceGST] = useState(0);
  const [totalDeliveryFee, setTotalDeliveryFee] = useState(0);
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState(false);
  const feeBreakdownAnim = useRef(new Animated.Value(0)).current;
  const [isStoreDeliveryTime, setStoreDeliveryTime] = useState('2 hours');

  const toggleBreakdown = () => {
    const toValue = isBreakdownExpanded ? 0 : 1;
    setIsBreakdownExpanded(!isBreakdownExpanded);
    Animated.timing(feeBreakdownAnim, {
      toValue,
      duration: 350,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  };
  const [bagTotal, setBagTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();
  const { cartCount, setCartCount, cartItems, setCartItems } = useCart();
  const [activeTab, setActiveTab] = useState<'TryandBuy' | 'Payment'>('TryandBuy');
  const [showTryBuyInfo, setShowTryBuyInfo] = useState(false);
  const popupOpacity = useRef(new Animated.Value(0)).current;
  const scrollYAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const deliveryBarOpacity = useRef(new Animated.Value(0)).current;
  const { selectedAddress, setSelectedAddress, addresses, setAddresses } = useAddress();

  useEffect(() => {
    const checkFirstTime = async () => {
      const flag = await SecureStore.getItemAsync("addressSelectedOnce");
      // user already selected → don't auto-open
      if (flag === "true") return;

      // user first time → open modal
      setShouldAskAddress(true);
    };
    checkFirstTime();
  }, []);

  useEffect(() => {
    if (shouldAskAddress && !addressModalOpenedOnce) {
      setAddressModalOpenedOnce(true);
      setTimeout(() => addressRef.current?.open(), 400);
    }
  }, [shouldAskAddress]);

  // console.log(cartItems, 'cartItemscartItemscartItemscartItems');



  const handleAddressChange = async (address: any) => {
    setSelectedAddress(address);
    // Prevent modalize auto-opening again
    await SecureStore.setItemAsync("addressSelectedOnce", "true");
  };

  // ✅ Helper to update totals when tip or charges change
  useEffect(() => {
    const tip = deliveryTip || 0;
    const baseDelivery = deliveryCharge - returnCharge;
    const gst = (baseDelivery + tip) * 0.18; // 18% GST on delivery + tip
    setServiceGST(gst);
    setTotalDeliveryFee(deliveryCharge + tip + gst);
  }, [deliveryTip, deliveryCharge, returnCharge]);

  const fetchCart = async (showLoader = true) => {
    try {
      const saved = await SecureStore.getItemAsync('selectedAddress');
      if (!saved) {
        console.log('No address selected → reopening modal');
        setTimeout(() => addressRef.current?.open(), 200);
        return;
      }

      if (showLoader) setIsLoading(true);

      const isServiceable = (selectedAddress as any)?.addressType !== 'Non-serviceable' && (selectedAddress as any)?.isServiceable !== false;
      const cartData = await getCartbyPassAdress((selectedAddress as any)?._id || '', isServiceable);

      const items = cartData.items || [];
      const firstItemDelivery = items[0]?.merchantDelivery;

      const dCharge = firstItemDelivery?.deliveryCharge || 0;
      const rCharge = firstItemDelivery?.returnCharge || 0;

      setDeliveryCharge(dCharge);
      setReturnCharge(rCharge);

      // Dynamic Delivery Time logic
      const merchantLocation = items[0]?.merchantId?.address?.location?.coordinates;
      const userLocation = selectedAddress?.location?.coordinates;
      if (merchantLocation && userLocation) {
        const distance = calculateDistanceKm(
          userLocation[1], userLocation[0],
          merchantLocation[1], merchantLocation[0]
        );
        const estTime = calculateEstimatedTime(distance);
        setStoreDeliveryTime(estTime);
      } else {
        setStoreDeliveryTime('2 hours'); // Fallback
      }

      setCartItems(items);
      setCartCount(items.length);

      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true })
      ]).start();

    } catch (err) {
      console.error('Failed to load cart:', err);
      Alert.alert('Error', 'Failed to load your cart. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      fetchCart();
    };
    init();
  }, [selectedAddress]);

  // Handle scroll-based animations
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

  const handleDelete = async (itemId: any) => {
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
              } else {
                await deleteCartItem(itemId);
              }
              await fetchCart(false);
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

  const productData = cartItems.map((item) => {
    const product = item.productId || {};
    const firstVariant = product.variants?.[0] || {};
    return {
      id: product._id,
      cartId: item._id,
      name: product.name || '',
      price: item.price || 0,
      mrp: item.mrp || 0,
      size: item.size || null,
      quantity: item.quantity || 1,
      stockQuantity: item.stockQuantity || 0,
      merchantName: item.merchantId?.shopName || '',
      image: item.image?.url || null,
      variantId: item.variantId || firstVariant._id
    };
  });

  const totalItems = productData.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = productData.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePaymentComplete = async () => {
    try {
      const storedAddress = await SecureStore.getItemAsync('selectedAddress');
      const parsedAddress = storedAddress ? JSON.parse(storedAddress) : null;
      const orderResponse = await createOrder({
        addressId: parsedAddress._id,
        deliveryTip: deliveryTip
      });
      if (!orderResponse || !orderResponse.success) return;

      const {
        razorpayOrderId,
        amount,
        key_id,
        orderId: internalOrderId,
        name,
        contact,
        email,
        totalDeliveryFee: apiTotalFee,
        deliveryCharge: apiDeliveryCharge,
        returnCharge: apiReturnCharge,
        deliveryTip: apiDeliveryTip,
        serviceGST: apiServiceGST
      } = orderResponse;

      setTotalDeliveryFee(apiTotalFee || 0);
      setDeliveryCharge(apiDeliveryCharge || 0);
      setReturnCharge(apiReturnCharge || 0);
      setDeliveryTip(apiDeliveryTip || 0);
      setServiceGST(apiServiceGST || 0);

      const options = {
        description: 'FlashFits Order Payment',
        image: 'https://yourlogo.com/logo.png',
        currency: 'INR',
        key: key_id,
        amount: amount,
        name: 'FlashFits',
        order_id: razorpayOrderId,
        prefill: { email: email || '', contact: contact || '', name: name || 'Customer' },
        theme: { color: '#61b3f6' },
      };

      RazorpayCheckout.open(options)
        .then(async (data) => {
          try {
            const res = await verifyPaymentAndConfirmOrder(data, internalOrderId);
            if (res?.success) {
              Alert.alert('Success', 'Payment successful! Order confirmed.');
              await joinOrderRoom(internalOrderId);
              await SecureStore.setItemAsync("addressSelectedOnce", "false");
              router.replace({
                pathname: '/(stack)/OrderDetail/OrderTrackingPage',
                params: { orderId: internalOrderId.toString() },
              });
            } else {
              Alert.alert('Payment Failed', 'Something went wrong while confirming your order.');
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            Alert.alert('Error', 'Unable to verify payment. Please try again.');
          }
        })
        .catch(async (error) => {
          if (error.code === 2) {
            Alert.alert('Cancelled', 'Payment was cancelled');
          } else {
            Alert.alert('Payment Failed', error.description || 'Something went wrong');
          }
        });
    } catch (error) {
      console.error('Payment flow error:', error);
      Alert.alert('Error', 'Payment initiation failed');
    }
  };

  const SlideToPay = ({ label, onComplete, serviceable = false }: { label: string, onComplete: () => void, serviceable?: boolean }) => {
    const disabled = serviceable;
    const slideAnimation = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => !serviceable, // ← Disable touch if serviceable
        onMoveShouldSetPanResponder: () => !serviceable,
        onPanResponderMove: (_, gestureState) => {
          if (!serviceable && gestureState.dx > 0 && gestureState.dx <= maxSlide) {
            slideAnimation.setValue(gestureState.dx);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (serviceable) return;

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

    // serviceable styles
    const containerStyle = disabled
      ? [styles.slideToPayContainer, { opacity: 0.6 }]
      : styles.slideToPayContainer;

    const trackColors: [string, string] = ['#000000', '#1a1a1a'];

    const textColor = disabled ? '#666' : '#fff';
    const arrowColor = label === 'tryandbuy' ? '#666' : '#aaa';

    return (
      <View style={containerStyle}>
        <LinearGradient
          colors={disabled ? (['#e0e0e0', '#d0d0d0'] as const) : (trackColors as any)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.slideTrack}
        >
          <Animated.View
            style={[
              styles.slideThumb,
              { transform: [{ translateX: slideAnimation }] },
              disabled && { backgroundColor: '#bbb' }, // dull thumb
            ]}
            {...(disabled ? {} : panResponder.panHandlers)} // remove handlers when disabled
          >
            <View style={styles.slideArrows}>
              <Ionicons name="chevron-forward" size={18} color={arrowColor} />
              <Ionicons name="chevron-forward" size={18} color={arrowColor} />
            </View>
          </Animated.View>

          <Text style={[styles.slideText, { color: textColor }]}>
            {disabled ? 'Delivery Unavailable' : label === 'tryandbuy' ? 'Try & Buy' : 'Pay Now'}
          </Text>
        </LinearGradient>

        {disabled && (
          <Text style={styles.disabledHintText}>
            Change delivery location to proceed
          </Text>
        )}
      </View>
    );
  };
  // console.log(productData,'productDataproductDataproductData');


  if (isLoading) return <Loader />;
  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        {/* <HeaderBag  ref={headerRef} /> */}

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
              colors={['#000000', '#333333']}
              style={styles.shopNowGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.shopNowButtonText}>Start Shopping</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/Wishlist')}
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
    <>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <HeaderBag onOpenAddressModal={() => addressRef.current?.open()} ref={addressRef} />


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
                colors={['#111111', '#1c1c1c']}
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
                style={[styles.tabText, activeTab === 'TryandBuy' ? (styles.activeTabText as any) : null]}
              />
              <Text style={[styles.tabText, activeTab === 'TryandBuy' ? (styles.activeTabText as any) : null]}>
                Try & Buy
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
                style={[styles.tabText, activeTab === 'TryandBuy' ? styles.activeTabText : null]}
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
            style={[styles.tabButton, styles.disabledTab]}
            activeOpacity={0.9}
            disabled
          >
            {activeTab === 'Payment' && (
              <LinearGradient
                colors={['#61b3f6', '#4fa3e6']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={[StyleSheet.absoluteFill, { borderRadius: 60 }]}
              />
            )}

            <View style={styles.flexRow}>
              <MaterialIcons
                name="payments"
                size={18}
                color="black"
                style={[styles.tabText, activeTab === 'Payment' ? (styles.activeTabText as any) : null]}
              />
              <Text style={[styles.tabText, activeTab === 'Payment' ? (styles.activeTabText as any) : null]}>
                Pay Now
              </Text>
            </View>
          </TouchableOpacity>

        </View>

        {/* Fixed Delivery Bar */}
        {/* <Animated.View
          style={[
            styles.fixedDeliveryBar,
            { opacity: deliveryBarOpacity }
          ]}
          pointerEvents={scrollY > 10 ? 'auto' : 'none'}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.68)', 'rgba(255, 255, 255, 0.98)'] as const}
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
        </Animated.View> */}

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
              colors={['#FFFFFF', '#F8F9FA'] as const}
              style={styles.deliveryInfo}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
            >
              <View style={styles.deliveryHeader}>
                <View style={styles.deliveryLeftSection}>
                  <View style={styles.deliveryTimeContainer}>
                    <Text style={styles.deliveryMainText}>Delivery in</Text>
                    <Text style={styles.deliveryTimeText}>{isStoreDeliveryTime}</Text>
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

            {/* Rider Tip Section - Now under items list */}
            {activeTab === 'TryandBuy' && (
              <View style={[styles.tipSection, { marginTop: 0, borderRadius: 16, marginBottom: 16 }]}>
                <Text style={styles.tipTitle}>Add a Tip for Rider</Text>
                <View style={styles.tipContainer}>
                  {[10, 20, 50].map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      style={[styles.tipButton, deliveryTip === amount && styles.activeTipButton]}
                      onPress={() => setDeliveryTip(deliveryTip === amount ? 0 : amount)}
                    >
                      <Text style={[styles.tipButtonText, deliveryTip === amount && styles.activeTipButtonText]}>₹{amount}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.upfrontNotice}>
                  * Only Upfront Cart Fee (Delivery, Return & Tip) will be charged now.
                </Text>
              </View>
            )}
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
            {/* <TouchableOpacity style={styles.couponButton} activeOpacity={0.8}>
            <View style={styles.couponLeft}>
              <Ionicons name="pricetag" size={5} color="black" style={styles.couponIcon} />
              <View>
                <Text style={styles.couponTitle}>Apply Coupon</Text>
                <Text style={styles.couponSubtitle}>Save more on your order</Text>
              </View>
            </View>
            <Text style={styles.couponArrow}>›</Text>
          </TouchableOpacity> */}
          </Animated.View>

          {/* Matching Accessories */}
          {/* <Animated.View
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
        </Animated.View> */}

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
                <Text style={styles.exploreButtonText}>
                  {productData.length > 0 ? `EXPLORE ${productData[0].merchantName.toUpperCase()} MORE` : 'EXPLORE STORE MORE'}
                </Text>
                <Text style={styles.exploreSubtext}>Try Multiple Sizes and Styles on your Cart</Text>
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
                    <Image source={require('../../assets/images/paymentIcons/icons8-delivery-boy-66.png')} style={styles.googlePayImage} />

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
            <SlideToPay
              label="prepaid"
              onComplete={handlePaymentComplete}
              serviceable={selectedAddress?.addressType === 'Non-serviceable'}
            />
          </>
        )}
        {activeTab === 'TryandBuy' && (
          <>
            <View style={styles.paymentMethodContainer}>
              <View style={styles.paymentMethod}>
                <View style={styles.paymentMethodLeft}>
                  <View style={styles.googlePayIcon}>
                    <Image source={require('../../assets/images/paymentIcons/icons8-delivery-boy-66.png')} style={styles.googlePayImage} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      onPress={toggleBreakdown}
                      style={styles.breakdownHeader}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.googlePayText}>
                        Upfront Cart Fee | ₹{Number(totalDeliveryFee).toFixed(2)}
                      </Text>
                      <MaterialIcons
                        name={isBreakdownExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>

                    <Animated.View style={{
                      height: feeBreakdownAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [18, 180] // Increased to fit all 6 rows comfortably
                      }),
                      overflow: 'hidden',
                    }}>
                      <Animated.View style={{
                        opacity: feeBreakdownAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0]
                        }),
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                      }}>
                        <Text style={styles.googlePayText1}>
                          Detailed breakdown available (click to expand)
                        </Text>
                      </Animated.View>

                      <Animated.View style={{
                        opacity: feeBreakdownAnim,
                        paddingTop: 4,
                      }}>
                        <View style={styles.breakdownContent}>
                          <View style={styles.breakdownRow}>
                            <Text style={[styles.breakdownLabel, { fontWeight: '700', color: '#000' }]}>Items Total</Text>
                            <Text style={[styles.breakdownValue, { fontWeight: '700' }]}>₹{Number(totalValue).toFixed(2)}</Text>
                          </View>
                          <View style={[styles.breakdownRow, { marginTop: 8, borderTopWidth: 0.5, borderTopColor: '#eee', paddingTop: 8 }]}>
                            <Text style={styles.breakdownLabel}>Delivery Charge</Text>
                            <Text style={styles.breakdownValue}>₹{Number(deliveryCharge - returnCharge).toFixed(2)}</Text>
                          </View>
                          <View style={styles.breakdownRow}>
                            <Text style={styles.breakdownLabel}>Return Charge (Refundable)</Text>
                            <Text style={styles.breakdownValue}>₹{Number(returnCharge).toFixed(2)}</Text>
                          </View>
                          <View style={styles.breakdownRow}>
                            <Text style={styles.breakdownLabel}>Delivery Tip</Text>
                            <Text style={styles.breakdownValue}>₹{Number(deliveryTip).toFixed(2)}</Text>
                          </View>
                          <View style={styles.breakdownRow}>
                            <Text style={styles.breakdownLabel}>Service GST (18%)</Text>
                            <Text style={styles.breakdownValue}>₹{Number(serviceGST).toFixed(2)}</Text>
                          </View>
                          <View style={[styles.breakdownRow, { marginTop: 4 }]}>
                            <Text style={[styles.breakdownLabel, { color: '#00B386', fontWeight: '600' }]}>Total Upfront Payable</Text>
                            <Text style={[styles.breakdownValue, { color: '#00B386' }]}>₹{Number(totalDeliveryFee).toFixed(2)}</Text>
                          </View>
                        </View>
                      </Animated.View>
                    </Animated.View>
                  </View>
                </View>
              </View>
            </View>
            <SlideToPay
              label="tryandbuy"
              onComplete={handlePaymentComplete}
              serviceable={selectedAddress?.addressType === 'Non-serviceable'}
            />
          </>
        )}

      </View >
      <AddressSelectionModalize
        ref={addressRef}
        onSelectAddress={handleAddressChange}
      />
    </>
  );
};

const styles = StyleSheet.create({
  // Base Container
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50, // ✅ dynamic safe spacing
  },

  // Empty Cart States
  emptyCartContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 32 },
  emptyIconContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 24, fontWeight: '700', color: '#1A1A1A', marginBottom: 8, fontFamily: 'Montserrat', textAlign: 'center' },
  emptySubtitle: { fontSize: 16, color: '#666', marginBottom: 32, fontFamily: 'Montserrat', textAlign: 'center', lineHeight: 22 },

  // Buttons
  shopNowButton: { width: '100%', height: 56, borderRadius: 28, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, },
  shopNowGradient: { flex: 1, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  shopNowButtonText: { color: '#fff', fontSize: 16, fontWeight: '700', fontFamily: 'Montserrat', letterSpacing: 0.5 },
  wishlistButton: { paddingVertical: 16, paddingHorizontal: 24 },
  wishlistButtonText: { color: '#666', fontSize: 16, fontWeight: '500', fontFamily: 'Montserrat' },

  // Popup
  popupContainer: { position: 'absolute', top: 60, left: 20, right: 20, zIndex: 999, alignItems: 'center' },
  popupContent: { backgroundColor: '#fff', padding: 12, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, maxWidth: '90%' },

  popupText: { lineHeight: 20, color: '#333', fontSize: 13, fontFamily: 'Montserrat', textAlign: 'center', },
  // Scroll & Content
  scrollContent: { paddingHorizontal: 16 },

  // Fixed Delivery Bar
  fixedDeliveryContentfixedDeliveryBar: { borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
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
    // top: 180, // or StatusBar.currentHeight + Header height
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
  disabledTab: {
    opacity: 0.4,
    backgroundColor: '#d3d3d3',   // light grey
    borderColor: '#b8b8b8',
  },
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
  exploreButton: { borderWidth: 2, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 },
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
  tabButton: { width: '50%', paddingVertical: 15, backgroundColor: '#a8a2a2ff', justifyContent: 'center', alignItems: 'center', borderRadius: 60, margin: 3, borderWidth: .5, borderColor: '#c1c1c1ff' },
  tabText: { marginRight: 6, fontSize: 16, color: '#cbc0c0ff', fontFamily: 'Montserrat', fontWeight: 'bold', },
  activeTabText: { color: '#fff', fontWeight: 'bold' },
  flexRow: { flexDirection: 'row', alignItems: 'center' },

  // Payment Method
  slideToPayContainer: { marginBottom: 20 },
  disabledHintText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    fontFamily: 'Montserrat',
  },
  paymentMethodContainer: { backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#e0e0e0', },
  paymentMethod: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentMethodLeft: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  googlePayIcon: { marginRight: 12 },
  googlePayImage: { width: 20, height: 20 },
  payUsingText: { fontSize: 13, color: '#666' },
  googlePayText: { fontSize: 16, fontWeight: '600', color: '#000' },
  googlePayText1: { fontSize: 10, fontWeight: '300', color: '#666565ff' },
  changeButton: { flexDirection: 'row', alignItems: 'center' },
  changeButtonText: { fontSize: 16, fontWeight: '600', color: '#000' },

  // Slide to Pay
  slideContainer: { padding: 16, backgroundColor: '#fff' },
  slideTrack: { height: 70, borderRadius: 28, justifyContent: 'center', alignItems: 'center', position: 'relative', marginHorizontal: 16, },
  slideThumb: { position: 'absolute', left: 5, width: 56, height: 56, borderRadius: 25, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 4 },
  slideArrows: { flexDirection: 'row', alignItems: 'center' },
  slideText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Breakdown Styles
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  breakdownContent: {
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
    marginTop: 6,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Montserrat',
  },
  breakdownValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Montserrat',
  },
  // Tip Styles
  tipSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    fontFamily: 'Montserrat',
  },
  tipContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  tipButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  activeTipButton: {
    borderColor: '#00B386',
    backgroundColor: '#E7F8F2',
  },
  tipButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTipButtonText: {
    color: '#00B386',
    fontWeight: '700',
  },
  upfrontNotice: {
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
    fontFamily: 'Montserrat',
  },
});

export default CartBag;