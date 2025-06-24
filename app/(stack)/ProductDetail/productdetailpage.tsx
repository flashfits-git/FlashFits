import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Modalize } from 'react-native-modalize';
import ReviewScroreSection from '../../../components/DetailPageComponents/ReviewScroreSection';
import vrvv from '../../../assets/images/4.jpg';
import YouMayLike from '../../../components/DetailPageComponents/YouMayLike'

const { width, height } = Dimensions.get('window');

const productImages = [
  vrvv,
  require('../../../assets/images/1.jpg'),
  require('../../../assets/images/2.jpg'),
];

const ProductDetailPage = () => {
  const router = useRouter();
  const { item } = useLocalSearchParams();
  const product = typeof item === 'string' ? JSON.parse(item) : item;

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(product.variants?.[0]?.color?.hex || null);
  const [isSlideDisabled, setIsSlideDisabled] = useState(true);
  const modalizeRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const scrollY = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const maxSlide = width * 0.7;

  const [showToast, setShowToast] = useState(false);
const toastOpacity = useRef(new Animated.Value(0)).current;
const toastTranslateY = useRef(new Animated.Value(30)).current; // Start slightly lower

    const [pro, setProducts] = useState([
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


const showAddToCartToast = () => {
  setShowToast(true);
  Animated.parallel([
    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.timing(toastTranslateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }),
  ]).start(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(toastTranslateY, {
          toValue: 30,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setShowToast(false));
    }, 1500);
  });
};


  const selectedVariant = product.variants.find(
    (variant) => variant.color.hex === selectedColor


  );

  const selectedStock = selectedVariant?.sizes.find(
    (s) => s.size === selectedSize
  )?.stock || 0;

  useEffect(() => {
    setIsSlideDisabled(!selectedSize || selectedStock === 0);
  }, [selectedSize, selectedColor]);

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: ['transparent', '#fff'],
    extrapolate: 'clamp',
  });

  // const headerBorderColor = scrollY.interpolate({
  //   inputRange: [0, 400],
  //   outputRange: ['transparent', '#ccc'],
  //   extrapolate: 'clamp',
  // });

  return (
    <>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.topBarContainer,
            {
              backgroundColor: headerBackgroundColor,
              borderBottomLeftRadius:20,
              borderBottomRightRadius:20,
              // borderBottomWidth: 1,
              // borderBottomColor: headerBorderColor,

            },
          ]}
        >
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {product.brandId?.name}
          </Text>

            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(stack)/ShoppingBag')} >
              <View style={styles.iconWithBadge}>
                <Ionicons name="bag-handle-outline" size={24} color="#000" />
                {cartCount > 0 && ( // 👈 only show when > 0
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>


        </Animated.View>

        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
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
                const index = Math.round(
                  e.nativeEvent.contentOffset.x / width
                );
                setActiveIndex(index);
              }}
              renderItem={({ item }) => (
                <Image source={item} style={styles.productImage} />
              )}
            />
            <View style={styles.dotsContainer}>
              {productImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === activeIndex && styles.activeDot,
                  ]}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.cartButton}>
              <Ionicons name="heart-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoHeaderRow}>
              <View>
                <Text style={styles.title} numberOfLines={1}>
                  {product.name}
                </Text>


                <View style={styles.rowBetweenContainer}>

                <View style={styles.priceRatingContainer}>
                <Text style={styles.price}>
                  ₹{product.price}{' '}
                  <Text style={styles.strike}>₹{product.mrp}</Text>
                </Text>

                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{product.ratings} Stars</Text>
                  </View>
                      {product?.variants?.length > 1 && (
                        <View style={styles.optionsRow1}>
                          {product.variants.map((variant, idx) => {
                            const colorHex = variant.color.hex;
                            const isSelected = selectedColor === colorHex;
                            return (
                              <TouchableOpacity
                                key={idx}
                                style={[
                                  styles.colorCircle,
                                  {
                                    backgroundColor: colorHex,
                                    opacity: isSelected ? 1 : 0.5,
                                    borderColor: isSelected ? '#000' : '#ccc',
                                    borderWidth: isSelected ? 2 : 1,
                                    borderRadius: isSelected ? 12 : 15,
                                  },
                                ]}
                                onPress={() => setSelectedColor(colorHex)}
                              />
                            );
                          })}
                        </View>
                      )}
                </View>

                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      style={styles.circleButton}
                    >
                      <Text style={styles.buttonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity
                      onPress={() => setQuantity((prev) => prev + 1)}
                      style={styles.circleButton}
                    >
                      <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                  </View>

                </View>


              </View>
            </View>

                        <Text style={styles.description}>
                          {product.description}
                          <Text style={styles.readMore}> Read More...</Text>
                        </Text>                    

          </View>

          {/* <ReviewScroreSection /> */}
          <YouMayLike products={pro}/>
        </Animated.ScrollView>
          {/* <ReviewScroreSection /> */}


        <View style={styles.fixedButtonRow}>
          <View style={styles.slideToPayContainer}>
            <TouchableOpacity
              style={styles.slideTrack}
              activeOpacity={0.8}
              onPress={() => modalizeRef.current?.open()}
            >
              <Text style={styles.slideText}>ADD TO BAG</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modalize
        ref={modalizeRef}
        modalHeight={height * 0.3}
        handleStyle={styles.handle}
        modalStyle={styles.modal}
        scrollViewProps={{ contentContainerStyle: { flexGrow: 1 } }}
      >
        <View style={styles.fixedSelectorsRow}>
          <Text style={styles.sectionTitle}>Select Size</Text>

          <View style={styles.optionsRow}>
            {selectedVariant?.sizes.map((s) => (
              <TouchableOpacity
                key={s.size}
                style={[
                  styles.sizeOption,
                  {
                    borderColor: selectedSize === s.size ? '#000' : '#ccc',
                    borderWidth: selectedSize === s.size ? 2 : 1,
                    backgroundColor: selectedSize === s.size ? '#eee' : '#fff',
                    opacity: s.stock === 0 ? 0.4 : 1,
                  },
                ]}
                onPress={() => s.stock > 0 && setSelectedSize(s.size)}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: selectedSize === s.size ? 'bold' : 'normal',
                  }}
                >
                  {s.size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
{/* 
          {selectedSize && (
            <Text style={{ marginLeft: 15, fontSize: 14, color: selectedStock > 0 ? 'green' : 'red' }}>
              {selectedStock > 0 ? `${selectedStock} in stock` : 'Out of stock'}
            </Text>
          )} */}
        </View>

        <View style={styles.selectButtonContainer}>
          <TouchableOpacity
            style={[
              styles.slideTrack,
              { backgroundColor: isSlideDisabled ? '#ccc' : '#000' },
            ]}
            activeOpacity={0.8}
            disabled={isSlideDisabled}
            onPress={() => {
                showAddToCartToast();
                setCartCount(prev => prev + quantity); // 👈 increase by current quantity
                modalizeRef.current?.close();
              }}
          >
            <Text style={styles.slideText}>Select</Text>
          </TouchableOpacity>
        </View>
      </Modalize>
{showToast && (
  <Animated.View
    style={[
      {
        position: 'absolute',
        bottom: 110,
        alignSelf: 'center',
        backgroundColor: '#2DBE74',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        zIndex: 1000,
        width: 200,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateY: toastTranslateY }],
        opacity: toastOpacity,
      },
    ]}
  >
    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600', fontFamily: 'Montserrat', }}>
      ADDED TO CART!
    </Text>
  </Animated.View>
)}
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  topBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 70,
    zIndex: 20,
    elevation: 4,
  },

  iconButton: { padding: 8 },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Montserrat',
  },

  carouselWrapper: { position: 'relative' },

  productImage: { width, height:540, resizeMode: 'cover', borderBottomRightRadius:20, borderBottomLeftRadius:20 },

  cartButton: {
    position: 'absolute',
    bottom: 16,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  
  iconWithBadge: {
  position: 'relative',
},

badge: {
  position: 'absolute',
  top: -6,
  right: -6,
  backgroundColor: 'red',
  borderRadius: 8,
  width: 16,
  height: 16,
  justifyContent: 'center',
  alignItems: 'center',
},

badgeText: {
  color: '#fff',
  fontSize: 10,
  fontWeight: 'bold',
},



  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#fff',
  },

  rowBetweenContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%', // or a fixed width if needed
  // paddingHorizontal: 16, // optional for inner spacing
},

  activeDot: {
    backgroundColor: '#eee',
    width: 14,
    height: 14,
    borderRadius: 7,
  },

  infoContainer: { padding: 16 },

  infoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    width: 360,
    fontFamily: 'Montserrat',
  },

