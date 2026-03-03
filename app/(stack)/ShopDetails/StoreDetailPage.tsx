import Loader from '@/components/Loader/Loader';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import RecentlyViewed from '../../../components/HomeComponents/RecentlyViewed';
import FeaturedDress from '../../../components/ShopDetailPage/FeaturedDress';
import ShopOffersCarousel from '../../../components/ShopDetailPage/ShopOffersCarousel';
import { getMerchantById, getProductsByMerchantId } from '../../api/merchatApis/getMerchantHome';

interface Merchant {
  merchant?: {
    shopName?: string;
    rating?: number;
    reviewCount?: number;
    address?: {
      city?: string;
      street?: string;
      state?: string;
    };
    logo?: { url: string };
  };
}

const StoreDetailPage = () => {
  const [loading, setLoading] = useState(true);
  const [merchantData, setMerchantData] = useState<Merchant | null>(null);
  const [productss, setProductss] = useState<any[]>([]);
  const router = useRouter();
  const route = useRoute();
  const { merchantId } = route.params as { merchantId: string };

  const handleViewAll = (subCatName: string, products: any[]) => {
    const filters = {
      priceRange: [0, 10000],
      selectedCategoryIds: [
        products[0]?.categoryId?._id || '',
        products[0]?.subCategoryId?._id || ''
      ].filter(Boolean),
      selectedColors: [],
      selectedStores: [merchantId],
      sortBy: [],
    };

    router.push({
      pathname: '(stack)/SelectionPage' as any,
      params: {
        filterss: JSON.stringify(filters),
        subCatName,
        type: 'Max',
      },
    });
  };

  useEffect(() => {
    if (!merchantId) return;

    const fetchMerchantandProducts = async () => {
      try {
        setLoading(true);
        const mData = await getMerchantById(merchantId);
        const products = await getProductsByMerchantId(merchantId);
        setMerchantData(mData);
        setProductss(products);
      } catch (error) {
        console.error('Error fetching merchant or products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchantandProducts();
  }, [merchantId]);

  const groupBySubCategory = (products: any[]) => {
    return products.reduce((acc: any, product: any) => {
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
      <LinearGradient
        colors={['#f9fafb', '#ffffff']}
        style={styles.background}
      >
        {/* TOP ACTION BAR */}
        <View style={styles.topActionBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.topRightActions}>
            <TouchableOpacity style={styles.actionIconButton}>
              <Ionicons name="search-outline" size={22} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIconButton}>
              <Ionicons name="people-outline" size={22} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIconButton}>
              <Ionicons name="ellipsis-vertical" size={22} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* STORE INFO HEADER */}
          <View style={styles.storeHeaderContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.premiumStoreName}>
                {merchantData?.merchant?.shopName || 'Shop Name'}
              </Text>
              <Ionicons name="information-circle-outline" size={18} color="#666" style={{ marginLeft: 6 }} />

              <View style={styles.ratingBadge}>
                <View style={styles.ratingInner}>
                  <Ionicons name="star" size={14} color="#fff" />
                  <Text style={styles.ratingValueText}>
                    {merchantData?.merchant?.rating && merchantData.merchant.rating > 0 ? merchantData.merchant.rating : '4.4'}
                  </Text>
                </View>
                <Text style={styles.reviewCountText}>
                  By {merchantData?.merchant?.reviewCount && merchantData.merchant.reviewCount > 0 ? `${merchantData.merchant.reviewCount}+` : '3.8K+'}
                </Text>
              </View>
            </View>

            <View style={styles.distanceRow}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.distanceText}>
                2.4 km • {merchantData?.merchant?.address?.city || 'Downtown'}
              </Text>
              <Ionicons name="chevron-down" size={14} color="#666" style={{ marginLeft: 4 }} />
            </View>

            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.timeLabel}>
                25-30 mins • Schedule for later
              </Text>
              <Ionicons name="chevron-down" size={14} color="#666" style={{ marginLeft: 4 }} />
            </View>

            {/* QUICK TAGS */}
            <View style={styles.tagRow}>
              <View style={styles.statusTag}>
                <Ionicons name="checkmark" size={14} color="#02b075" />
                <Text style={styles.tagText}>No packaging charges</Text>
              </View>
              <View style={styles.statusTag}>
                <Ionicons name="checkmark" size={14} color="#02b075" />
                <Text style={styles.tagText}>Frequently reordered</Text>
              </View>
            </View>

            {/* OFFERS BAR */}
            <View style={styles.offerBanner}>
              <Ionicons name="pricetag" size={16} color="#3c6be5" />
              <Text style={styles.offerText}>Flat ₹175 OFF above ₹1399</Text>
            </View>
          </View>

          {/* SHOP OFFERS */}
          <View style={{ marginTop: 10 }}>
            <ShopOffersCarousel />
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.flexRow}>
              <Text style={styles.sectionTitle}>Featured Collections</Text>
            </View>
          </View>

          <View style={{ paddingHorizontal: 4 }}>
            <FeaturedDress />
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.flexRow}>
              <Text style={styles.sectionTitle}>Categories in Store</Text>
            </View>
          </View>

          {Object.entries(groupedProducts).map(([subCatName, products]) => (
            <View key={subCatName} style={styles.categorySection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.subTitle}>{subCatName}</Text>
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={() => handleViewAll(subCatName, products as any[])}
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                  <Ionicons name="chevron-forward" size={14} color="#666" />
                </TouchableOpacity>
              </View>
              <RecentlyViewed deataiPageproducts={products} />
            </View>
          ))}
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
  background: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  actionIconButton: {
    padding: 4,
  },
  storeHeaderContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  premiumStoreName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1c1c1c',
    letterSpacing: -0.5,
  },
  ratingBadge: {
    position: 'absolute',
    right: 0,
    top: -5,
    alignItems: 'center',
  },
  ratingInner: {
    backgroundColor: '#028a34',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingValueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewCountText: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderStyle: 'dashed',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  distanceText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  tagRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f8f5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#e2f0e9',
  },
  tagText: {
    fontSize: 12,
    color: '#444',
    fontWeight: '500',
  },
  offerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  offerText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1c1c1c',
    letterSpacing: -0.2,
  },
  categorySection: {
    marginBottom: 24,
    backgroundColor: '#fff',
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1c1c',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
});

export default StoreDetailPage;
