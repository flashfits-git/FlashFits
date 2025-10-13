import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import MultiSlider from '@ptomasroos/react-native-multi-slider';
import SmoothSlider from '../../components/HomeComponents/SmoothSlider'
import { fetchnewArrivalsProductsData, getFilteredProducts } from '../api/productApis/products';
import { useCart } from '../../app/ContextParent';
import Card from '@/components/HomeComponents/Card';
import Loader from '@/components/Loader/Loader';
import { fetchCategories } from '../api/categories';
import { getMerchants } from '../api/merchatApis/getMerchantHome';
import { FontAwesome } from '@expo/vector-icons';


const useThrottle = (callback, delay) => {
  const lastCall = useRef(0);

  return (...args) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    }
  };
};

export default function SelectionPage() {
  const router = useRouter();
  const route = useRoute();
  const { subCatName, filterss, categoryPath } = route.params || {};
  const { cartItems, cartCount } = useCart();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedGender, setSelectedGender] = useState('');
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedMainId, setSelectedMainId] = useState(null);
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [merchants, setMerchants] = useState([]);
  
  // ✅ Use individual state values instead of object
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);
  const [sortBy, setSortBy] = useState([]);

  const sortModalRef = useRef(null);
  const genderModalRef = useRef(null);
  const filterModalRef = useRef(null);
  
  // ✅ Loading state for products
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // ✅ Memoize the filters object to prevent unnecessary recreations
  const filters = useMemo(() => ({
    priceRange,
    selectedCategoryIds,
    selectedColors,
    selectedStores,
    sortBy,
  }), [priceRange, selectedCategoryIds, selectedColors, selectedStores, sortBy]);

  // ✅ Parse and set initial filters from params