price: {
  fontSize: 18,
  fontWeight: 'bold',
  fontFamily: 'Montserrat',
  alignSelf: 'flex-start', // 🔥 aligns it to the top-left of the parent
  paddingLeft:4
},
  strike: {
    textDecorationLine: 'line-through',
    fontSize: 14,
    color: '#888',
    marginLeft: 5,
    fontFamily: 'Montserrat',
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  priceRatingContainer: {
  flexDirection: 'column',
  alignItems: 'flex-start', // or 'center' as needed
  gap: 4, // optional, use if using newer React Native versions
},

  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#888',
    fontFamily: 'Montserrat',
  },

  description: {
    fontSize: 14,
    marginVertical: 10,
    color: '#444',
    width: '100%',
    fontFamily: 'Montserrat',
  },

  readMore: {
    color: '#007BFF',
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },

quantityContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  // alignSelf: 'flex-start', // Aligns the container to the top/left of parent
  marginTop: 10,
},

  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },

  buttonText: {
    fontSize: 18,
    fontFamily: 'Montserrat',
  },

  quantityText: {
    fontSize: 16,
    minWidth: 20,
    textAlign: 'center',
    fontFamily: 'Montserrat',
  },

  flexRowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },

optionsRow1: {
  flexDirection: 'row',
  justifyContent: 'flex-start', // ✅ use this instead of 'start'
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  paddingLeft:4,
  paddingTop:2
  // marginTop: 10,
  // marginBottom:5
},

  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },

fixedButtonRow: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '#fff',
  borderTopRightRadius: 40,
  borderTopLeftRadius: 40, // ✅
  borderTopWidth:2,
  borderRightWidth:1,
  borderLeftWidth:1,
  borderColor:'#eee',

},

  slideToPayContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 10,
        borderTopRightRadius:20,
    borderTopLeftRadius:20
  },

  slideTrack: {
    height: 70,
    backgroundColor: '#000',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    
  },

  slideText: {
    color: '#fff',
    fontSize: 23,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },

  fixedSelectorsRow: {
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
    fontFamily: 'Montserrat',
  },

  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 12,
    marginLeft: 15,
  },

  sizeOption: {
    borderRadius: 30,
    width: 50,
    height: 50,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectButtonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    position: 'relative',
  },

  handle: {
    backgroundColor: '#ccc',
    width: 60,
    height: 6,
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 10,
  },

  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
});

export default ProductDetailPage;
