import Card from '@/components/HomeComponents/Card';
import Loader from '@/components/Loader/Loader';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../app/ContextParent';
import SmoothSlider from '../../components/HomeComponents/SmoothSlider';
import { fetchCategories } from '../api/categories';
import { getMerchants } from '../api/merchatApis/getMerchantHome';
import { getFilteredProducts } from '../api/productApis/products';

type Category = {
  _id: string;
  name: string;
  parentId: string | null;
  level: number;
  image?: { url: string };
  allowedGenders?: string[];
  ancestors?: {
    parentName?: string;
  };
};

type SelectionPageParams = {
  query?: string;
  subCatName?: string;
  filterss?: string; // JSON string of filters
  categoryPath?: string;
  gender?: string;
};

export default function SelectionPage() {
  const router = useRouter();
  const route = useRoute<any>();
  const { query, subCatName, filterss, categoryPath, gender } = (route.params as any) || {};
  // console.log(filterss, 'filterssfilterssfilterssfilterss');

  const { cartItems, cartCount } = useCart();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedGender, setSelectedGender] = useState('');
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [selectedMainId, setSelectedMainId] = useState<string | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [merchants, setMerchants] = useState<any[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [localQuery, setLocalQuery] = useState(query || '');
  // console.log(selectedCategoryIds,'selectedCategoryIds');

  const sortModalRef = useRef<Modalize>(null);
  const filterModalRef = useRef<Modalize>(null);

  const filters = useMemo(() => ({
    priceRange,
    selectedCategoryIds,
    selectedColors,
    selectedStores,
    sortBy,
  }), [priceRange, selectedCategoryIds, selectedColors, selectedStores, sortBy]);

  // Parse and set initial filters from params
  useEffect(() => {
    if (!categoriesData.length) return; // Wait for categoriesData to be loaded

    // 1. Prioritize explicitly passed gender
    if (gender) {
      setSelectedGender(gender);
    }

    if (!filterss) return;

    try {
      const parsedFilters = JSON.parse(filterss);
      setPriceRange(parsedFilters.priceRange || [0, 10000]);
      setSelectedCategoryIds(parsedFilters.selectedCategoryIds || []);
      setSelectedColors(parsedFilters.selectedColors || []);
      setSelectedStores(parsedFilters.selectedStores || []);
      setSortBy(parsedFilters.sortBy || []);

      const catIds = parsedFilters.selectedCategoryIds || [];
      if (catIds.length === 0) return;

      // Handle main and sub category IDs (2-level: L0 and L1)
      const mainId = catIds[0];
      const subId = catIds[1];

      if (mainId) {
        setSelectedMainId(mainId);
      }
      if (subId) {
        setSelectedSubId(subId);
      }

    } catch (error) {
      console.error('Error parsing filters from params:', error);
    }
  }, [filterss, gender, categoriesData]);

  // Fetch filtered products
  const fetchFiltered = useCallback(async () => {
    try {
      // console.log(query,'queryqueryquery');

      setIsLoadingProducts(true);

      const apiFilters = {
        ...(localQuery ? { search: localQuery } : {}),
        ...filters,
        selectedCategoryIds:
          selectedCategoryIds.length > 0
            ? [selectedCategoryIds[selectedCategoryIds.length - 1]]
            : [],
        gender: selectedGender || undefined,
      };

      console.log("🔎 Fetching products with filters:", apiFilters);

      const res = await getFilteredProducts(apiFilters);

      setProducts(res?.products || []);
    } catch (err) {
      console.error("Error fetching filtered products:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [localQuery, filters, selectedCategoryIds, selectedGender]);

  // useEffect(() => {
  //   fetchFiltered();
  // }, [query, filters, selectedGender, selectedCategoryIds]);

  // const throttledFetch = useThrottle(fetchFiltered, 3000);

  useEffect(() => {
    if (isLoadingProducts) return;

    const hasFilters =
      query?.trim()?.length > 0 ||
      localQuery?.trim()?.length > 0 ||
      selectedGender ||
      selectedCategoryIds.length > 0 ||
      selectedColors.length > 0 ||
      selectedStores.length > 0 ||
      sortBy.length > 0 ||
      (priceRange[0] !== 0 || priceRange[1] !== 10000);

    if (hasFilters) {
      fetchFiltered();
    }
  }, [filters, selectedGender, selectedCategoryIds]); // Removed localQuery to sync with onSubmitEditing


  // Fetch filtered products when filters change
  // const prevFiltersRef = useRef(filters);
  // useEffect(() => {
  //   const hasFilters =
  //     priceRange.length === 2 ||
  //     selectedCategoryIds.length > 0 ||
  //     selectedColors.length > 0 ||
  //     selectedStores.length > 0 ||
  //     sortBy.length > 0;

  //   if (!hasFilters) return;

  //   const filtersChanged = JSON.stringify(filters) !== JSON.stringify(prevFiltersRef.current);
  //   if (filtersChanged && !isLoadingProducts) {
  //     prevFiltersRef.current = filters;
  //     fetchFiltered();
  //   }

  //   const intervalId = setInterval(throttledFetch, 20000);
  //   return () => clearInterval(intervalId);
  // }, [filters, fetchFiltered, isLoadingProducts]);

  // Fetch categories and merchants
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [data, merchantsRes] = await Promise.all([
          fetchCategories(),
          getMerchants(),
        ]);
        setCategoriesData(data);
        setMerchants(merchantsRes?.merchants || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // L0 main categories
  const mainCategories = categoriesData.filter(c => c.level === 0);
  // L1 subcategories
  const subCategories = selectedMainId
    ? categoriesData.filter(c => c.level === 1 && c.parentId === selectedMainId)
    : categoriesData.filter(c => c.level === 1);

  const handleMainCategoryChange = useCallback((id: string) => {
    setSelectedMainId(id);
    setSelectedSubId(null);
    setSelectedCategoryIds([id]);
  }, []);

  const handleSubCategoryChange = useCallback((id) => {
    setSelectedSubId(id);
    setSelectedCategoryIds([selectedMainId, id].filter(Boolean));
  }, [selectedMainId]);

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleStore = (storeId) => {
    setSelectedStores((prev) =>
      prev.includes(storeId) ? prev.filter((s) => s !== storeId) : [...prev, storeId]
    );
  };

  const toggleCategoryCheckbox = (id) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Loader />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>

            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={18} color="#8E8E93" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                value={localQuery}
                onChangeText={setLocalQuery}
                placeholder="Search styles..."
                onSubmitEditing={fetchFiltered}
                returnKeyType="search"
                placeholderTextColor="#A0A0A0"
              />
              {localQuery.length > 0 && (
                <TouchableOpacity onPress={() => setLocalQuery('')} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={18} color="#C7C7CC" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={() => router.push('/ShoppingBag')} style={styles.iconButton}>
                <Ionicons name="bag-handle-outline" size={24} color="black" />
                {cartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Gender Selection Tabs (MEN, WOMEN, KIDS) */}
          <View style={styles.topTabs}>
            {[
              { label: 'Men', value: 'MEN' },
              { label: 'Women', value: 'WOMEN' },
              { label: 'Kids', value: 'KIDS' },
            ].map((cat) => (
              <TouchableOpacity
                key={cat.value}
                onPress={() => {
                  const isActive = selectedGender === cat.value;
                  if (isActive) {
                    setSelectedGender('');
                    setSelectedMainId(null);
                    setSelectedSubId(null);
                    setSelectedCategoryIds([]);
                  } else {
                    setSelectedGender(cat.value);
                  }
                }}
                style={styles.tabButton}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedGender === cat.value && styles.activeTabText,
                  ]}
                >
                  {cat.label}
                </Text>
                {selectedGender === cat.value && <View style={styles.underline} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* Filter / Sort Row */}
          <View style={styles.filterGenderWrapper}>
            <TouchableOpacity onPress={() => filterModalRef.current?.open()} style={styles.filterButton}>
              <Text style={styles.filterText}>FILTER</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => sortModalRef.current?.open()} style={styles.filterButton1}>
              <Text style={styles.filterText}>SORT</Text>
            </TouchableOpacity>
          </View>

          {/* Product List */}
          <FlatList
            data={products}
            renderItem={({ item }) => <Card product={item} />}
            keyExtractor={item => item._id?.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.cardList}
            refreshing={isLoadingProducts}
            onRefresh={fetchFiltered}
          />
        </View>

        {/* FILTER Modal */}
        <Modalize ref={filterModalRef} adjustToContentHeight>
          <View style={{ padding: 20, backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>Filter Options</Text>

            {/* PRICE RANGE */}
            <Text style={styles.sectionTitle}>PRICE RANGE</Text>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <SmoothSlider
                initialValues={priceRange}
                onChange={(values) => setPriceRange(values)}
              />
            </View>

            {/* CATEGORY (L0 pills + L1 checkboxes) */}
            <Text style={styles.sectionTitle}>CATEGORY</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
              {mainCategories.map(cat => (
                <TouchableOpacity
                  key={cat._id}
                  style={[
                    styles.pill,
                    selectedMainId === cat._id && styles.pillActive
                  ]}
                  onPress={() => handleMainCategoryChange(cat._id)}
                >
                  <Text style={[
                    styles.pillText,
                    selectedMainId === cat._id && styles.pillTextActive
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {subCategories.map(item => (
                <TouchableOpacity
                  key={item._id}
                  onPress={() => toggleCategoryCheckbox(item._id)}
                  style={styles.checkboxRow}
                >
                  <View style={[
                    styles.checkbox,
                    filters.selectedCategoryIds.includes(item._id) && styles.checkboxSelected
                  ]}>
                    {filters.selectedCategoryIds.includes(item._id) && (
                      <FontAwesome name="check" size={14} color="#fff" />
                    )}
                  </View>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* COLOR */}
            <Text style={styles.sectionTitle}>COLOR</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
              {['Black', 'Red', 'Green', 'Blue', 'Yellow'].map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => toggleColor(color)}
                  style={[
                    styles.colorPill,
                    filters.selectedColors.includes(color) && styles.colorPillSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.colorPillText,
                      filters.selectedColors.includes(color) && styles.colorPillTextSelected,
                    ]}
                  >
                    {color}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* STORE */}
            <Text style={styles.sectionTitle}>STORE</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
              {Array.isArray(merchants) && merchants.map(merchant => (
                <TouchableOpacity
                  key={merchant._id}
                  onPress={() => toggleStore(merchant._id)}
                  style={[
                    styles.storePill,
                    filters.selectedStores.includes(merchant._id) && styles.storePillSelected
                  ]}
                >
                  <Text style={[
                    styles.storeText,
                    filters.selectedStores.includes(merchant._id) && styles.storeTextSelected
                  ]}>
                    {merchant.shopName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* APPLY BUTTON */}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => filterModalRef.current?.close()}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close Filters</Text>
            </TouchableOpacity>
          </View>
        </Modalize>

        {/* SORT Modal */}
        <Modalize ref={sortModalRef} adjustToContentHeight>
          <View style={{ paddingVertical: 12 }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: '#888',
              paddingHorizontal: 20,
              marginBottom: 8,
            }}>
              SORT BY
            </Text>
            {[
              "newest",
              'priceLowToHigh',
              'priceHighToLow',
              'discount',
              'customerRating',
            ].map((option, index) => (
              <TouchableOpacity
                key={option}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  borderBottomWidth: index === 4 ? 0 : 1,
                  borderBottomColor: '#eee',
                }}
                onPress={() => {
                  setSortBy([option]); // Use array for consistency
                  sortModalRef.current?.close();
                }}
              >
                <Text style={{
                  fontSize: 16,
                  color: '#222',
                  fontWeight: sortBy.includes(option) ? '700' : '400'
                }}>
                  {option.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modalize>


      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 10 : 0, // ✅ prevent overlap on Android
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#333'
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 12,
    height: 44,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    paddingVertical: 8,
    fontFamily: 'Manrope-Medium',
  },
  clearButton: {
    padding: 4,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  genderText: {
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 14,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardList: {
    paddingBottom: 100,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  genderContainer: {
    marginTop: 10,
    marginBottom: 16,
    paddingHorizontal: 15,
  },
  filterGenderWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // gap: 10,
    marginTop: 5,
    marginBottom: 12,
    paddingHorizontal: 5,
  },
  filterButton: {
    flex: 1, // Takes equal space among FILTER and SORT
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: '#fff',
    // borderWidth: 1,
    // borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterButton1: {
    flex: 1, // Takes equal space among FILTER and SORT
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#fff',
    // borderWidth: 1,
    // borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  genderButton: {
    width: '20%', // ✅ Occupies 20% of row
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: .2,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
    marginLeft: 10
  },

  filterButtonLeft: {
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  checkIcon: {
    alignSelf: 'center',
    position: 'absolute',
    top: 7,
    left: 7,
    color: 'black'
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#333',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#333',
  },
  filterText: {
    fontWeight: '600',
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 8,
    color: '#222',
  },
  priceLabel: {
    marginTop: 6,
    fontWeight: '600',
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  pillActive: {
    backgroundColor: '#222',
  },
  pillText: {
    fontWeight: '500',
    color: '#333',
  },
  pillTextActive: {
    color: '#fff',
  },
  colorPill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  colorPillSelected: {
    backgroundColor: '#222',
  },
  colorPillText: {
    color: '#333',
    fontWeight: '500',
  },
  colorPillTextSelected: {
    color: '#fff',
  },
  colorCircle: {
    width: 25,
    height: 25,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#aaa',
  },
  colorCircleSelected: {
    borderColor: '#000',
    transform: [{ scale: 1.1 }],
  },
  storePill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
  },
  storePillSelected: {
    backgroundColor: '#222',
  },
  storeText: {
    color: '#333',
    fontWeight: '500',
  },
  storeTextSelected: {
    color: '#fff',
  },
  applyButton: {
    backgroundColor: '#222',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  topTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 15,
    color: '#777',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '700',
  },
  underline: {
    height: 2,
    backgroundColor: '#000',
    marginTop: 4,
    width: '100%',
    borderRadius: 2,
  },
});
