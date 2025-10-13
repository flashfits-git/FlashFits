import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
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
  const [merchantData, setMerchantData] = useState({});
  const [productss, setProductss] = useState([]);
  const router = useRouter();
  const route = useRoute();
  const { merchantId } = route.params;

  console.log(merchantId);
  

const handleViewAll = (subCatName, products) => {
  const filters = {
    priceRange: [0, 2000], // default
    selectedCategoryIds: [products[0]?.subCategoryId?._id || ''],
    selectedColors: [], // can be filled later
    selectedStores: [merchantId], // merchant = store
    sortBy: [], // optional
  };

  router.push({
    pathname: '(stack)/SelectionPage',
    params: {
      filterss: JSON.stringify(filters), // ✅ renamed for consistency
      type:'Max', // optional if needed in header
    },
  });
};


  useEffect(() => {
    if (!merchantId) return;

    const fetchMerchantandProducts = async () => {
      try {
        setLoading(true);
        const merchantData = await getMerchantById(merchantId);
        const products = await getProductsByMerchantId(merchantId);
        setMerchantData(merchantData);
        setProductss(products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching merchant or products:', error);
      } finally{
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

  const logoUrl = merchantData?.merchant?.logo?.url;

  return (
    <LinearGradient
      colors={['#f9fafb', '#ffffffff']}
      style={styles.background}
    >
      {/* <SafeAreaView style={styles.safeArea}> */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Image
              source={{
                uri: String(logoUrl) || 'no image',
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
            <View style={styles.sectionHeader}>
              <Text style={styles.subTitle}>{subCatName}</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => handleViewAll(subCatName, products)}
            activeOpacity={0.7}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color="#56565bff" />
          </TouchableOpacity>
            </View>
            <RecentlyViewed deataiPageproducts={products} />
          </View>
        ))} 
          <View style={styles.featuredSection}>
            <FeaturedDress />
          </View>
        </ScrollView>
      {/* </SafeAreaView> */}
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
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 2 
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f5',
  },
    sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 10,
    // paddingHorizontal: 2,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    letterSpacing: 0.3,
    textTransform: 'capitalize',
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
    viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f7ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#535354ff',
    shadowColor: '#3c3c3cff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
    viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5a595cff',
    marginRight: 4,
    letterSpacing: 0.2,
  },
    categorySection_dark: {
    marginBottom: 20,
    backgroundColor: '#454547ff',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 4 
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#3d3d5c',
  },
  subTitle_dark: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
    textTransform: 'capitalize',
    flex: 1,
  },

  viewAllButton_dark: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4c4c6d',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#5d5d7a',
  },

  viewAllText_dark: {
    fontSize: 13,
    fontWeight: '600',
    color: '#b3b3ff',
    marginRight: 4,
    letterSpacing: 0.2,
  },

  // Premium gradient version
  categorySection_premium: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 18,
    shadowColor: '#7B68EE',
    shadowOffset: { 
      width: 0, 
      height: 6 
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    // Add gradient background if using react-native-linear-gradient
    // backgroundGradient: ['#ffffff', '#fafafe'],
  },

  viewAllButton_premium: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Use LinearGradient component
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  viewAllText_premium: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    marginRight: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
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
