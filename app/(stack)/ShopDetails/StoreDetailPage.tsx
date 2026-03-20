import Loader from '@/components/Loader/Loader';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecentlyViewed from '../../../components/HomeComponents/RecentlyViewed';
import FeaturedDress from '../../../components/ShopDetailPage/FeaturedDress';
import ShopOffersCarousel from '../../../components/ShopDetailPage/ShopOffersCarousel';
import { getMerchantById, getProductsByMerchantId } from '../../api/merchatApis/getMerchantHome';
import { useGender } from '../../GenderContext';
import { useAddress } from '../../AddressContext';
import { calculateDistanceKm, calculateEstimatedTime } from '../../utils/locationHelper';

interface Merchant {
  merchant?: {
    shopName?: string;
    rating?: number;
    reviewCount?: number;
    address?: {
      city?: string;
      street?: string;
      state?: string;
      location?: {
        coordinates: [number, number];
      };
    };
    logo?: { url: string };
    backgroundImage?: { url: string };  // <-- add this
    genderCategory?: string | string[];
  };
}


const GENDER_PRODUCT_MAP: Record<string, string[]> = {
  MEN: ['MEN'],
  WOMEN: ['WOMEN'],
  KIDS: ['KIDS'],
};

const GENDER_ICON_MAP: Record<string, any> = {
  MEN: 'male',
  WOMEN: 'female',
  KIDS: 'happy-outline',
};

