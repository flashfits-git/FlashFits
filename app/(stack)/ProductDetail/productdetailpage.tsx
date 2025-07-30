import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity, Animated,
  Dimensions, FlatList, ScrollView,
} from 'react-native';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Modalize } from 'react-native-modalize';
import { productDetailPage } from '../../api/productApis/products';
import vrvv from '../../../assets/images/4.jpg';
import YouMayLike from '../../../components/DetailPageComponents/YouMayLike';
import Loader from '@/components/Loader/Loader';
import {addToPreviouslyViewed} from '../../utilities/localStorageRecentlyViewd'
import { useRoute } from '@react-navigation/native';
import { AddProducttoCart ,clearCart, GetCart} from '../../api/productApis/cartProduct';
import ErrorMessage from '../../utilities/errorHandlingPopUp'
import { useCart } from '../../ContextParent'; 


const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

const { width, height } = Dimensions.get('window');

const fallbackImages = [
  vrvv,
  require('../../../assets/images/1.jpg'),
  require('../../../assets/images/2.jpg'),
];

const ProductDetailPage = () => {
    const { cartItems, setCartItems, cartCount, setCartCount } = useCart();

    // console.log(cartItems,'cartItemscartItemscartItemscartItemsr');
    

  const [products, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isSlideDisabled, setIsSlideDisabled] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  // const [cartCount1, setCartCount1] = useState(0);
  const [showToast, setShowToast] = useState(false);
const [interpolatedColor, setInterpolatedColor] = useState('#fff');
const [errorMessage, setErrorMessage] = useState('');
const errorTimeoutRef = useRef(null);


  const router = useRouter();
  const route = useRoute();

  const { id, variantId } = route.params || {};
<<<<<<<<< Temporary merge branch 1
=========

  console.log(id,'ed389e93e93e8');
>>>>>>>>> Temporary merge branch 2
  

  const modalizeRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(30)).current;

  const showError = (message) => {
  setErrorMessage(message);
  // Auto-hide after 3 seconds
  if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
  errorTimeoutRef.current = setTimeout(() => {
    setErrorMessage('');
  }, 3000);
};

  useEffect(() => {
    const fetchData = async ()=> {
      try {
        setLoading(true);
        setError(null);
        const data = await productDetailPage(id);
        setProduct(data);
        // console.log(data,'DDDDDDDD');
        if (data?.variants?.length > 0) {
         const firstVariant = data.variants.find(x => x._id === variantId);
         setSelectedColor(firstVariant.color.name)
          const availableSize = firstVariant.sizes.find(s => s.stock > 0);
          if (availableSize) setSelectedSize(availableSize.size);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    setIsSlideDisabled(!selectedSize || selectedStock === 0);
  }, [selectedSize, selectedColor]);

  const selectedVariant = products?.variants?.find(
    (variant) => variant.color.name === selectedColor
  ) || products?.variants?.[0];

useEffect(() => {
  if (products && selectedVariant) {
    addToPreviouslyViewed({
      id: products._id,
      rating: products.ratings,
      name: products.name,
      variants: selectedVariant,
    });
  }
}, [products, selectedVariant]);

useEffect(() => {
  const listener = scrollY.addListener(({ value }) => {
    const color = value < 150 ? '#fff' : '#000'; // Simplified threshold
    setInterpolatedColor(color);
  });

  return () => scrollY.removeListener(listener);
}, []);
  const selectedStock = selectedVariant?.sizes?.find(
    (s) => s.size === selectedSize
  )?.stock || 0;

  const productImages = React.useMemo(() => {
    if (selectedVariant?.images?.length > 0) {
      return selectedVariant.images.map(img => ({ uri: img.url }));
    }
    return fallbackImages;
  }, [selectedVariant]);

  const discountPercentage = React.useMemo(() => {
    if (selectedVariant?.mrp && selectedVariant?.price) {
      return Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100);
    }
    return 0;
  }, [selectedVariant]);
  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 300], outputRange: ['transparent', '#fff'], extrapolate: 'clamp',
  });
  const headerTitleColor = scrollY.interpolate({
  inputRange: [0, 300],
  outputRange: ['#fff', '#000'],
  extrapolate: 'clamp',
});
const iconColor = scrollY.interpolate({
  inputRange: [0, 300],
  outputRange: ['#fff', '#000'],
  extrapolate: 'clamp',
});
  const showAddToCartToast = () => {
    setShowToast(true);
    Animated.parallel([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(toastTranslateY, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(toastTranslateY, { toValue: 30, duration: 300, useNativeDriver: true }),
        ]).start(() => setShowToast(false));
      }, 1500);
    });
  };


