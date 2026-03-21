import Loader from '@/components/Loader/Loader';
import { useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CategoryTitleBar from '../../components/CategoryPageComponents/CategoryTitleBar';
import { fetchCategories } from '../api/categories';
import { useGender } from '../GenderContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const productsAreaWidth = SCREEN_WIDTH * 0.75;
const cardSize = (productsAreaWidth - 48) / 3;

// Static gender tabs (replaces old L0 gender categories)
const GENDER_TABS = ['All', 'Men', 'Women', 'Kids'] as const;
type GenderTab = typeof GENDER_TABS[number];

// Map UI labels to backend enum
const GENDER_MAP: Record<string, string> = { Men: 'MEN', Women: 'WOMEN', Kids: 'KIDS' };

const Categories = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const { selectedGender, setSelectedGender } = useGender(); // Use global gender context
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [selectedMainId, setSelectedMainId] = useState<string | null>(null);
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

  // L0 categories filtered by allowedGenders matching selected gender tab
  const mainCategories = useMemo(() => {
    if (selectedGender === 'All') {
      return categoriesData.filter(cat => cat.level === 0);
    }
    const backendGender = GENDER_MAP[selectedGender];
    return categoriesData.filter(
      cat => cat.level === 0 && (cat.allowedGenders || []).includes(backendGender)
    );
  }, [categoriesData, selectedGender]);

  // L1 subcategories of the selected L0 main category, ALSO filtered by gender
  const subCategories = useMemo(() => {
    if (selectedGender === 'All') {
      return categoriesData.filter(cat => cat.level === 1 && cat.parentId === selectedMainId);
    }
    const backendGender = GENDER_MAP[selectedGender];
    return categoriesData.filter(
      cat => cat.level === 1 && cat.parentId === selectedMainId && (cat.allowedGenders || []).includes(backendGender)
    );
  }, [categoriesData, selectedMainId, selectedGender]);

  // Select first main category when gender changes
  useEffect(() => {
    if (mainCategories.length > 0) {
      setSelectedMainId(mainCategories[0]._id);
    } else {
      setSelectedMainId(null);
    }
  }, [mainCategories]);

  const handleViewAll = (subCatName: string, subCategoryId: string) => {
    const backendGender = GENDER_MAP[selectedGender];
    router.push({
      pathname: '/(stack)/SelectionPage' as any,
      params: {
        filterss: JSON.stringify({
          priceRange: [0, 10000],
          selectedCategoryIds: [selectedMainId, subCategoryId],
        }),
        subCatName,
        gender: backendGender,
      },
    });
  };

  if (loading) return <Loader />;

  return (
    <>
      <CategoryTitleBar />

      {/* Gender Tabs (static — replaces old L0 gender scroll) */}
      <View style={styles.categoryBarContainer}>
        <View style={styles.categoryBarContent}>
          {GENDER_TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.mainCategoryButton, selectedGender === tab && styles.mainCategoryButtonSelected]}
              onPress={() => setSelectedGender(tab)}
            >
              <Text style={[styles.mainCategoryText, selectedGender === tab && { fontWeight: '800', color: '#000' }]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.mainContent}>
        {/* Sidebar — L0 main categories for this gender */}
        <ScrollView style={styles.sidebar} showsVerticalScrollIndicator={false}>
          {mainCategories.map(cat => (
            <TouchableOpacity
              key={cat._id}
              style={[styles.sidebarItem, selectedMainId === cat._id && styles.sidebarItemSelected]}
              onPress={() => setSelectedMainId(cat._id)}
            >
              <Image source={{ uri: cat.image?.url }} style={styles.sidebarImage} />
              <Text style={[styles.sidebarText, selectedMainId === cat._id && styles.sidebarTextSelected]} numberOfLines={2}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 3 Column Grid — L1 subcategories */}
        <View style={styles.productsContainer}>
          <FlatList
            data={subCategories}
            keyExtractor={(item) => item._id}
            numColumns={3}
            columnWrapperStyle={styles.cardRow}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.productCard, { width: cardSize, height: cardSize + 40 }]}
                onPress={() => handleViewAll(item.name, item._id)}
              >
                <View style={{ position: 'relative' }}>
                  <Image source={{ uri: item.image?.url }} style={[styles.productImage, { height: cardSize }]} />
                  {item.isTriable && (
                    <View style={styles.triableBadge}>
                      <Text style={styles.triableText}>Try at Home</Text>
                    </View>
                  )}
                </View>
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
  categoryBarContainer: {
    height: 50,
    backgroundColor: '#fff',
    elevation: 4,
  },
  categoryBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  mainCategoryButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  mainCategoryButtonSelected: { borderColor: '#000' },
  mainCategoryText: { fontSize: 14, fontWeight: '600', color: '#888', letterSpacing: 0.5 },

  mainContent: { flex: 1, flexDirection: 'row', backgroundColor: '#fff' },

  sidebar: { flex: 1, backgroundColor: '#fff', borderRightWidth: 1, borderColor: '#eee', paddingVertical: 10 },
  sidebarItem: { alignItems: 'center', paddingVertical: 12 },
  sidebarItemSelected: { backgroundColor: '#eef3ff' },
  sidebarImage: { width: 65, height: 80, borderRadius: 12, marginBottom: 6, backgroundColor: '#f8f8f8' },
  sidebarText: { fontSize: 11, color: '#444', textAlign: 'center', paddingHorizontal: 6 },
  sidebarTextSelected: { color: '#0a1b3c', fontWeight: '700' },

  productsContainer: { flex: 2, padding: 12 },
  listContent: { paddingBottom: 120 },
  cardRow: { justifyContent: 'space-between', marginBottom: 16 },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: cardSize,
    borderRadius: 18,
    backgroundColor: '#f2f2f2',
  },
  productTitle: { fontSize: 11.5, textAlign: 'center', paddingVertical: 6, color: '#333' },
  triableBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 2,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  triableText: {
    color: '#fff',
    fontSize: 8,
    textAlign: 'center',
    fontWeight: '700',
  },
});

export default Categories;