const StoreDetailPage = () => {
  const [loading, setLoading] = useState(true);
  const [merchantData, setMerchantData] = useState<Merchant | null>(null);
  const [productss, setProductss] = useState<any[]>([]);
  const [localSelectedGender, setLocalSelectedGender] = useState<string | null>(null);
  const router = useRouter();
  const route = useRoute();
  const { merchantId } = route.params as { merchantId: string };
  const { selectedGender, setSelectedGender } = useGender();
  const { selectedAddress } = useAddress();

  const locationStats = useMemo(() => {
    const merchantCoords = merchantData?.merchant?.address?.location?.coordinates;
    const userCoords = selectedAddress?.location?.coordinates;
    if (!merchantCoords || !userCoords) {
      return { distance: '2.4 km', time: '25-30 mins' };
    }
    const distance = calculateDistanceKm(
      userCoords[1], userCoords[0],
      merchantCoords[1], merchantCoords[0]
    );
    const time = calculateEstimatedTime(distance);
    return { distance: `${distance.toFixed(1)} km`, time };
  }, [merchantData, selectedAddress]);

  const handleViewAll = (subCatName: string, products: any[]) => {
    const filters = {
      priceRange: [0, 10000],
      selectedCategoryIds: [
        products[0]?.categoryId?._id || '',
        products[0]?.subCategoryId?._id || '',
      ].filter(Boolean),
      selectedColors: [],
      selectedStores: [merchantId],
      sortBy: [],
    };
    router.push({
      pathname: '(stack)/SelectionPage' as any,
      params: { filterss: JSON.stringify(filters), subCatName, type: 'Max' },
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

  const availableGenders = useMemo(() => {
    const raw = merchantData?.merchant?.genderCategory;
    if (!raw) return [];
    const arr = Array.isArray(raw) ? raw : [raw];
    return arr
      .map((g: string) => String(g).toUpperCase())
      .filter((g: string) => ['MEN', 'WOMEN', 'KIDS'].includes(g));
  }, [merchantData]);

  useEffect(() => {
    if (availableGenders.length === 0) return;
    const globalUpper = selectedGender !== 'All' ? selectedGender.toUpperCase() : null;
    if (globalUpper && availableGenders.includes(globalUpper)) {
      setLocalSelectedGender(globalUpper);
    } else {
      setLocalSelectedGender(availableGenders[0]);
    }
  }, [availableGenders, selectedGender]);

  const displayGenderTabs = availableGenders;

  const filteredProducts = useMemo(() => {
    if (!localSelectedGender || displayGenderTabs.length <= 1) return productss;
    const allowedProductGenders = GENDER_PRODUCT_MAP[localSelectedGender] || [];
    return productss.filter((product: any) => {
      const productGenders: string[] = Array.isArray(product.gender)
        ? product.gender.map((g: string) => g.toUpperCase())
        : [String(product.gender || '').toUpperCase()];
      return productGenders.some((g) => allowedProductGenders.includes(g));
    });
  }, [productss, localSelectedGender, displayGenderTabs]);

  const groupBySubCategory = (products: any[]) => {
    return products.reduce((acc: any, product: any) => {
      const subCatName = product.subCategoryId?.name || 'Others';
      if (!acc[subCatName]) acc[subCatName] = [];
      acc[subCatName].push(product);
      return acc;
    }, {});
  };

  const groupedProducts = groupBySubCategory(filteredProducts);

  if (loading) return <Loader />;

  const merchant = merchantData?.merchant;
  const ratingValue = merchant?.rating && merchant.rating > 0 ? merchant.rating : '4.4';
  const reviewCount = merchant?.reviewCount && merchant.reviewCount > 0 ? `${merchant.reviewCount}+` : '3.8K+';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* TOP ACTION BAR — frosted glass style */}
      <View style={styles.topActionBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconCircle}>
          <Ionicons name="arrow-back" size={20} color="#1c1c1c" />
        </TouchableOpacity>
        <View style={styles.topRightActions}>
          <TouchableOpacity style={styles.iconCircle}>
            <Ionicons name="search-outline" size={20} color="#1c1c1c" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}>
            <Ionicons name="share-social-outline" size={20} color="#1c1c1c" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#1c1c1c" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        // Add at the top of the ScrollView, before the headerCard

{/* HERO IMAGE */}
<View style={styles.heroContainer}>
  {merchant?.backgroundImage?.url ? (
    <Image source={{ uri: merchant.backgroundImage.url }} style={styles.heroImage} resizeMode="cover" />
  ) : (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroFallback}
    >
      <Ionicons name="storefront-outline" size={48} color="rgba(255,255,255,0.25)" />
      <Text style={styles.heroFallbackText}>{merchant?.shopName || 'Store'}</Text>
    </LinearGradient>
  )}
  <LinearGradient
    colors={['transparent', 'rgba(245,245,247,0.8)', '#F5F5F7']}
    style={styles.heroGradientOverlay}
  />
</View>

        {/* STORE HEADER CARD */}
        <View style={styles.headerCard}>
          {/* Logo + Name Row */}
          <View style={styles.logoNameRow}>
            {merchant?.logo?.url ? (
              <Image source={{ uri: merchant.logo.url }} style={styles.storeLogo} />
            ) : (
              <View style={styles.storeLogoPlaceholder}>
                <Ionicons name="storefront" size={24} color="#999" />
              </View>
            )}
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.storeName} numberOfLines={1}>
                {merchant?.shopName || 'Shop Name'}
              </Text>
              <View style={styles.locationChip}>
                <Ionicons name="location" size={12} color="#FF6B35" />
                <Text style={styles.locationText}>
                  {locationStats.distance} • {merchant?.address?.city || 'Downtown'}
                </Text>
              </View>
            </View>
            {/* Rating Pill */}
            <View style={styles.ratingPill}>
              <Ionicons name="star" size={13} color="#fff" />
              <Text style={styles.ratingText}>{ratingValue}</Text>
            </View>
          </View>

          {/* Meta Row */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={15} color="#888" />
              <Text style={styles.metaText}>{locationStats.time}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Ionicons name="chatbubble-outline" size={14} color="#888" />
              <Text style={styles.metaText}>{reviewCount} reviews</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Ionicons name="cube-outline" size={14} color="#888" />
              <Text style={styles.metaText}>Free packing</Text>
            </View>
          </View>

          {/* Offer Strip */}
          <LinearGradient
            colors={['#EEF2FF', '#E8EDFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.offerStrip}
          >
            <View style={styles.offerIconCircle}>
              <Ionicons name="pricetag" size={14} color="#4F46E5" />
            </View>
            <Text style={styles.offerStripText}>Flat ₹175 OFF above ₹1399</Text>
            <Ionicons name="chevron-forward" size={16} color="#4F46E5" />
          </LinearGradient>
        </View>

        {/* GENDER SWITCHER */}
        {displayGenderTabs.length > 1 && (
          <View style={styles.genderSwitcherContainer}>
            <View style={styles.genderSwitcherTrack}>
              {displayGenderTabs.map((gender) => {
                const isActive = localSelectedGender === gender;
                return (
                  <TouchableOpacity
                    key={gender}
                    onPress={() => {
                      setLocalSelectedGender(gender);
                      const labelMap: Record<string, string> = { MEN: 'Men', WOMEN: 'Women', KIDS: 'Kids' };
                      setSelectedGender((labelMap[gender] || gender) as any);
                    }}
                    style={[styles.genderTab, isActive && styles.genderTabActive]}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={GENDER_ICON_MAP[gender] || 'person'}
                      size={15}
                      color={isActive ? '#fff' : '#888'}
                    />
                    <Text style={[styles.genderTabText, isActive && styles.genderTabTextActive]}>
                      {gender.charAt(0) + gender.slice(1).toLowerCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* CATEGORIES TITLE */}
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionTitleAccent} />
          <Text style={styles.sectionTitle}>Categories in Store</Text>
        </View>

        {/* PRODUCT CATEGORIES */}
        {Object.entries(groupedProducts).map(([subCatName, products]) => (
          <View key={subCatName} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryName}>{subCatName}</Text>
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => handleViewAll(subCatName, products as any[])}
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllBtnText}>See all</Text>
                <Ionicons name="arrow-forward" size={14} color="#4F46E5" />
              </TouchableOpacity>
            </View>
            <RecentlyViewed deataiPageproducts={products} />
          </View>
        ))}

        {Object.keys(groupedProducts).length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="bag-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No products available</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  // Add to your StyleSheet
heroContainer: {
  height: 220,
  width: '100%',
  position: 'relative',
},
heroImage: {
  width: '100%',
  height: '100%',
},
heroFallback: {
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
},
heroFallbackText: {
  fontSize: 24,
  fontWeight: '800',
  color: 'rgba(255,255,255,0.4)',
  letterSpacing: 2,
  textTransform: 'uppercase',
},
heroGradientOverlay: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 80,
},

  topActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F5F5F7',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Header Card
  headerCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginTop: -60,  // <-- pulls card up over hero
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  logoNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeLogo: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
  },
  storeLogoPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#777',
    fontWeight: '500',
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },

  // Meta Row
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  metaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  metaDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#e5e5e5',
  },

  // Offer Strip
  offerStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 10,
  },
  offerIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerStripText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },

  // Gender Switcher
  genderSwitcherContainer: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  genderSwitcherTrack: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  genderTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 13,
    gap: 6,
  },
  genderTabActive: {
    backgroundColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  genderTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
  },
  genderTabTextActive: {
    color: '#fff',
  },

  // Section Title
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 26,
    marginBottom: 14,
    gap: 10,
  },
  sectionTitleAccent: {
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: '#4F46E5',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.2,
  },

  // Category Cards
  categoryCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0EDFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewAllBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
    fontWeight: '500',
  },
});

export default StoreDetailPage;