const handleAddToCart = async () => {
  // Step 1: Securely get the current available stock for the selected variant & size
  const currentStock = selectedVariant?.sizes?.find(s => s.size === selectedSize)?.stock || 0;

  // Step 2: Prepare the product data to add (do not mutate input!)
  const productData = {
    productId: products._id,
    variantId: selectedVariant?._id,
    name: products.name,
    size: selectedSize,
    quantity,
    merchantId: products.merchantId._id,
    image: selectedVariant?.images?.[0]?.url,
  };

  try {
    // Step 3: Fetch the latest cart (ensure consistency)
    const latestCart = await GetCart();
    const cartItemsSafe = latestCart.items || [];

    // Step 4: Check if identical item exists already (by product, variant, size)
    const existingItem = cartItemsSafe.find(
      item =>
        item.productId === productData.productId &&
        item.variantId === productData.variantId &&
        item.size === productData.size
    );
    const existingQty = existingItem?.quantity || 0;
    const totalRequest = existingQty + quantity;

    // Step 5: Deny if not enough stock (avoid server roundtrips later)
    if (totalRequest > currentStock) {
      showError(
        `Only ${currentStock} items available. You already have ${existingQty} in cart.`
      );
      return;
    }

    // Step 6: Merchant consistency enforcement (cart hygiene)
    const cartMerchant =
      cartItemsSafe[0]?.merchantId?._id || cartItemsSafe[0]?.merchantId;
    if (
      cartItemsSafe.length > 0 &&
      cartMerchant &&
      cartMerchant !== productData.merchantId
    ) {
        Alert.alert(
          'Clear Cart?',
          'Your cart contains items from another shop. Clear the cart and add this new item?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => console.log('User cancelled adding')
            },
            {
              text: 'Clear Cart',
              style: 'destructive',
              onPress: async () => {
                try {
                  await clearCart();
                  setCartItems([]);
                  setCartCount(0);

                  // ✅ Add the product after clearing
                  await AddProducttoCart(productData);
                  setCartItems([productData]);
                  setCartCount(1);
                  showAddToCartToast();
                  setTimeout(() => {
                    modalizeRef.current?.close();
                  }, 0);
                } catch (error) {
                  console.error('Error while clearing and adding:', error);
                }
              }
            }
          ]
        );
         return;
    }
    await AddProducttoCart(productData);

    // Step 8: Update UI state
    setCartItems(prev => [...prev, productData]);
    setCartCount(count => count + 1);
    showAddToCartToast();
    setQuantity(1);
  } catch (error) {
    // Graceful robust error message bubbling
    const backendMsg =
      error?.response?.data?.message || 'Failed to add to cart. Please try again.';
    showError(backendMsg);
  } finally {
    // Always close sheet immediately after handling
    setTimeout(() => {
      modalizeRef.current?.close();
    }, 0);
  }
};

  if (loading) return <Loader />;


  if (error || !products || Object.keys(products).length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Product not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
<View style={styles.container}>
<Animated.View style={[styles.topBar, { backgroundColor: headerBackgroundColor }]}>
  <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
<Ionicons name="chevron-back" size={24} color={interpolatedColor} />
  </TouchableOpacity>

  <Animated.Text style={[styles.headerTitle, { color: headerTitleColor }]} numberOfLines={1}>
    {products?.brandId?.name || 'Product Details'}
  </Animated.Text>

  <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(stack)/ShoppingBag')}>
    <View style={styles.iconWithBadge}>
      <Ionicons name="bag-handle-outline" size={24} color={interpolatedColor} />
      {cartCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartCount}</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
</Animated.View>

{errorMessage !== '' && (
  <ErrorMessage message={errorMessage} />
)}

        <Animated.ScrollView
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 240 }}
        >
          <View style={styles.carouselWrapper}>
            <FlatList
              data={productImages}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                setActiveIndex(index);
              }}
              renderItem={({ item }) => (
                <Image source={item} style={styles.productImage} defaultSource={fallbackImages[0]} />
              )}
            />
            <View style={styles.dotsContainer}>
              {productImages.map((_, index) => (
                <View key={index} style={[styles.dot, index === activeIndex && styles.activeDot]} />
              ))}
            </View>
            <TouchableOpacity style={styles.heartButton}>
              <Ionicons name="heart-outline" size={20} color="#fff" />
            </TouchableOpacity>
            {discountPercentage > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
              </View>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {products?.name || 'Product Name'}
            </Text>

            <View style={styles.rowBetween}>
              <View style={styles.priceSection}>
                <Text style={styles.price}>
                  ₹{selectedVariant?.price || 0}{' '}
                  {selectedVariant?.mrp && selectedVariant.mrp > selectedVariant.price && (
                    <Text style={styles.strike}>₹{selectedVariant.mrp}</Text>
                  )}
                </Text>

                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{products?.ratings || 0} Stars</Text>
                </View>

                {products?.variants?.length > 1 && (
                  <View>
                    <View style={styles.colorRow}>
                      {products.variants.map((variant, idx) => {
                        const colorName = variant.color.name;
                        const colorHex = variant.color.hex || '#CCCCCC';
                        const isSelected = selectedColor === colorName;
                        return (
                          <TouchableOpacity
                            key={idx}
                            style={[
                              styles.colorCircle,
                              {
                                backgroundColor: colorHex,
                                borderColor: isSelected ? '#000' : '#ccc',
                                borderWidth: isSelected ? 2 : 1,
                                shadowColor: isSelected ? '#000' : 'transparent',
                                shadowOffset: isSelected ? { width: 0, height: 2 } : { width: 0, height: 0 },
                                shadowOpacity: isSelected ? 0.25 : 0,
                                shadowRadius: isSelected ? 6 : 0,
                                elevation: isSelected ? 6 : 0, // Android
                              },
                            ]}
                            onPress={() => {
                              setSelectedColor(colorName);
                              setSelectedSize(null);
                            }}
                          />
                        );
                      })}
                    </View>
                    <Text style={styles.optionLabel}>Color: {selectedColor}</Text>
                  </View>
                )}
              </View>

              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.circleButton}
                  onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  <Text style={styles.buttonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.circleButton}
                  onPress={() => setQuantity(prev => Math.min(selectedStock, prev + 1))}
                  disabled={quantity >= selectedStock}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {products?.features && Object.keys(products.features).length > 0 && (
              <View style={styles.featuresContainer}>
                <Text style={styles.optionLabel}>Features:</Text>
                {Object.entries(products.features).map(([key, value]) => (
                  <Text key={key} style={styles.featureText}>• {key}: {value}</Text>
                ))}
              </View>
            )}

            <Text style={styles.description}>
              {products?.description || 'No description available.'}
              <Text style={styles.readMore}> Read More...</Text>
            </Text>
          </View>

          <YouMayLike />
        </Animated.ScrollView>

        <View style={styles.fixedButton}>
          <TouchableOpacity style={styles.addToBagButton} onPress={() => modalizeRef.current?.open()}>
            <Text style={styles.addToBagText}>ADD TO BAG</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modalize
        ref={modalizeRef}
        modalHeight={height * 0.33}
        handleStyle={styles.modalHandle}
        modalStyle={styles.modal}
        scrollViewProps={{ contentContainerStyle: { flexGrow: 1 } }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.sectionTitle}>Select Size</Text>
          <View style={styles.sizeRow}>
            {selectedVariant?.sizes?.map((s) => (
              <TouchableOpacity
                key={s._id}
                style={[styles.sizeOption, {
                  borderColor: selectedSize === s.size ? '#000' : '#ccc',
                  borderWidth: selectedSize === s.size ? 2 : 1,
                  backgroundColor: selectedSize === s.size ? '#eee' : '#fff',
                  opacity: s.stock === 0 ? 0.4 : 1,
                }]}
                onPress={() => s.stock > 0 && setSelectedSize(s.size)}
              >
                <Text style={[styles.sizeText, { fontWeight: selectedSize === s.size ? 'bold' : 'normal' }]}>
                  {s.size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedSize && (
            <Text style={[styles.stockText, { color: selectedStock > 0 ? 'green' : 'red' }]}>
              {selectedStock > 0 ? `${selectedStock} in stock` : 'Out of stock'}
            </Text>
          )}
        </View>

        <View style={styles.modalButton}>
          <TouchableOpacity
            style={[
              styles.selectButton,
              { backgroundColor: isSlideDisabled ? '#ccc' : '#000' },
            ]}
            disabled={isSlideDisabled}
            onPress={() => {
              // console.log('Button Pressed'); // test log
              handleAddToCart();
            }}
          >
            <Text style={styles.selectButtonText}>
              {isSlideDisabled ? 'Select Size' : 'SELECT'}
            </Text>
          </TouchableOpacity>

        </View>
      </Modalize>

      {showToast && (
        <Animated.View style={[styles.toast, {
          transform: [{ translateY: toastTranslateY }],
          opacity: toastOpacity,
        }]}>
          <Text style={styles.toastText}>ADDED TO CART</Text>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, height: 70, borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
  },
  iconButton: { padding: 8 },
  headerTitle: { flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 16, fontFamily: 'Montserrat', textTransform: 'uppercase', },
  iconWithBadge: { position: 'relative' },
  badge: {
    position: 'absolute', top: -6, right: -6, backgroundColor: 'red', borderRadius: 8,
    width: 16, height: 16, justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  carouselWrapper: { position: 'relative' },
  productImage: { width, height: 540, resizeMode: 'cover', borderBottomRightRadius: 50, borderBottomLeftRadius: 50 },
  dotsContainer: {
    position: 'absolute', bottom: 10, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4, backgroundColor: '#fff' },
  activeDot: { backgroundColor: '#eee', width: 14, height: 14, borderRadius: 7 },
  heartButton: {
    position: 'absolute', bottom: 16, right: 20, zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 8,
  },
  discountBadge: {
    position: 'absolute', bottom: 16, left: 20, zIndex: 10,
    backgroundColor: '#FF4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },
  discountText: { color: '#fff', fontSize: 12, fontWeight: 'bold', fontFamily: 'Montserrat' },

  infoContainer: { padding: 10 },
  title: { fontSize: 20, fontWeight: '600', fontFamily: 'Montserrat', marginLeft: 5,},
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 4 },
  priceSection: { flex: 1, gap: 4 },
  price: { fontSize: 20, fontWeight: 'bold', fontFamily: 'Montserrat', paddingLeft: 4 },
  strike: { textDecorationLine: 'line-through', fontSize: 14, color: '#888', marginLeft: 5, fontFamily: 'Montserrat' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  ratingText: { marginLeft: 5, fontSize: 12, color: '#888', fontFamily: 'Montserrat' },
  
  colorRow: { flexDirection: 'row', paddingLeft: 4, paddingTop: 2, flexWrap: 'wrap' },
  colorCircle: { width: 30, height: 30, borderRadius: 15, marginRight: 10, borderWidth: 1 },
  optionLabel: { fontSize: 14, fontWeight: '600', marginBottom: 5, marginTop: 10, fontFamily: 'Montserrat' },

  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  circleButton: {
    width: 50, height: 50, borderRadius: 16, borderWidth: 1, borderColor: '#ccc',
    justifyContent: 'center', alignItems: 'center', marginHorizontal: 5,
  },
  buttonText: { fontSize: 18, fontFamily: 'Montserrat' },
  quantityText: { fontSize: 16, minWidth: 20, textAlign: 'center', fontFamily: 'Montserrat' },

  featuresContainer: { marginTop: 10 },
  featureText: { fontSize: 12, color: '#666', fontFamily: 'Montserrat', marginLeft: 10 },
  description: { fontSize: 14, marginVertical: 10, color: '#444', fontFamily: 'Montserrat' },
  readMore: { color: '#007BFF', fontWeight: '500', fontFamily: 'Montserrat' },

  fixedButton: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff',
    borderTopRightRadius: 40, borderTopLeftRadius: 40, borderTopWidth: 2,
    borderRightWidth: 1, borderLeftWidth: 1, borderColor: '#eee',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  addToBagButton: {
    height: 70, backgroundColor: '#000', borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
  },
  addToBagText: { color: '#fff', fontSize: 23, fontWeight: 'bold', fontFamily: 'Montserrat' },

  modal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 10 },
  modalHandle: { backgroundColor: '#ccc', width: 60, height: 6, borderRadius: 3, alignSelf: 'center', marginVertical: 10 },
  modalContent: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8, marginTop: 12, fontFamily: 'Montserrat' },
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, marginTop: 12, marginLeft: 15 },
  sizeOption: {
    borderRadius: 30, width: 50, height: 50, marginRight: 10, marginBottom: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  sizeText: { textAlign: 'center' },
  stockText: { marginLeft: 15, fontSize: 14, fontFamily: 'Montserrat' },
  errorBox: {
  position: 'absolute',
  top: 80,
  left: 20,
  right: 20,
  padding: 12,
  backgroundColor: '#ffe0e0',
  borderColor: '#ff4d4d',
  borderWidth: 1,
  borderRadius: 8,
  zIndex: 100,
  elevation: 10,
},

errorText: {
  color: '#b00020',
  fontSize: 14,
  textAlign: 'center',
  fontWeight: 'bold',
},
  modalButton: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff',
    paddingHorizontal: 16, paddingBottom: 24,
  },
  selectButton: { height: 70, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  selectButtonText: { color: '#fff', fontSize: 23, fontWeight: 'bold', fontFamily: 'Montserrat' },

  toast: {
    position: 'absolute', bottom: 110, alignSelf: 'center', zIndex: 1000,
    backgroundColor: '#2DBE74', paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 20, width: 200, height: 50, justifyContent: 'center', alignItems: 'center',
  },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600', fontFamily: 'Montserrat' },

  errorText: { fontSize: 16, fontFamily: 'Montserrat', color: '#FF4444', textAlign: 'center', marginBottom: 20 },
  retryButton: { backgroundColor: '#000', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  retryButtonText: { color: '#fff', fontFamily: 'Montserrat', fontWeight: '600' },
});

export default ProductDetailPage;