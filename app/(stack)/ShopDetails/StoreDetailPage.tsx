import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ShopOffersCarousel from '../../../components/ShopDetailPage/ShopOffersCarousel';
import FeaturedDress from '../../../components/ShopDetailPage/FeaturedDress ';
import RecentlyViewed from '../../../components/HomeComponents/RecentlyViewed';
import jfnefn from '../../../assets/images/2.jpg';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { getMerchantById, getProductsByMerchantId } from '../../api/merchatApis/getMerchantHome';
import Loader from '@/components/Loader/Loader';

const StoreDetailPage = () => {
  const [loading, setLoading] = useState(true);
  const [merchantData, setMerchantData] = useState(null);
  const [productss, setProductss] = useState([]);

  // console.log(merchantData,'merchantDatamerchantData');
  // console.log(merchantData.merchant._id,'merchantDatamerchantData');

  

  const router = useRouter();
  const route = useRoute();
  const { merchantId } = route.params;

  // console.log(merchantData,' : cotton : cotton : cotton : cottonc');
  

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
    <SafeAreaView style={styles.safeArea}>
<View style={styles.headerContainer}>
  <View style={styles.header}>
        <Image
        source={{
          uri: merchantData?.merchant?.logo?.url || 'https://via.placeholder.com/60',
        }}
        style={styles.avatar}
      />
    <View>
      <Text style={styles.userName}>
        {merchantData?.merchant?.shopName || 'Shop Name'}
      </Text>
      <Text style={styles.welcomeText}>{merchantData?.merchant?.address || 'Address not available'} | 30 min</Text>
    </View>
  </View>
  <View style={styles.iconContainer}>
    <TouchableOpacity
      onPress={() => router.push('(tabs)/FlashfitsStores')}
      style={styles.iconButton}
    >
      <Ionicons name="storefront-outline" size={24} color="#000" />
      <Text style={styles.iconLabel}>Stores</Text>
    </TouchableOpacity>
  </View>
</View>


      <LinearGradient colors={['#fff', '#fff']} style={styles.body}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionContainer}>
            <ShopOffersCarousel />
          </View>

          <Text style={styles.sectionTitle}>Products in Store</Text>

          {/* Dynamic product sections grouped by subCategory */}
          {Object.entries(groupedProducts).map(([subCatName, products]) => (
            <View key={subCatName} style={styles.sectionContainer}>
              <Text style={styles.subTitle}>{subCatName}</Text>
              <RecentlyViewed deataiPageproducts={products} />
            </View>
          ))}

          <View style={styles.sectionContainer1}>
            <FeaturedDress />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  userName: {
    fontSize: 30,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Montserrat',
  },
  welcomeText: {
    fontSize: 13,
    color: '#444',
    fontFamily: 'Montserrat',
  },
  iconContainer: {
    marginLeft: 5,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconLabel: {
    fontSize: 12,
    marginTop: 2,
    color: '#000',
    fontFamily: 'Montserrat',
  },
  body: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 12,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  sectionContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sectionContainer1: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    fontFamily: 'Montserrat',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
    fontFamily: 'Montserrat',
  },
});

export default StoreDetailPage;
