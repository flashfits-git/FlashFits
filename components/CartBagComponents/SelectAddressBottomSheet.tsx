import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList,   Animated,
  PanResponder,
  Dimensions } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons  } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


interface Address {
  id: string;
  name: string;
  address: string;
  contact: string;
  email: string;
  distance:string
}

const addresses: Address[] = [
  {
    id: '1',
    name: 'antony efron',
    address: 'kachappilly house, kachappilly house, fr george vakayil road, maradu p.o, ernakulam, Cochin, KL, 682304',
    contact: '8138834116',
    email: 'antonyefron007@gmail.com',
    distance: '20Km'
  },
  {
    id: '2',
    name: 'Sikha',
    address: 'North Paravur, KL, 682509',
    contact: '8138834116',
    email: 'antonyefron007@gmail.com',
    distance: '20Km'
  },
];
const { width } = Dimensions.get('window'); 

const SelectAddressBottomSheet = () => {
    const navigation = useNavigation();

    // const router = useRouter();
    // const [quantity, setQuantity] = useState(1);
    // const [isSlideDisabled, setIsSlideDisabled] = useState(false);
  
    // useEffect(() => {
    //   setIsSlideDisabled(!(selectedSize && selectedColor));
    // }, [selectedSize, selectedColor]);
  
    const slideAnimation = useRef(new Animated.Value(0)).current;
    const scrollY = useRef(new Animated.Value(0)).current;
    const maxSlide = width * 0.7;

  
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
            // alert('Processing payment...');
            // router.push('../(stack)/Payment'); 
            onOpen();
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

  
  const modalizeRef = useRef<Modalize>(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };
  const router = useRouter();

  return (
    <>
      <View style={styles.bottomBar}>
        <View style={styles.slideToPayContainer}>
          <View style={styles.slideTrack}>
          <Animated.View
            style={[
              styles.slideThumb,
              {
                transform: [{ translateX: slideAnimation }],
              },
            ]}
            {...panResponder.panHandlers}
          >
              <View style={styles.slideArrows}>
                <Ionicons name="chevron-forward" size={18} color="#000" />
                <Ionicons name="chevron-forward" size={18} color="#000" />
              </View>
            </Animated.View>
            <Text style={styles.slideText}>PROCEED TO CHECKOUT</Text>
          </View>
        </View>
        
      </View>
      <Modalize
  ref={modalizeRef}
  modalHeight={Dimensions.get('window').height * 0.75}
  handleStyle={styles.handle}
  modalStyle={styles.modal}
  flatListProps={{
    data: addresses,
    keyExtractor: (item) => item.id,
    renderItem: ({ item }) => (
<TouchableOpacity
  style={styles.card}
  onPress={() => router.push('/Payment')}
>
  <View style={styles.topRow}>
    <View style={styles.distanceIconRow}>
      <Ionicons name="home" size={18} color="#fff" style={styles.icon} />
      <Text style={styles.distance}>{item.distance}</Text>
    </View>
    <Text style={styles.label}>{item.label}</Text>
  </View>
  <Text style={styles.address}>{item.address}</Text>
  <Text style={styles.phone}>
    Phone number: <Text style={styles.phoneBold}>{item.phone}</Text>
  </Text>
  <View style={styles.actionRow}>
    <TouchableOpacity>
      <MaterialIcons name="more-horiz" size={22} color="#aaa" />
    </TouchableOpacity>
    <TouchableOpacity>
      <Ionicons name="share-social-outline" size={18} color="#aaa" />
    </TouchableOpacity>
  </View>
</TouchableOpacity>
    ),
    ListHeaderComponent: () => (
      <View style={styles.header}>
        <Text style={styles.heading}>Select an address</Text>

        <TouchableOpacity style={styles.addAddressButton} onPress={() => navigation.navigate('(stack)/ProductDetail/LocationselectionPage')}>
          <Ionicons name="add" size={18} color="#FF5A5F" style={{opacity:.5}}/>
          <Text style={styles.addAddressText}>Add address</Text>
        </TouchableOpacity>

        <Text style={styles.savedLabel}>SAVED ADDRESSES</Text>
      </View>
    ),
    showsVerticalScrollIndicator: false,
  }}
/>
    </>
  );
};

const styles = StyleSheet.create({
  openButton: {
    backgroundColor: '#000',
    padding: 15,
    margin: 20,
    borderRadius: 10,
  },
  openButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  handle: {
    backgroundColor: '#ccc',
    width: 80,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginVertical: 10,
  },
  modal: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addressCard1: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  name1: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  details1: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  editButton1: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 5,
  },
  editButtonText1: {
    color: '#333',
  },
  checkoutButton: {
    // position:'absolute',
    backgroundColor: '#000',
    padding: 25,
    borderRadius: 10,
    marginTop: 10,
  },
  checkoutButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:16
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 12,
    // paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    zIndex: 999,
    elevation: 10,
    height:90
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 14,
  },
  breakup: {
    color: 'green',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  topRow: {
    flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',
    marginBottom: 4,
  },
  distanceIconRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#292929',
    paddingVertical: 4, paddingHorizontal: 8, borderRadius: 20, marginRight: 10,
  },
  icon: { marginRight: 6 },
  distance: { color: '#aaa', fontSize: 12 },
  label: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  address: { color: '#ccc', marginTop: 2, fontFamily:'Raleway'  },
  phone: { color: '#aaa', marginTop: 6 },
  phoneBold: { color: '#ccc', fontWeight: 'bold' },
  actionRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 12,
    paddingRight: 20,
  },
  heading: { color: '#000', fontSize: 22, fontWeight: 'bold', marginBottom: 20, fontFamily:'Montserrat' },
  addAddressButton: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1F1F1F', paddingVertical: 14, paddingHorizontal: 20,
    borderRadius: 12, marginBottom: 20,
  },
  addAddressText: { color: '#FF5A5F', fontSize: 16, marginLeft: 10 , opacity:.5, fontFamily:'Montserrat' },
  savedLabel: {
    color: '#888', fontSize: 12, letterSpacing: 1.2,
    marginBottom: 10, marginTop: 10,
  },
  slideToPayContainer: { width: '100%', paddingHorizontal: 16, paddingVertical: 10 },
  slideTrack: {
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
  slideText: { color: '#fff', fontSize: 18, fontWeight: 'bold', left: 20,
    fontFamily:'Montserrat'
   },
  card: {
    backgroundColor: '#1E1E1E', borderRadius: 12,
    padding: 16, marginBottom: 16,
  },
});

export default SelectAddressBottomSheet;
