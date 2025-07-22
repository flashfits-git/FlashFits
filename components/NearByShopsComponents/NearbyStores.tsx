import React,{useEffect, useState }from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import CardinStores from '../../components/NearByShopsComponents/CardinStores';
import { useNavigation } from 'expo-router';
import {getMerchants} from '../../app/api/merchatApis/getMerchantHome'
import Loader from '@/components/Loader/Loader';

const DUMMY_STORES = [
  { id: '1', name: 'Adidas Originals', rating: '10 mins', address:'Vytila juntion, piller no 123' },
  { id: '2', name: 'Nike Store', rating: '12 mins',address:'Vytila juntion, piller no 123' },
  { id: '3', name: 'Puma Select', rating: '15 mins' ,address:'Vytila juntion, piller no 123'},
  { id: '4', name: 'Zara Outlet', rating: '8 mins',address:'Vytila juntion, piller no 123' },
];


const NearbyStores = ({merchantData}) => {

  
  // console.log(merchantData,"3e3e3");
  
  const navigation = useNavigation();


  return (
    <FlatList
      data={merchantData}
      horizontal
      keyExtractor={(item) => item._id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <View style={styles.storeCard}>
          {/* TouchableOpacity ONLY on header */}
          <TouchableOpacity
            style={styles.header}
            onPress={() =>
              navigation.navigate('(stack)/ShopDetails/StoreDetailPage', {
                merchantId: item._id, // item represents each merchant from your data array
              })
            }
          >
  <View style={styles.leftBlock}>
    <Text style={styles.storeName}>{item.shopName}</Text>
    <Text style={styles.ratingText}>
      {item.address ?? 'No address'}
    </Text>
  </View>
      <Text style={styles.ratingText}>
        ⭐ {item.rating ?? 'No rating'}
      </Text>
</TouchableOpacity>
          <CardinStores merchantId={item._id} />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 8,
  },
  storeCard: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    margin:5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
    fontFamily:'Montserrat'
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    fontFamily:'Montserrat',
    opacity:.5
  },
    ratingText1: {
    fontSize: 10,
    fontWeight: '600',
    color: '#555',
    fontFamily:'Montserrat',
    opacity:.5,
  },
  leftBlock: {
  flexDirection: 'column',
}
});

export default NearbyStores;
