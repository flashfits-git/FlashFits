import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // ✅ Fix navigation
import { Star } from 'lucide-react-native'; // optional
import CardinStores from '../../components/NearByShopsComponents/CardinStores';

const PopularStores = () => {
  const navigation = useNavigation(); // ✅ Hook for navigation

  const DUMMY_STORES = [
    { id: '1', name: 'Adidas Originals', rating: '10 mins' },
    { id: '2', name: 'Nike Store', rating: '12 mins' },
    { id: '3', name: 'Puma Select', rating: '15 mins' },
    { id: '4', name: 'Zara Outlet', rating: '8 mins' },
  ];

  return (
    <View style={styles.wrapper}>
      {DUMMY_STORES.map((store) => (
        <View key={store.id} style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.header}
            onPress={() => navigation.navigate('(stack)/ShopDetails/StoreDetailPage')}
          >
            <Text style={styles.storeName}>{store.name}</Text>
            <Text style={styles.ratingText}>{store.rating}</Text>
          </TouchableOpacity>
          <CardinStores />
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
    elevation: 5,
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
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

export default PopularStores;
