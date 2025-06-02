import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import BagProduct from '../../components/CartBagComponents/BagProduct';
import HeaderBag from '@/components/CartBagComponents/HeaderBag';
import BillSection from '@/components/CartBagComponents/BillSection';
import SelectAddressBottomSheet from '../../components/CartBagComponents/SelectAddressBottomSheet'
import { useRouter } from 'expo-router';

const CartBag = () => {
  const router = useRouter();


  return (
    <>
    <View style={styles.container}>
      <HeaderBag />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BagProduct />
              <TouchableOpacity style={styles.confirmButton} onPress={() => router.push('/(stack)/ShopDetails/StoreDetailPage')}>
                <Text style={styles.confirmButtonText}>EXPLORE MAX MORE</Text>
              </TouchableOpacity>
        <BillSection />
      </ScrollView>
    </View>
    <SelectAddressBottomSheet/>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingTop: 5,
    paddingHorizontal: 16,
    paddingBottom: 100, // <-- give extra space for the bottom bar
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    backgroundColor: '#00B140',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
    confirmButton: {
    // bottom: 20,
    // left: 16,
    // right: 16,
    backgroundColor: '#000',
    padding:20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    marginHorizontal:25
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily:'Montserrat'
  },
});

export default CartBag;
