import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface Address {
  id: string;
  name: string;
  address: string;
  contact: string;
  email: string;
  distance: string;
}

const addresses: Address[] = [
  {
    id: '1',
    name: 'Antony Efron',
    address: 'Kachappilly House, Maradu P.O, Ernakulam, Cochin, KL, 682304',
    contact: '8138834116',
    email: 'antonyefron007@gmail.com',
    distance: '20Km',
  },
  {
    id: '2',
    name: 'Sikha',
    address: 'North Paravur, KL, 682509',
    contact: '8138834116',
    email: 'antonyefron007@gmail.com',
    distance: '20Km',
  },
];

const SelectAddressBottomSheet = () => {
  const modalizeRef = useRef<Modalize>(null);
  const router = useRouter();
  const navigation = useNavigation();

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  return (
    <>
      {/* Bottom Checkout Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.slideToPayContainer}>
          <TouchableOpacity style={styles.slideTrack} onPress={onOpen}>
            <Text style={styles.slideText}>PROCEED TO CHECKOUT</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Address Selector Modal */}
      <Modalize
        ref={modalizeRef}
        modalHeight={height * 0.75}
        handleStyle={styles.handle}
        modalStyle={styles.modal}
        flatListProps={{
          data: addresses,
          keyExtractor: item => item.id,
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
                <Text style={styles.label}>{item.name}</Text>
              </View>
              <Text style={styles.address}>{item.address}</Text>
              <Text style={styles.phone}>
                Phone number: <Text style={styles.phoneBold}>{item.contact}</Text>
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

              <TouchableOpacity
                style={styles.addAddressButton}
                onPress={() =>
                  navigation.navigate('(stack)/ProductDetail/LocationselectionPage')
                }
              >
                <Ionicons name="add" size={18} color="#FF5A5F" style={{ opacity: 0.5 }} />
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    // borderTopWidth: 1,
    borderColor: '#ddd',
    zIndex: 999,
    elevation: 10,
    height: 90,
    borderTopRightRadius:30,
    borderTopLeftRadius:30,

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
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
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
  heading: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Montserrat',
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  addAddressText: {
    color: '#FF5A5F',
    fontSize: 16,
    marginLeft: 10,
    opacity: 0.5,
    fontFamily: 'Montserrat',
  },
  savedLabel: {
    color: '#888',
    fontSize: 12,
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 4,
  },
  distanceIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#292929',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  icon: {
    marginRight: 6,
  },
  distance: {
    color: '#aaa',
    fontSize: 12,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  address: {
    color: '#ccc',
    marginTop: 2,
    fontFamily: 'Raleway',
  },
  phone: {
    color: '#aaa',
    marginTop: 6,
  },
  phoneBold: {
    color: '#ccc',
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingRight: 20,
  },
});

export default SelectAddressBottomSheet;