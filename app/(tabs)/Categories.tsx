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
  ActivityIndicator,
} from 'react-native';
import CategoryTitleBar from '../../components/CategoryPageComponents/CategoryTitleBar';
import { useNavigation } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { fetchCategories } from '../api/categories.js';
import Loader from '@/components/Loader/Loader';

// import { useCart } from './Context';

const Categories = () => {
  const navigation = useNavigation();
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedMainId, setSelectedMainId] = useState(null);
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [loading, setLoading] = useState(false);
  // const { cartCount } = useCart();

  const scrollOffset = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);

  useEffect(() => {
    const listener = scrollOffset.addListener(({ value }) => {
      const clampedValue = Math.max(0, value);
      if (clampedValue < currentOffset.current - 5) {
        navigation.setOptions({
          tabBarStyle: {
            position: 'absolute',
            height: Platform.OS === 'ios' ? 70 : 70,
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5,
            paddingTop: Platform.OS === 'ios' ? 18 : 10,
          },
        });
      } else if (clampedValue > currentOffset.current + 5 && clampedValue > 3) {
        navigation.setOptions({ tabBarStyle: { display: 'none' } });
      }
      currentOffset.current = clampedValue;
    });

    return () => {
      scrollOffset.removeListener(listener);
    };
  }, []);

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

  useEffect(() => {
    if (mainCategories.length > 0 && !selectedMainId) {
      handleMainCategoryChange(mainCategories[0]._id);
    }
  }, [mainCategories]);

  if (loading) {
    return (
     <Loader/>
    );
  }

  return (
    <>
      <CategoryTitleBar  />
      
      {/* Top Main Categories Scroll */}
      <View style={styles.categoryBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {mainCategories.map(cat => (
            <TouchableOpacity
              key={cat._id}
              style={[
                styles.mainCategoryButton,
                selectedMainId === cat._id && { borderColor: '#eee' },
              ]}
              onPress={() => handleMainCategoryChange(cat._id)}
            >
              <Image
                source={require('../../assets/images/3.jpg')}
                style={styles.mainCategoryImage}
              />
              <Text style={styles.mainCategoryText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sidebar + Products */}
      <View style={styles.mainContent}>
        <ScrollView style={styles.sidebar}>
          {subCategories.map(sub => (
            <TouchableOpacity
              key={sub._id}
              style={[
                styles.sidebarItem,
                selectedSubId === sub._id && styles.sidebarItemSelected,
              ]}
              onPress={() => handleSubCategoryChange(sub._id)}
            >
              <Text
                style={[
                  styles.sidebarText,
                  selectedSubId === sub._id && styles.sidebarTextSelected,
                ]}
              >
                {sub.name.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.productsContainer}>
          <FlatList
            data={subSubCategories}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.cardGrid}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() => navigation.navigate('(stack)/SelectionPage')}
              >
                <Image
                  source={{ uri: item.image?.url }}
                  style={styles.productImage}
                />
                <Text style={styles.productTitle} numberOfLines={2}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBarContainer: {
    height: 110,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingTop: 10,
    elevation: 3,
    zIndex: 10,
  },
  categoryScrollContent: {
    alignItems: 'center',
  },
  mainCategoryButton: {
    alignItems: 'center',
    marginRight: 30,
    borderBottomWidth: 2,
    borderColor: 'transparent',
    paddingBottom: 5,
  },
  mainCategoryImage: {
    width: 70,
    height: 70,
    borderRadius: 20,
    marginBottom: 5,
    resizeMode: 'cover',
  },
  mainCategoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
  },
  sidebar: {
    width: 100,
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  sidebarItem: {
    paddingVertical: 20,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarItemSelected: {
    backgroundColor: '#eee',
  },
  sidebarText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Montserrat',
  },
  sidebarTextSelected: {
    fontWeight: 'bold',
    color: '#000',
  },
  productsContainer: {
    flex: 7,
    backgroundColor:'#fff'
  },
  listContent: {
    backgroundColor: '#fff',
    padding: 10,
    paddingBottom: 120,
  },
  cardGrid: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    width: '48%',
    margin: '1%',
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    height: 150,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  productImage: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  productTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
    lineHeight: 16,
    textTransform: 'capitalize',
    fontFamily: 'Montserrat',
  },
});

export default Categories;
