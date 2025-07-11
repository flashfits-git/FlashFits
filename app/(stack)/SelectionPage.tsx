import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons  } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
// import { FontAwesome5 } from '@expo/vector-icons';/
import { fetchnewArrivalsProductsData, getFilteredProducts } from '../api/productApis/products';
import Card from '@/components/HomeComponents/Card';
import Loader from '@/components/Loader/Loader';


import {fetchCategories} from '../api/categories'

export default function SelectionPage() {
  const router = useRouter();
    const [loading, setLoading] = useState(false);
  
  const [products, setProducts] = useState([]);
  const [price, setPrice] = useState(250);
  const [selectedGender, setSelectedGender] = useState("All");
    const [categoriesData, setCategoriesData] = useState([]);



  const sortModalRef = useRef<Modalize>(null);
  const genderModalRef = useRef<Modalize>(null);
  const filterModalRef = useRef<Modalize>(null);

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
        console.log("Fetched products:", res);
      } catch (err) {
        console.error("Error fetching:", err);
      }
    };
    fetch();
  }, [merchant, type, category, subCategory, subSubCategory, tag]);


    useEffect(() => {
      const loadCategories = async () => {
        setLoading(true);
        try {
          const data = await fetchCategories();
          setCategoriesData(data);
          
        } catch (err) {
          console.error("Error loading categories", err);
        } finally {
          setLoading(false);
        }
      };
      loadCategories();
    }, []);

      if (loading) {
        return (
         <Loader/>
        );
      }

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
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters Row */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            onPress={openFilterModal}
            style={[styles.filterButton, styles.filterButtonLeft, { flex: 1 }]}
          >
            <Text style={styles.filterText}>FILTER</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openSortModal}
            style={[styles.filterButton, styles.filterButtonLeft, { flex: 1 }]}
          >
            <Text style={styles.filterText}>SORT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openGengerModal}
            style={[
              styles.filterButton,
              { flex: 0.5, borderLeftColor: '#ccc', paddingLeft:10 },
            ]}
          >
            <MaterialCommunityIcons  name="gender-male-female" size={18} color="black" />
          </TouchableOpacity>
        </View>

        {/* Product List */}
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.cardList}
          showsVerticalScrollIndicator={false}
        />
      </View>

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
      {/* FILTER Modal */}
<Modalize ref={filterModalRef} adjustToContentHeight>
  <View style={{ padding: 20, backgroundColor: '#f4f0ff' }}>
    <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16 }}>Filter Options</Text>

    {/* Price Range */}
    <Text style={{ fontWeight: '600', marginBottom: 6 }}>PRICE RANGE:</Text>
    <View style={{ alignItems: 'center', marginBottom: 16 }}>
<Slider
  style={{ width: '100%' }}
  minimumValue={0}
  maximumValue={500}
  minimumTrackTintColor="#f8d442"
  maximumTrackTintColor="#ccc"
  thumbTintColor="white"
  value={price}
  onValueChange={setPrice}
/>

<View style={{ marginTop: 8 }}>
  <Text style={{ fontWeight: 'bold' }}>Max: ${Math.floor(price)}</Text>
</View>
    </View>

    {/* Category */}
    <Text style={{ fontWeight: '600', marginBottom: 6 }}>CATEGORY</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
      {['Tops', 'Bottoms', 'Shoes', 'Accessories'].map((cat) => (
        <TouchableOpacity key={cat} style={{ backgroundColor: '#fff', padding: 10, borderRadius: 20 }}>
          <Text>{cat}</Text>
        </TouchableOpacity>
      ))}
    </View>

    {/* Colors */}
    <Text style={{ fontWeight: '600', marginBottom: 6 }}>COLOR</Text>
    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
      {['#000', '#f00', '#0f0', '#00f', '#ff0'].map((color) => (
        <View key={color} style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: color,
          borderWidth: 1,
          borderColor: '#999'
        }} />
      ))}
    </View>

    {/* Store */}
    <Text style={{ fontWeight: '600', marginBottom: 6 }}>STORE</Text>
    <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
      {['Zudio', 'Trends', 'Max', 'H&M'].map((store) => (
        <TouchableOpacity key={store} style={{ backgroundColor: '#fff', padding: 10, borderRadius: 20 }}>
          <Text>{store}</Text>
        </TouchableOpacity>
      ))}
    </View>

    <TouchableOpacity style={{
      backgroundColor: '#222',
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
    }}>
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>Apply Filters</Text>
    </TouchableOpacity>
  </View>
</Modalize>


      {/* GENDER Modal */}
<Modalize ref={genderModalRef} adjustToContentHeight>
  <View style={{ paddingVertical: 12 }}>
    <Text style={{
      fontSize: 14,
      fontWeight: '500',
      color: '#888',
      paddingHorizontal: 20,
      marginBottom: 8,
    }}>
      GENDER
    </Text>

    {["All", "Men", "Women", "Kids"].map((gender) => (
      <TouchableOpacity
        key={gender}
        style={{
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderBottomWidth: gender === "Kids" ? 0 : 1,
          borderBottomColor: '#eee',
        }}
        onPress={() => {
          setSelectedGender(gender);
          genderModalRef.current?.close();
        }}
      >
        <Text style={{
          fontSize: 16,
          color: '#222',
          fontWeight: gender === selectedGender ? '700' : '400',
        }}>
          {gender}
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
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 20,

    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  filterButtonLeft: {
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  filterText: {
    fontWeight: '600',
  },
  cardList: {
    paddingBottom: 20,
  },
});
