import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sample data (unchanged)
const viralSearches = [
  { title: 'Floral fantasy', icon: '🌸' },
  { title: 'Denim Jeans', icon: '🔥' },
  { title: 'Birthday Dress', icon: '🎂' },
  { title: 'Date night wear', icon: '💖' },
  { title: 'Party wear', icon: '🕺' },
];

const previouslyViewed = [
  { id: '1', title: 'Black Solid Tie Up Max...', price: 799, oldPrice: 1129, image: 'https://via.placeholder.com/100x140' },
  { id: '2', title: 'Black One Shoulder M...', price: 1159, oldPrice: 1279, image: 'https://via.placeholder.com/100x140' },
  { id: '3', title: 'Dark Green Dress', price: 1699, oldPrice: 0, image: 'https://via.placeholder.com/100x140' },
  { id: '4', title: 'Red Strapless Dress', price: 779, oldPrice: 0, image: 'https://via.placeholder.com/100x140' },
];

const newDrops = [
  { id: '5', title: 'Solid Slip Dress', price: 399, image: 'https://via.placeholder.com/100x140' },
  { id: '6', title: 'Nude Shorts', price: 549, image: 'https://via.placeholder.com/100x140' },
  { id: '7', title: 'Breast Lift Cups', price: 349, image: 'https://via.placeholder.com/100x140' },
  { id: '8', title: 'Lace Stockings', price: 249, image: 'https://via.placeholder.com/100x140' },
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSearches, setLastSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load last searches from AsyncStorage when component mounts
  useEffect(() => {
    const loadLastSearches = async () => {
      try {
        const storedSearches = await AsyncStorage.getItem('lastSearches');
        if (storedSearches) {
          setLastSearches(JSON.parse(storedSearches));
        }
      } catch (error) {
        console.error('Error loading last searches:', error);
      }
    };
    loadLastSearches();
  }, []);

  // Save a new search query to AsyncStorage
  const saveSearch = async (query) => {
    if (!query.trim()) return;
    try {
      const updatedSearches = [
        query.trim(),
        ...lastSearches.filter((item) => item !== query.trim()),
      ].slice(0, 5); // Keep only the last 5 searches
      setLastSearches(updatedSearches);
      await AsyncStorage.setItem('lastSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  // Clear all last searches
  const clearSearches = async () => {
    try {
      setLastSearches([]);
      await AsyncStorage.removeItem('lastSearches');
    } catch (error) {
      console.error('Error clearing searches:', error);
    }
  };

  // Handle search input change and filter suggestions
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

  // Handle search submission
  const handleSearchSubmit = () => {
  if (searchQuery.trim()) {
    saveSearch(searchQuery);
    setShowSuggestions(false);
    router.replace({
      pathname: '/SelectionPage',
      params: { query: searchQuery.trim() }, // 🔥 pass query
    });
  }
  };

  // Handle suggestion or last search selection
  const handleSelectSearch = (query) => {
  setSearchQuery(query);
  saveSearch(query);
  setShowSuggestions(false);
  router.replace({
    pathname: '/SelectionPage',
    params: { query },
  });
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <TextInput
          placeholder="Search"
          placeholderTextColor="black"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearchInput}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearchSubmit}>
          <Ionicons name="search" size={24} />
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

        {/* Categories */}
        <View style={styles.categories}>
          <TouchableOpacity style={styles.categoryButton}>
            <Text>Categories</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text>Product ID</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text>Find stores</Text>
          </TouchableOpacity>
        </View>

        {/* Viral Searches */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Viral Searches 🔥</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {viralSearches.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.viralItem}
                onPress={() => handleSelectSearch(item.title)}
              >
                <View style={styles.viralIcon}>
                  <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                </View>
                <Text style={styles.viralText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Previously Viewed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Previously Viewed</Text>
          <FlatList
            data={previouslyViewed}
            numColumns={2}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.productCard}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <Text style={styles.productTitle}>{item.title}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.productPrice}>₹{item.price}</Text>
                  {item.oldPrice !== 0 && (
                    <Text style={styles.oldPrice}> ₹{item.oldPrice}</Text>
                  )}
                </View>
              </View>
            )}
          />
        </View>

        {/* New Drops */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New Drops 🔥</Text>
          <FlatList
            data={newDrops}
            numColumns={2}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.productCard}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <Text style={styles.productTitle}>{item.title}</Text>
                <Text style={styles.productPrice}>₹{item.price}</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 60,
    backgroundColor: '#f1f1f1',
    marginHorizontal: 8,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 15,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: 200,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  suggestionsList: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearText: {
    fontSize: 14,
    color: '#ff4444',
  },
  lastSearchItem: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  lastSearchText: {
    fontSize: 14,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viralItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  viralIcon: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 50,
    marginBottom: 6,
  },
  viralText: {
    fontSize: 12,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    margin: 6,
    borderRadius: 10,
    padding: 8,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  productTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  oldPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    color: '#999',
    marginLeft: 6,
  },
});