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
  const modalizeRef = useRef<Modalize>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollY = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const maxSlide = width * 0.7;

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: ['transparent', '#fff'],
    extrapolate: 'clamp',
  });

  const headerBorderColor = scrollY.interpolate({
    inputRange: [0, 400],
    outputRange: ['transparent', '#ccc'],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    setIsSlideDisabled(!selectedSize);
  }, [selectedSize]);

  return (
    <>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.topBarContainer,
            {
              backgroundColor: headerBackgroundColor,
              borderBottomWidth: 1,
              borderBottomColor: headerBorderColor,
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
            (STORE NAME)
          </Text>
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
                <Text style={styles.price}>
                  ₹{product.price}{' '}
                  <Text style={styles.strike}>₹{product.mrp}</Text>
                </Text>
              </View>
            </View>

            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{product.ratings} Stars</Text>
            </View>

            <View style={styles.flexRowSpaceBetween}>
              <Text style={styles.description}>
                {product.description}
                <Text style={styles.readMore}> Read More...</Text>
              </Text>

              <View>
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

                <View style={styles.optionsRow1}>
                  {product?.variants.map((variant, idx) => {
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
              </View>
            </View>
          </View>

          <ReviewScroreSection />
        </Animated.ScrollView>

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
        modalHeight={height * 0.25}
        handleStyle={styles.handle}
        modalStyle={styles.modal}
        scrollViewProps={{ contentContainerStyle: { flexGrow: 1 } }}
      >
        <View style={styles.fixedSelectorsRow}>
          <Text style={styles.sectionTitle}>Select Size</Text>

          <View style={styles.optionsRow}>
            {['S', 'M', 'L', 'XL'].map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeOption,
                  {
                    borderColor: selectedSize === size ? '#000' : '#ccc',
                    borderWidth: selectedSize === size ? 2 : 1,
                    backgroundColor: selectedSize === size ? '#eee' : '#fff',
                  },
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: selectedSize === size ? 'bold' : 'normal',
                  }}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.selectButtonContainer}>
          <TouchableOpacity
            style={[
              styles.slideTrack,
              { backgroundColor: isSlideDisabled ? '#ccc' : '#000' },
            ]}
            activeOpacity={0.8}
            disabled={isSlideDisabled}
            onPress={() => router.push('/ShoppingBag')}
          >
            <Text style={styles.slideText}>Select</Text>
          </TouchableOpacity>
        </View>
      </Modalize>
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

  productImage: { width, height: 400, resizeMode: 'cover' },

  cartButton: {
    position: 'absolute',
    bottom: 16,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
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

  activeDot: {
    backgroundColor: '#000',
    width: 14,
    height: 14,
    borderRadius: 7,
  },

  infoContainer: { padding: 16 },

  infoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    width: 330,
    fontFamily: 'Montserrat',
  },

  price: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
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
    width: 200,
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
    marginBottom: 10,
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
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
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
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },

  slideToPayContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 10,
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
