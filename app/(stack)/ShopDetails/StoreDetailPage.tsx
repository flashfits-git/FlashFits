import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ShopOffersCarousel from '../../../components/ShopDetailPage/ShopOffersCarousel';
import FeaturedDress from '../../../components/ShopDetailPage/FeaturedDress ';
import RecentlyViewed from '../../../components/HomeComponents/RecentlyViewed';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { getMerchantById, getProductsByMerchantId } from '../../api/merchatApis/getMerchantHome';
import Loader from '@/components/Loader/Loader';

const StoreDetailPage = () => {
  const [loading, setLoading] = useState(true);
  const [merchantData, setMerchantData] = useState(null);
  const [productss, setProductss] = useState([]);
  const router = useRouter();
  const route = useRoute();
  const { merchantId } = route.params;

  useEffect(() => {
    if (!merchantId) return;

    const fetchMerchantandProducts = async () => {
      try {
        setLoading(true);
        const merchantData = await getMerchantById(merchantId);
        const products = await getProductsByMerchantId(merchantId);
        setMerchantData(merchantData);
        setProductss(products);
      } catch (error) {
        console.error('Error fetching merchant or products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchantandProducts();
  }, [merchantId]);

  const groupBySubCategory = (products) => {
    return products.reduce((acc, product) => {
      const subCatName = product.subCategoryId?.name || 'Others';
      if (!acc[subCatName]) {
        acc[subCatName] = [];
      }
      acc[subCatName].push(product);
      return acc;
    }, {});
  };

  const groupedProducts = groupBySubCategory(productss);

  if (loading) return <Loader />;

  return (
    <LinearGradient
      colors={['#f9fafb', '#ffffffff']}
      style={styles.background}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Image
              source={{
                uri: merchantData?.merchant?.logo?.url || 'https://via.placeholder.com/60',
              }}
              style={styles.avatar}
            />

<View style={styles.headerTextBox}>

  
<View style={styles.storeNameRow}>
  <Text
    style={styles.storeName}
    numberOfLines={2}
    ellipsizeMode="tail"
  >
    {merchantData?.merchant?.shopName || 'Shop Name'}
  </Text>

  <View style={styles.dot} />
  <Ionicons name="time-outline" size={13} color="#000000ff" style={{ marginLeft: 2 }} />
  <Text style={styles.timeText}>30 min</Text>
</View>

  <View style={styles.storeMetaRow}>
    <Ionicons name="location-outline" size={15} color="#000000ff" style={{ marginRight: 2 }} />
    <Text style={styles.addressText} numberOfLines={1}>
      {merchantData?.merchant?.address || 'Address not available'}
    </Text>
  </View>
</View>

          </View>
          <TouchableOpacity
            onPress={() => router.push('(tabs)/FlashfitsStores')}
            style={styles.storesButton}
          >
            <Ionicons name="storefront-outline" size={26} color="#000000ff" />
            <Text style={styles.iconLabel}>Stores</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionCard}>
            <ShopOffersCarousel />
          </View>

    <View style={styles.sectionContainer}>
      <View style={styles.flexRow}>
        <Text style={styles.sectionTitle}>Products in Store</Text>
        <LinearGradient
          colors={['#000', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.thickToThinLine}
        />
      </View>
    </View>


          {Object.entries(groupedProducts).map(([subCatName, products]) => (
            <View key={subCatName} style={styles.categorySection}>
              <Text style={styles.subTitle}>{subCatName}</Text>
              <RecentlyViewed deataiPageproducts={products} />
            </View>
          ))}

          <View style={styles.featuredSection}>
            <FeaturedDress />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    minHeight: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? 18 : 8,
    paddingBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#7891bf',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 9,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    marginRight: 15,
    backgroundColor: '#eaeaff',
    borderWidth: 1.5,
    borderColor: '#ebebf2',
  },
  headerTextBox: {
    flexShrink: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
storeName: {
  fontSize: 20,
  fontWeight: '700',
  color: '#272848',
  fontFamily: Platform.OS === 'ios' ? 'Montserrat-SemiBold' : 'Roboto',
  maxWidth: '65%', // ✅ Ensures title doesn't collide with time
  flexShrink: 1,
  textTransform: 'capitalize',
},
  storeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10 ,
  },
  addressText: {
    fontSize: 13.5,
    color: '#464650',
    flexShrink: 1,
    maxWidth: 150,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#adadad',
    marginHorizontal: 8,
  },
  timeText: {
    fontSize: 13,
    color: '#000000ff',
    marginLeft: 2,
    fontWeight: '500',
  },
thickToThinLine: {
  height: 3,                  // Thicker for a bolder look
  flex: 1,
  borderRadius: 4,
  marginLeft: 8,
  marginRight: 4,
  // Simulate "thick-to-thin": Use transform to 'taper' the right edge
  // by scaling Y and translating as necessary
  // If possible, use clipPath or border mask for a true taper
  // For React Native, we use scaleY and skewX for effect
  transform: [{ scaleY: 0.75 }, { skewX: '8deg' }],
  // Optional shadow for pop
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,  // Android shadow
  opacity:.5
},
  storesButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    padding: 5,
  },
    sectionContainer: {
    // marginTop: 20,
    marginHorizontal: 16,
  },
  iconLabel: {
    fontSize: 13,
    marginTop: 2,
    color: '#000000ff',
    fontWeight: '600',
    letterSpacing: 0.1,
  },
    flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 40,
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
    gap: 14,
  },
  sectionTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#000',
  marginRight: 12,  
  },
storeNameRow: {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'nowrap',
  gap: 6,
},
  categorySection: {
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 5,
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    // elevation: 2,
  },
  sectionCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 18,
    marginTop: 10,
    // marginBottom: 14,
    shadowColor: '#46474aff',
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    // elevation: 4,
  },
  subTitle: {
    fontSize: 16.2,
    fontWeight: '600',
    color: '#0e0e0fff',
    // marginBottom: 6,
    marginTop: 10,
    paddingLeft: 10,
    // paddingLeft: 3
  },
  featuredSection: {
    marginTop: 15,
    marginBottom: 4,
    backgroundColor: '#f8f7fe',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e6fa',
  },
});

export default StoreDetailPage;
