import React, { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Image, 
  Animated,
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
import { Ionicons } from '@expo/vector-icons';
import Loader from '@/components/Loader/Loader';
import { useRouter } from 'expo-router';
import { useCart } from '../ContextParent';
import eed from '../../assets/images/shoppingbag/lih.png';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CartBag = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { cartCount, setCartCount } = useCart();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const deliveryBarOpacity = useRef(new Animated.Value(0)).current;
  
  const fetchCart = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const cartData = await GetCart();
      const items = cartData.items || [];
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

  const handleDelete = async (itemId) => {
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
              await deleteCartItem(itemId);
              await fetchCart(false);
            } catch (error) {
              console.error("Failed to delete cart item:", error);
              Alert.alert('Error', 'Failed to remove item. Please try again.');
            }
          }
        }
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
      name: product.name || '',
      price: firstVariant.price || null,
      mrp: firstVariant.mrp || null,
      size: item.size || null,
      quantity: item.quantity || 1,
      merchantName: item.merchantId?.shopName || '',
      image: firstVariant.images?.[0] || null,
      id: product._id,
      variantId: firstVariant._id
    };
  });

  const totalItems = productData.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = productData.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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

      {/* Fixed Delivery Bar */}
      <Animated.View 
        style={[
          styles.fixedDeliveryBar,
          { opacity: deliveryBarOpacity }
        ]}
        pointerEvents={scrollY > 10 ? 'auto' : 'none'}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.98)', 'rgba(238,238,238,0.98)']}
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
            
            {/* <View style={styles.deliveryProgress}>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
              <Text style={styles.progressText}>Order confirmed • Preparing for dispatch</Text>
            </View> */}
          </LinearGradient>
        </Animated.View>

        {/* Products Section */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <BagProduct product={productData} onDelete={handleDelete} />
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

        {/* Bill Section */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <BillSection />
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <SelectAddressBottomSheet />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  // Empty Cart Styles
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    fontFamily: 'Montserrat',
    textAlign: 'center',
    lineHeight: 22,
  },
  shopNowButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  shopNowGradient: {
    flex: 1,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopNowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Montserrat',
    letterSpacing: 0.5,
  },
  wishlistButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  wishlistButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },

  // Main Content Styles
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },

  // Fixed Delivery Bar
  fixedDeliveryBar: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  fixedDeliveryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },

  // Delivery Info Section
  deliveryInfoWrapper: {
    marginTop: 20,
    marginBottom: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  deliveryInfo: {
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // marginBottom: 16,
  },
  deliveryLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deliveryTimeContainer: {
    marginRight: 12,
  },
  deliveryMainText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Montserrat',
  },
  deliveryTimeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat',
  },
  deliveryText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Montserrat',
    marginRight: 8,
  },
  deliveryTime: {
    fontWeight: '700',
    color: '#1A1A1A',
  },
  superFastBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F8F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeIcon: {
    width: 12,
    height: 12,
    marginRight: 4,
    resizeMode: 'contain',
  },
  badgeText: {
    fontSize: 11,
    color: '#00B386',
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  deliveryRightSection: {
    alignItems: 'flex-end',
  },
  itemSummaryText: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Montserrat',
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat',
  },
  itemCountContainer: {
    alignItems: 'flex-end',
  },
  itemCountText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Montserrat',
  },
  totalValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'Montserrat',
  },

  // Progress Bar
  deliveryProgress: {
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#00B386',
    borderRadius: 2,
    width: '65%',
  },
  progressText: {
    fontSize: 12,
    color: '#00B386',
    fontFamily: 'Montserrat',
    fontWeight: '500',
  },

  // Coupon Section
  couponSection: {
    marginVertical: 12,
  },
  couponButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#cbfed7ff',
    padding: 16,
    borderRadius: 12,
    // borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  couponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'Montserrat',
  },
  couponSubtitle: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Montserrat',
  },
  couponArrow: {
    fontSize: 24,
    color: '#00ff11ff',
    fontWeight: '300',
  },

  // Explore Section
  exploreSection: {
    marginVertical: 16,
  },
  exploreButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  exploreGradient: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
  },
  exploreButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Montserrat',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  exploreSubtext: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'Montserrat',
  },

  // Accessories Section
  accessoriesSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  accessoriesHeader: {
    padding: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  accessoriesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat',
    marginBottom: 4,
  },
  accessoriesSubtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Montserrat',
  },
  accessoriesScroll: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  // Bottom Spacing
  bottomSpacing: {
    height: 40,
  },
});

export default CartBag;