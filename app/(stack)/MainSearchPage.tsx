import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPreviouslyViewed } from '../utilities/localStorageRecentlyViewd';

// Sample data (unchanged)
const viralSearches = [
  { title: 'Floral fantasy', icon: '🌸' },
  { title: 'Denim Jeans', icon: '🔥' },
  { title: 'Birthday Dress', icon: '🎂' },
  { title: 'Date night wear', icon: '💖' },
  { title: 'Party wear', icon: '🕺' },
];

interface Product {
  id?: string;
  _id?: string;
  name?: string;
  price?: number;
  mrp?: number;
  variants?: any;
  images?: any[];
}

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSearches, setLastSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Load last searches and products from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingProducts(true);
        // Load last searches
        const storedSearches = await AsyncStorage.getItem('lastSearches');
        if (storedSearches) {
          setLastSearches(JSON.parse(storedSearches));
        }

        // Fetch actual recently viewed products from local storage
        const viewed = await getPreviouslyViewed();
        console.log(viewed, 'viewedFromStorage');

        setRecentlyViewedProducts(viewed || []);
      } catch (error) {
        console.error('Error loading search screen data:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadData();
  }, []);

  const saveSearch = async (query) => {
    if (!query.trim()) return;
    try {
      const updatedSearches = [
        query.trim(),
        ...lastSearches.filter((item) => item !== query.trim()),
      ].slice(0, 5);
      setLastSearches(updatedSearches);
      await AsyncStorage.setItem('lastSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  const clearSearches = async () => {
    try {
      setLastSearches([]);
      await AsyncStorage.removeItem('lastSearches');
    } catch (error) {
      console.error('Error clearing searches:', error);
    }
  };

  const handleSearchInput = (text) => {
    setSearchQuery(text);
    if (text.trim().length > 0) {
      const filteredSuggestions = viralSearches
        .filter((item) =>
          item.title.toLowerCase().includes(text.toLowerCase())
        )
        .map((item) => item.title);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      saveSearch(searchQuery);
      setShowSuggestions(false);
      router.replace({
        pathname: '/SelectionPage',
        params: { query: searchQuery.trim() },
      });
    }
  };

  const handleSelectSearch = (query) => {
    setSearchQuery(query);
    saveSearch(query);
    setShowSuggestions(false);
    router.replace({
      pathname: '/SelectionPage',
      params: { query },
    });
  };

  const navigateToProduct = (id: string) => {
    router.push({
      pathname: '/ProductDetail/productdetailpage' as any,
      params: { id },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <TextInput
          placeholder="Search items, brands and more"
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearchInput}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearchSubmit}>
          <Ionicons name="search" size={24} color="#1E293B" />
        </TouchableOpacity>
      </View>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectSearch(item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionsList}
          />
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Last Searches */}
        {lastSearches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Last Searches</Text>
              <TouchableOpacity onPress={clearSearches}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {lastSearches.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.lastSearchItem}
                  onPress={() => handleSelectSearch(item)}
                >
                  <Text style={styles.lastSearchText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}


        {/* Previously Viewed (Recently Viewed) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Viewed</Text>
          {loadingProducts ? (
            <ActivityIndicator size="small" color="#000" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={recentlyViewedProducts}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={(item) => item.id || item._id || Math.random().toString()}
              contentContainerStyle={{ marginTop: 12 }}
              renderItem={({ item }) => {
                const imageUrl =
                  item.variants?.images?.[0]?.url ||
                  item.images?.[0]?.url ||
                  item.variants?.[0]?.images?.[0]?.url ||
                  'https://via.placeholder.com/150';

                const price =
                  item.variants?.price ||
                  item.price ||
                  item.variants?.[0]?.price;

                const mrp =
                  item.variants?.mrp ||
                  item.mrp ||
                  item.variants?.[0]?.mrp;

                return (
                  <TouchableOpacity
                    style={styles.productCard}
                    onPress={() => navigateToProduct(item.id || item._id)}
                  >
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.productImage}
                    />
                    <Text style={styles.productTitle} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.productPrice}>₹{price}</Text>
                      {mrp && mrp > price && (
                        <Text style={styles.oldPrice}>₹{mrp}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No recently viewed products</Text>
              }
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#F8FAFC',
    marginHorizontal: 12,
    borderRadius: 24,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 110,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: 250,
    zIndex: 100,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  suggestionsList: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  suggestionText: {
    fontSize: 14,
    color: '#334155',
  },
  section: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'Montserrat',
  },
  clearText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '600',
  },
  lastSearchItem: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lastSearchText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  viralItem: {
    alignItems: 'center',
    marginRight: 24,
  },
  viralIcon: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 50,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  viralText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  productCard: {
    flex: 0.5,
    backgroundColor: '#fff',
    margin: 6,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  productTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  oldPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    color: '#94A3B8',
    marginLeft: 6,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});