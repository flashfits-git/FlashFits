import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
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

  // console.log(filteredMerchants,'filteredMerchantsfilteredMerchantsfilteredMerchants');
  


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
            <View style={styles.leftWrapper}>
              <Image
                source={{
                  uri: item.logo.url,
                }}
                style={styles.logo}
              />

              <View style={styles.leftBlock}>
                <Text style={styles.storeName}>{item.shopName.charAt(0).toUpperCase() + item.shopName.slice(1)}</Text>

                <Text style={styles.ratingText} numberOfLines={1}>
                  {item.address
                    ? `${item.address
                      ? [
                        item.address.city,
                        item.address.state,
                        item.address.country,
                      ]
                        .filter(Boolean)
                        .join(', ')
                      : 'No address'
                    }`
                    : 'No address'}
                </Text>
              </View>

            </View>

            {/* <Text style={styles.ratingText}>⭐{item.ratings ?? 'No rating'}</Text> */}
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
  leftWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    overflow: 'hidden',
  },
  logo: {
    width: 44,
    aspectRatio: 1,   // 👈 ensures perfect 1:1
    borderRadius: 8,  // optional: less circular, more brand-like
    marginRight: 10,
    backgroundColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    overflow: 'hidden',
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
    flex: 1,
    flexShrink: 1,
    overflow: 'hidden',
  },
});

export default PopularStores;
