import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // ✅ Fix navigation
import { Star } from 'lucide-react-native'; // optional
import CardinStores from '../../components/NearByShopsComponents/CardinStores';

const PopularStores = ({ merchantData, productsByMerchant }) => {
  const navigation = useNavigation(); // ✅ Hook for navigation

  //     merchantData.forEach((merchant) => {
  //   console.log('Merchant ID:', merchant._id);
  // });
// console.log(productsByMerchant,'productsByMerchantproductsByMerchantproductsByMerchant');

  // const DUMMY_STORES = [
  //   { id: '1', name: 'Adidas Originals', rating: '10 mins', address:'Vytila juntion, piller no 123' },
  //   { id: '2', name: 'Nike Store', rating: '12 mins',address:'Vytila juntion, piller no 123' },
  //   { id: '3', name: 'Puma Select', rating: '15 mins' ,address:'Vytila juntion, piller no 123'},
  //   { id: '4', name: 'Zara Outlet', rating: '8 mins',address:'Vytila juntion, piller no 123' },
  // ];
    const filteredMerchants = merchantData.filter(
    (m) => (productsByMerchant[m._id]?.length || 0) > 0
  );


  return (
    <View style={styles.wrapper}>
      {filteredMerchants.map((item) => (
        <View key={item._id} style={styles.inputContainer} >
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
                {item.address
                  ? [item.address.city, item.address.state, item.address.country]
                    .filter(Boolean)
                    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                    .join(', ')
                  : 'No address'}
              </Text>
            </View>
            <Text style={styles.ratingText}>⭐{item.ratings ?? 'No rating'}</Text>
          </TouchableOpacity>
          <CardinStores merchantId={item._id} products={productsByMerchant[item._id] || []} />

        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  inputContainer: {
    padding: 6,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Montserrat'
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Montserrat',
    opacity: .5
  },
  ratingText1: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Montserrat',
    opacity: .5
  },
  leftBlock: {
    flexDirection: 'column',
  }
});

export default PopularStores;
