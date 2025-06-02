import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Modalize } from 'react-native-modalize';
import ReviewScroreSection from '../../../components/DetailPageComponents/ReviewScroreSection';
import vrvv from '../../../assets/images/4.jpg'
import { useNavigation } from '@react-navigation/native';


const { width } = Dimensions.get('window');

const addresses = [
  {
    id: '1',
    name: 'antony efron',
    address:
      'kachappilly house, kachappilly house, fr george vakayil road, maradu p.o, ernakulam, Cochin, KL, 682304',
    contact: '8138834116',
    email: 'antonyefron007@gmail.com',
  },
  {
    id: '2',
    name: 'Sikha',
    address: 'North Paravur, KL, 682509',
    contact: '8138834116',
    email: 'antonyefron007@gmail.com',
  },
];

const ProductDetailPage = () => {
  const router = useRouter();
  
  const { image1, title, price, oldPrice, discount, rating, delivery, offerPrice} = useLocalSearchParams();
  console.log(image1);
  const navigation = useNavigation();
  

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isSlideDisabled, setIsSlideDisabled] = useState(true);
  const modalizeRef = useRef<Modalize>(null);
  // const onOpen = () => modalizeRef.current?.open();

  useEffect(() => {
    setIsSlideDisabled(!(selectedSize && selectedColor));
  }, [selectedSize, selectedColor]);

  const slideAnimation = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
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
            // onOpen();
            router.push('/ShoppingBag'); 
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
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
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
          <View style={styles.imageWrapper}>
            <Image source={vrvv} style={styles.productImage} />

            {/* Wishlist button (bottom-left) */}
            <TouchableOpacity style={styles.cartButton}>
              <Ionicons name="heart-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          
          <View style={styles.infoContainer}>
            <View style={styles.infoHeaderRow}>
              <View>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.price}>
                  ₹{price}{' '}
                  <Text style={styles.strike}>₹{oldPrice}</Text>
                </Text>
              </View>
            </View>

            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{rating} Stars</Text>
            </View>

            <View style={styles.flexRowSpaceBetween}>
            <Text style={styles.description} >
              A stylish and elegant piece, great for any occasion.
              <Text style={styles.readMore}> Read More...</Text>
            </Text>
            <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
                  style={styles.circleButton}
                >
                  <Text style={styles.buttonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  onPress={() => setQuantity(prev => prev + 1)}
                  style={styles.circleButton}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
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
              // disabled={isSlideDisabled}
              onPress={() => modalizeRef.current?.open()}
            >
              <Text style={styles.slideText}>ADD TO BAG</Text>
            </TouchableOpacity>
        </View>
        </View>
      </View>

<Modalize
  ref={modalizeRef}
  modalHeight={Dimensions.get('window').height * 0.35}
  handleStyle={styles.handle}
  modalStyle={styles.modal}
  scrollViewProps={{ contentContainerStyle: { flexGrow: 1 } }}
>
  <View style={styles.fixedSelectorsRow}>
    {/* Size Section */}
    <Text style={styles.sectionTitle}>Select Size</Text>
      <View style={styles.optionsRow}>
        {['S', 'M', 'L', 'XL'].map(size => (
          <TouchableOpacity
            key={size}
            style={[
              styles.sizeOption,
              {
                borderColor: selectedSize === size ? '#000' : '#ccc',
                borderWidth: selectedSize === size ? 2 : 1,
                borderRadius: selectedSize === size ? 6 : 8,
              },
            ]}
            onPress={() => setSelectedSize(size)}
          >
            <Text>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>

    {/* Color Section */}
    <Text style={styles.sectionTitle}>Select Color</Text>
      <View style={styles.optionsRow}>
        {['#E1E1E1', '#000000', '#D4CFCF'].map((color, idx) => {
          const isSelected = selectedColor === color;
          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.colorCircle,
                {
                  backgroundColor: color,
                  opacity: isSelected ? 1 : 0.5,
                  borderColor: isSelected ? '#000' : '#ccc',
                  borderWidth: isSelected ? 2 : 1,
                  borderRadius: isSelected ? 12 : 15,
                },
              ]}
              onPress={() => setSelectedColor(color)}
            />
          );
        })}
      </View>
  </View>

  {/* Fixed Select Button */}
  <View style={styles.selectButtonContainer}>
    <TouchableOpacity
      style={[
        styles.slideTrack2,
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
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, height: 70, zIndex: 20, elevation: 4,
  },
  headerTitle: {
    flex: 1, textAlign: 'center', fontWeight: 'bold',
    fontSize: 16, marginHorizontal: 10,
  },
  imageWrapper: { position: 'relative' },
  productImage: { width: '100%', height: 400, resizeMode: 'cover' },
  infoContainer: { padding: 16 },
  infoHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  title: { fontSize: 20, fontWeight: '600',fontFamily:'Montserrat'},
  price: { fontSize: 18, fontWeight: 'bold' },
  strike: { textDecorationLine: 'line-through', fontSize: 14, color: '#888', marginLeft: 5 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  ratingText: { marginLeft: 5, fontSize: 14, color: '#888' },
  description: { fontSize: 14, marginVertical: 10, color: '#444', width:200 },
  readMore: { color: '#007BFF', fontWeight: '500' },
  optionsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sizeOption: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginRight: 10 },
  colorCircle: { width: 30, height: 30, borderRadius: 15, marginRight: 10, borderWidth: 1, borderColor: '#ccc' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  circleButton: { width: 50, height: 50, borderRadius: 16, borderWidth: 1, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 },
  quantityText: { fontSize: 16, minWidth: 20, textAlign: 'center' },
  fixedButtonRow: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ccc',
  },
  fixedSelectorsRow: {
    alignItems: 'flex-start',
    paddingHorizontal: 16, paddingTop: 10,  paddingBottom: 10,
  },
  slideToPayContainer: { width: '100%', paddingHorizontal: 16, paddingVertical: 10 },
  slideTrack: {
    height: 70, backgroundColor: '#000', borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', position: 'relative',
  },
    slideTrack2: {
    height: 70, backgroundColor: '#000', borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', position: 'relative',
  },
  slideThumb: {
    position: 'absolute', left: 5, width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 4,
  },
  slideArrows: { flexDirection: 'row', alignItems: 'center' },
  slideText: { color: '#fff', fontSize: 23, fontWeight: 'bold', left: 10 , fontFamily: 'Montserrat'},
  card: {
    backgroundColor: '#f9f9f9', margin: 10, padding: 15,
    borderRadius: 10, elevation: 2,
  },
  address: { fontSize: 14, color: '#333' },
  phone: { fontSize: 14, marginTop: 4, color: '#666' },
  phoneBold: { fontWeight: 'bold' },
  flexRowSpaceBetween: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8,
  },
  handle: {
    backgroundColor: '#ccc', width: 60, height: 6, borderRadius: 3,
    alignSelf: 'center', marginVertical: 10,
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingTop: 10, paddingHorizontal: 16,
  },
  topRow: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 4 },
  distanceIconRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#292929',
    paddingVertical: 4, paddingHorizontal: 8, borderRadius: 20, marginRight: 10,
  },
  icon: { marginRight: 6 , borderRadius:30},
  distance: { color: '#aaa', fontSize: 12 },
  label: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  address: { color: '#ccc', marginTop: 2 },
  phone: { color: '#aaa', marginTop: 6 },
  phoneBold: { color: '#ccc', fontWeight: 'bold' },
  actionRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 12,
    paddingRight: 20,
  },
  heading: { color: '#000', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  addAddressButton: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1F1F1F', paddingVertical: 14, paddingHorizontal: 20,
    borderRadius: 12, marginBottom: 20,
  },
  addAddressText: { color: '#FF5A5F', fontSize: 16, marginLeft: 10 },
  savedLabel: {
    color: '#888', fontSize: 12, letterSpacing: 1.2,
    marginBottom: 10, marginTop: 10,
  },
  card: {
    backgroundColor: '#1E1E1E', borderRadius: 12,
    padding: 16, marginBottom: 16,
  },
  wishlistButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  
  cartButton: {
    position: 'absolute',
    bottom: 16,
    right:20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  sectionTitle: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 8,
  marginTop: 12,
},
selectButtonContainer: {
  paddingHorizontal: 16,
  paddingBottom: 24,
  paddingTop: 16,
  position:'relative'
},
});


export default ProductDetailPage;
