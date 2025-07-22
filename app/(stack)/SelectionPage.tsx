import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView, // ✅ Added
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { fetchnewArrivalsProductsData, getFilteredProducts } from '../api/productApis/products';
import { useCart } from '../../app/ContextParent';
import Card from '@/components/HomeComponents/Card';
import Loader from '@/components/Loader/Loader';
import { fetchCategories } from '../api/categories';
import { getMerchants} from '../api/merchatApis/getMerchantHome'
import { FontAwesome } from '@expo/vector-icons';



export default function SelectionPage() {
  const router = useRouter();
    const { cartItems, cartCount } = useCart();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedGender, setSelectedGender] = useState("Men");
  const [filters, setFilters] = useState({
  priceRange: [0, 2000],
  selectedCategoryIds: [],
  selectedColors: [],
  selectedStores: [],
});

useEffect(() => {
  console.log("Filters updated:", filters);
}, [filters]);

  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedMainId, setSelectedMainId] = useState(null);
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [merchants, setMerchants] = useState([]);
  const mainCategories = categoriesData.filter(cat => cat.level === 0);
  const subCategories = categoriesData.filter(cat => cat.level === 1 && cat.parentId === selectedMainId);
  const subSubCategories = categoriesData.filter(cat => cat.level === 2 && cat.parentId === selectedSubId);

  const handleMainCategoryChange = (id) => {
    setSelectedMainId(id);
    const firstSub = categoriesData.find(cat => cat.parentId === id && cat.level === 1);
    if (firstSub) setSelectedSubId(firstSub._id);
  };

  const handleSubCategoryChange = (id) => {
    setSelectedSubId(id);
  };


  const toggleCategoryCheckbox = (id) => {
  setFilters(prev => ({
    ...prev,
    selectedCategoryIds: prev.selectedCategoryIds.includes(id)
      ? prev.selectedCategoryIds.filter(i => i !== id)
      : [...prev.selectedCategoryIds, id],
  }));
};
// Function to toggle colors
const toggleColor = (color) => {
  setFilters(prev => ({
    ...prev,
    selectedColors: prev.selectedColors.includes(color)
      ? prev.selectedColors.filter(c => c !== color)
      : [...prev.selectedColors, color],
  }));
};
// Function to toggle store selection
const toggleStore = (store) => {
  setFilters(prev => ({
    ...prev,
    selectedStores: prev.selectedStores.includes(store)
      ? prev.selectedStores.filter(s => s !== store)
      : [...prev.selectedStores, store],
  }));
};


  // ✅ Only ONE useEffect for loading categories
useEffect(() => {
  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      const merchantResponse = await getMerchants();

      console.log('Returned merchants:', merchantResponse);

      // ✅ FIX: access the nested `merchants` array
      setCategoriesData(data);
      setMerchants(Array.isArray(merchantResponse.merchants) ? merchantResponse.merchants : []);
    } catch (err) {
      console.error("Error loading categories or merchants", err);
    } finally {
      setLoading(false);
    }
  };

  loadCategories();
}, []);


  useEffect(() => {
    if (mainCategories.length > 0 && !selectedMainId) {
      handleMainCategoryChange(mainCategories[0]._id);
    }
  }, [mainCategories]);

  const sortModalRef = useRef(null);
  const genderModalRef = useRef(null);
  const filterModalRef = useRef(null);

  const { type, merchant, category, subCategory, subSubCategory, tag } = useLocalSearchParams();

  const openSortModal = () => sortModalRef.current?.open();
  const openGengerModal = () => genderModalRef.current?.open();
  const openFilterModal = () => filterModalRef.current?.open();

useEffect(() => {
    const fetch = async () => {
      const filters = { merchant, type, category, subCategory, subSubCategory, tag };
      try {
        const res =
          type === "new arrivals"
            ? await fetchnewArrivalsProductsData()
            : await getFilteredProducts(filters);
        setProducts(res);
        // console.log("Fetched products:", res);
      } catch (err) {
        console.error("Error fetching:", err);
      }
    };
    fetch();
  }, [filters, type, merchant, category, subCategory, subSubCategory, tag ]);


  if (loading) return <Loader />;

  const renderItem = ({ item }) => <Card product={item} />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bottoms</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => router.push('/MainSearchPage')}>
              <Ionicons name="search" size={22} color="black" style={styles.icon} />
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