useEffect(() => {
  if (filterss) {
    try {
      const parsedFilters = JSON.parse(filterss);
      setPriceRange(parsedFilters.priceRange || [0, 10000]);
      setSelectedCategoryIds(parsedFilters.selectedCategoryIds || []);
      setSelectedColors(parsedFilters.selectedColors || []);
      setSelectedStores(parsedFilters.selectedStores || []);
      setSortBy(parsedFilters.sortBy || []);

      const catIds = parsedFilters.selectedCategoryIds || [];

      if (catIds.length > 0) {
        // 🧠 mainCategoryId is always the first, subCategoryId second (based on your router push)
        const mainId = catIds[0];
        const subId = catIds[1];
        const subSubId = catIds[2];

        if (mainId) {
          setSelectedMainId(mainId);
          const mainCat = categoriesData.find(c => c._id === mainId);
          if (mainCat) setSelectedGender(mainCat.name);
        }

        if (subId) {
          setSelectedSubId(subId);
          // ✅ Additional logic for sub category: ensure main is set and gender
          if (!mainId) {
            const subCat = categoriesData.find(c => c._id === subId);
            if (subCat && subCat.parentId) {
              const parentMainId = subCat.parentId;
              setSelectedMainId(parentMainId);
              const mainCat = categoriesData.find(c => c._id === parentMainId);
              if (mainCat) setSelectedGender(mainCat.name);
            }
          }
        }

        // ✅ Auto-select the sub-subcategory if it exists
        if (subSubId) {
          setSelectedCategoryIds(catIds); // includes all three
          // ✅ Additional logic for sub-sub category: ensure hierarchy is set
          if (!subId) {
            const subSubCat = categoriesData.find(c => c._id === subSubId);
            if (subSubCat && subSubCat.parentId) {
              const parentSubId = subSubCat.parentId;
              setSelectedSubId(parentSubId);
              const subCat = categoriesData.find(c => c._id === parentSubId);
              if (subCat && subCat.parentId && !mainId) {
                const parentMainId = subCat.parentId;
                setSelectedMainId(parentMainId);
                const mainCat = categoriesData.find(c => c._id === parentMainId);
                if (mainCat) setSelectedGender(mainCat.name);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error parsing filters from params:', error);
    }
  } else {
    setPriceRange([0, 10000]);
  }
}, [filterss, categoriesData]);


  // Utility: Throttle function calls
  const fetchFiltered = useCallback(async () => {
    if (isLoadingProducts) return;
    try {
      setIsLoadingProducts(true);
      // ✅ Use only the last category ID for fetching products
      const apiFilters = {
        ...filters,
        selectedCategoryIds: selectedCategoryIds.length > 0 ? [selectedCategoryIds[selectedCategoryIds.length - 1]] : []
      };
      console.log('Fetching products with filters:', apiFilters);
      const res = await getFilteredProducts(apiFilters);
      setProducts(res?.products || []);
    } catch (err) {
      console.error('Error fetching filtered products:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [filters, isLoadingProducts, selectedCategoryIds]);

  const throttledFetch = useThrottle(fetchFiltered, 3000);

  // ✅ Fetch filtered products when filters change (consolidated)
  const prevFiltersRef = useRef(filters);
  useEffect(() => {
    const hasFilters =
      priceRange.length === 2 ||
      selectedCategoryIds.length > 0 ||
      selectedColors.length > 0 ||
      selectedStores.length > 0 ||
      sortBy.length > 0;

    if (!hasFilters) return;

    // 🔥 Compare with previous filters
    const filtersChanged =
      JSON.stringify(filters) !== JSON.stringify(prevFiltersRef.current);

    if (filtersChanged && !isLoadingProducts) {
      prevFiltersRef.current = filters;
      fetchFiltered();
    }

    // Optional: Set up interval for periodic refresh
    const intervalId = setInterval(throttledFetch, 20000);
    return () => clearInterval(intervalId);
  }, [filters]);

  // ✅ Fetch categories and merchants (runs once)
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

  const mainCategories = categoriesData.filter(c => c.level === 0);
  const subCategories = categoriesData.filter(
    c => c.level === 1 && c.parentId === selectedMainId
  );
  const subSubCategories = categoriesData.filter(
    c => c.level === 2 && c.parentId === selectedSubId
  );

  // ✅ Use useCallback to prevent function recreation
  const handleMainCategoryChange = useCallback((id) => {
    setSelectedMainId(id);
    const firstSub = categoriesData.find(
      c => c.parentId === id && c.level === 1
    );
    if (firstSub) setSelectedSubId(firstSub._id);
    setSelectedCategoryIds([id]); // ✅ Update individual state
  }, [categoriesData]);

  const handleSubCategoryChange = useCallback((id) => {
    setSelectedSubId(id);
    setSelectedCategoryIds([id]); // ✅ Update individual state
  }, []);

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  const toggleStore = (storeId) => {
    setSelectedStores((prev) =>
      prev.includes(storeId)
        ? prev.filter((s) => s !== storeId)
        : [...prev, storeId]
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
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{subCatName || 'Products'}</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => router.push('/MainSearchPage')}>
              <Ionicons name="search" size={22} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/ShoppingBag')}>
              <Ionicons name="bag-handle-outline" size={22} color="black" />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter / Sort / Gender */}
        <View style={styles.filterGenderWrapper}>
          <TouchableOpacity onPress={() => filterModalRef.current?.open()} style={styles.filterButton}>
            <Text style={styles.filterText}>FILTER</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => sortModalRef.current?.open()} style={styles.filterButton1}>
            <Text style={styles.filterText}>SORT</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => genderModalRef.current?.open()} style={styles.genderButton}>
            <MaterialCommunityIcons name="gender-male-female" size={18} color="black" />
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
            {/* <Text style={styles.priceLabel}>₹{priceRange[0]} - ₹{priceRange[1]}</Text> */}
          </View>

          {/* CATEGORY (Subcategory pills + Sub-sub checkboxes) */}
          <Text style={styles.sectionTitle}>CATEGORY</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
            {subCategories.map(sub => (
              <TouchableOpacity
                key={sub._id}
                style={[
                  styles.pill,
                  selectedSubId === sub._id && styles.pillActive
                ]}
                onPress={() => handleSubCategoryChange(sub._id)}
              >
                <Text style={[
                  styles.pillText,
                  selectedSubId === sub._id && styles.pillTextActive
                ]}>
                  {sub.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {subSubCategories.map(item => (
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
                onPress={() => toggleStore(merchant._id)} // ✅ use store ID instead of name
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
          <TouchableOpacity style={styles.applyButton}
            onPress={() => filterModalRef.current?.close()}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Apply Filters</Text>
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
                setSortBy(option);
                sortModalRef.current?.close();
              }}
            >
              <Text style={{
                fontSize: 16,
                color: '#222',
                fontWeight: sortBy === option ? '700' : '400'
              }}>
                {option.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modalize>
      {/* GENDER Modal */}
      <Modalize ref={genderModalRef} adjustToContentHeight>
        <View style={{ paddingVertical: 12 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: '#888',
              paddingHorizontal: 20,
              marginBottom: 8,
            }}
          >
            GENDER
          </Text> 
          
          {mainCategories.map((cat) => (
            <TouchableOpacity
              key={cat._id}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              }}
              onPress={() => {
                setSelectedGender(cat.name);
                setSelectedMainId(cat._id);
                setSelectedCategoryIds([cat._id]);

                const firstSub = categoriesData.find(c => c.parentId === cat._id && c.level === 1);
                if (firstSub) setSelectedSubId(firstSub._id);

                genderModalRef.current?.close();
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: '#222',
                  fontWeight: selectedGender === cat.name ? '700' : '400',
                }}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modalize>

    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
  fontSize: 15,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  marginVertical: 12,     // Adds space above and below
  paddingHorizontal: 16,  // Adds space to the sides
  textAlign: 'center',    // Center the text (optional)
  color: '#333' 
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  icon: {
    marginRight: 10,
  },
  badge: {
  position: 'absolute',
  top: -6,
  right: -6,
  backgroundColor: 'red',
  borderRadius: 8,
  width: 16,
  height: 16,
  justifyContent: 'center',
  alignItems: 'center',
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
  marginLeft:10
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
  color:'black'
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
  cardList: {
    paddingBottom: 20,
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
});
