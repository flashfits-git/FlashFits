import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import CardinStores from '../../components/NearByShopsComponents/CardinStores';
import { useNavigation } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';




const NearbyStores = ({ merchantData, productsByMerchant }) => {


  // console.log(productsByMerchant, "88888888888888888888888888888");

  const navigation = useNavigation();
  // Filter merchants who have products > 0
  const filteredMerchants = merchantData.filter(
    (m) => (productsByMerchant[m._id]?.length || 0) > 0
  );



  return (
    <FlatList
      data={filteredMerchants}
      horizontal
      keyExtractor={(item) => item._id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <View style={styles.storeCard}>
          <TouchableOpacity
            style={styles.header}
            onPress={() =>
              navigation.navigate('(stack)/ShopDetails/StoreDetailPage', {
                merchantId: item._id,
              })
            }
          >
            <View style={styles.leftBlock}>
              <Text style={styles.storeName}>
                {item.shopName
                  ? item.shopName.charAt(0).toUpperCase() + item.shopName.slice(1)
                  : ''}
              </Text> 
              <Text style={styles.ratingText}>
                {item.address
                  ? [item.address.city, item.address.state, item.address.country]
                    .filter(Boolean)
                    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                    .join(', ')
                  : 'No address'}
              </Text>
            </View>
            <Text style={styles.timeText}>30 min</Text>
          </TouchableOpacity>
          <CardinStores merchantId={item._id} products={productsByMerchant[item._id] || []} />
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
    shadowRadius: 2,
    elevation: 1,
    margin: 5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 13,
    color: '#000000ff',
    marginLeft: 2,
    fontWeight: '500',
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
    fontFamily: 'Montserrat'
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    fontFamily: 'Montserrat',
    opacity: .5
  },
  ratingText1: {
    fontSize: 10,
    fontWeight: '600',
    color: '#555',
    fontFamily: 'Montserrat',
    opacity: .5,
  },
  leftBlock: {
    flexDirection: 'column',
  }
});

export default NearbyStores;