{/* COMBINED WRAPPER FOR FILTER, SORT, AND GENDER */}
<View style={styles.filterGenderWrapper}>
  {/* FILTER BUTTON */}
  <TouchableOpacity
    onPress={openFilterModal}
    style={[styles.filterButton, styles.filterButtonLeft]}
  >
    <Text style={styles.filterText}>FILTER</Text>
  </TouchableOpacity>

  {/* SORT BUTTON */}
  <TouchableOpacity
    onPress={openSortModal}
    style={[styles.filterButton1]}
  >
    <Text style={styles.filterText}>SORT</Text>
  </TouchableOpacity>

  {/* GENDER BUTTON */}
  <TouchableOpacity
    onPress={openGengerModal}
    style={styles.genderButton}
  >
    <MaterialCommunityIcons name="gender-male-female" size={18} color="black" />
  </TouchableOpacity>
</View>




        {/* Product List */}

<FlatList
  data={products}
  renderItem={renderItem}
  keyExtractor={(item, index) => index.toString()}
  numColumns={2}
  showsVerticalScrollIndicator={false}
  columnWrapperStyle={styles.row} // Ensures 2 per row
  contentContainerStyle={styles.cardList}
/>

      </View>

      {/* FILTER Modal */}
<Modalize ref={filterModalRef} adjustToContentHeight>
  <View style={{ padding: 20, backgroundColor: '#fff' }}>
    <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>Filter Options</Text>

    {/* PRICE RANGE */}
<Text style={styles.sectionTitle}>PRICE RANGE</Text>
<View style={{ alignItems: 'center', marginBottom: 20 }}>
  <MultiSlider
    values={filters.priceRange}
    sliderLength={300}
    min={0}
    max={10000}
    step={500}
onValuesChange={(values) =>
  setFilters(prev => ({ ...prev, priceRange: values }))
}
    selectedStyle={{ backgroundColor: '#000' }}
    unselectedStyle={{ backgroundColor: '#ccc' }}
    markerStyle={{ backgroundColor: '#000' }}
  />
<Text style={styles.priceLabel}>
  ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
</Text>
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
      onPress={() => toggleStore(merchant.shopName)}
      style={[
        styles.storePill,
        filters.selectedStores.includes(merchant.shopName) && styles.storePillSelected
      ]}
    >
      <Text style={[
        styles.storeText,
        filters.selectedStores.includes(merchant.shopName) && styles.storeTextSelected
      ]}>
        {merchant.shopName}
      </Text>
    </TouchableOpacity>
  ))}
</View>

    {/* APPLY BUTTON */}
    <TouchableOpacity style={styles.applyButton}>
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
      "What's new",
      'Price - high to low',
      'Popularity',
      'Discount',
      'Price - low to high',
      'Customer Rating'
    ].map((option, index) => (
      <TouchableOpacity
        key={option}
        style={{
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderBottomWidth: index === 5 ? 0 : 1,
          borderBottomColor: '#eee',
        }}
        onPress={() => {
          // setSortOption(option);
          sortModalRef.current?.close();
        }}
      >
        <Text style={{
          fontSize: 16,
          color: '#222',
          fontWeight: option === 'Customer Rating' ? '700' : '400'
        }}>
          {option}
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
          // 👇 Select category and trigger subcategory display
          setSelectedGender(cat.name);
          setSelectedMainId(cat._id); // ✅ Set the main category
          const firstSub = categoriesData.find(c => c.parentId === cat._id && c.level === 1);
          if (firstSub) setSelectedSubId(firstSub._id);
          genderModalRef.current?.close();
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: '#222',
            fontWeight: cat.name === selectedGender ? '700' : '400',
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
    fontSize: 20,
    fontWeight: 'bold',
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
  marginTop: 20,
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
