import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import CategoryTitleBar from '../../components/CategoryPageComponents/CategoryTitleBar';
import { useNavigation, useRouter } from 'expo-router';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { fetchCategories } from '../api/categories.js';
import Loader from '@/components/Loader/Loader';

const SCREEN_WIDTH = Dimensions.get('window').width;
const productsAreaWidth = SCREEN_WIDTH * 0.75; // since flex:4 vs flex:1
const cardSize = (productsAreaWidth - 48) / 3; // spacing included

const Categories = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedMainId, setSelectedMainId] = useState(null);
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [loading, setLoading] = useState(true);

  const scrollOffset = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);

  useEffect(() => {
    const listener = scrollOffset.addListener(({ value }) => {
      const clampedValue = Math.max(0, value);
      if (clampedValue < currentOffset.current - 5) {
        navigation.setOptions({
          tabBarStyle: {
            display: 'flex',
            position: 'absolute',
            height: 70,
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            elevation: 15,
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          },
        });
      } else if (clampedValue > currentOffset.current + 5 && clampedValue > 50) {
        navigation.setOptions({ tabBarStyle: { display: 'none' } });
      }
      currentOffset.current = clampedValue;
    });

    return () => scrollOffset.removeListener(listener);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchCategories();
        setCategoriesData(data || []);
      } catch (err) {
        console.error('Error loading categories', err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const mainCategories = categoriesData.filter(cat => cat.level === 0);
  const subCategories = categoriesData.filter(cat => cat.level === 1 && cat.parentId === selectedMainId);
  const subSubCategories = categoriesData.filter(cat => cat.level === 2 && cat.parentId === selectedSubId);

  const handleMainCategoryChange = useCallback((id) => {
    setSelectedMainId(id);
    const firstSub = categoriesData.find(cat => cat.parentId === id && cat.level === 1);
    setSelectedSubId(firstSub ? firstSub._id : null);
  }, [categoriesData]);

  const handleSubCategoryChange = (id) => setSelectedSubId(id);

  useEffect(() => {
    if (mainCategories.length > 0 && !selectedMainId) {
      handleMainCategoryChange(mainCategories[0]._id);
    }
  }, [mainCategories]);

  const handleViewAll = (subCatName, subCategoryId, subSubCategoryId) => {
    router.push({
      pathname: '(stack)/SelectionPage',
      params: {
        filterss: JSON.stringify({
          priceRange: [0, 10000],
          selectedCategoryIds: [selectedMainId, subCategoryId, subSubCategoryId],
        }),
        subCatName,
      },
    });
  };

  if (loading) return <Loader />;

  return (
    <>
      <CategoryTitleBar />

      {/* Main Category Scroll */}
      <View style={styles.categoryBarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScrollContent}>
          {mainCategories.map(cat => (
            <TouchableOpacity
              key={cat._id}
              style={[styles.mainCategoryButton, selectedMainId === cat._id && styles.mainCategoryButtonSelected]}
              onPress={() => handleMainCategoryChange(cat._id)}
            >
              <Image
                source={{ uri: cat.image?.url }}
                style={styles.mainCategoryImage}
              />
              <Text style={styles.mainCategoryText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.mainContent}>
        {/* Sidebar */}
        <ScrollView style={styles.sidebar} showsVerticalScrollIndicator={false}>
          {subCategories.map(sub => (
            <TouchableOpacity
              key={sub._id}
              style={[styles.sidebarItem, selectedSubId === sub._id && styles.sidebarItemSelected]}
              onPress={() => handleSubCategoryChange(sub._id)}
            >
              <Image source={{ uri: sub.image?.url }} style={styles.sidebarImage} />
              <Text style={[styles.sidebarText, selectedSubId === sub._id && styles.sidebarTextSelected]} numberOfLines={2}>
                {sub.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 3 Column Grid */}
        <View style={styles.productsContainer}>
          <FlatList
            data={subSubCategories}
            keyExtractor={(item) => item._id}
            numColumns={3}
            columnWrapperStyle={styles.cardRow}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.productCard, { width: cardSize, height: cardSize + 40 }]}
                onPress={() => handleViewAll(item.name, selectedSubId, item._id)}
              >
                <Image source={{ uri: item.image?.url }} style={[styles.productImage, { height: cardSize }]} />
                <Text style={styles.productTitle} numberOfLines={2}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  categoryBarContainer: { height: 110, backgroundColor: '#fff', paddingTop: 10, elevation: 4 },
  categoryScrollContent: { alignItems: 'center', paddingHorizontal: 4 },
  mainCategoryButton: { alignItems: 'center', marginRight: 24, paddingBottom: 6, borderBottomWidth: 2, borderColor: 'transparent' },
  mainCategoryButtonSelected: { borderColor: '#4c4e50ff' },
  mainCategoryImage: { width: 68, height: 68, borderRadius: 18, marginBottom: 6, backgroundColor: '#f0f0f0' },
  mainCategoryText: { fontSize: 11.5, fontWeight: '600', color: '#222' },

  mainContent: { flex: 1, flexDirection: 'row', backgroundColor: '#fff' },

  sidebar: { flex: 1, backgroundColor: '#fff', borderRightWidth: 1, borderColor: '#eee', paddingVertical: 10 },
  sidebarItem: { alignItems: 'center', paddingVertical: 12 },
  sidebarItemSelected: { backgroundColor: '#eef3ff' },
  sidebarImage: { width: 65, height: 80, borderRadius: 12, marginBottom: 6, backgroundColor: '#f8f8f8' },
  sidebarText: { fontSize: 11, color: '#444', textAlign: 'center', paddingHorizontal: 6 },
  sidebarTextSelected: { color: '#0a1b3c', fontWeight: '700' },

  productsContainer: { flex: 2, padding: 12 },
  listContent: { paddingBottom: 120 },
  cardRow: { justifyContent: 'space-between', marginBottom: 16, },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 18,       // ← make more rounded
    overflow: 'hidden',     // ← ensures image also follows radius
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: cardSize,       // keep your dynamic height
    borderRadius: 18,       // ← ensure this matches productCard
    backgroundColor: '#f2f2f2',
  },
  productTitle: { fontSize: 11.5, textAlign: 'center', paddingVertical: 6, color: '#333' },
});

export default Categories;
