import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWishlist } from '../WishlistContext';
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
  ratings?: string | number;
  isTriable?: boolean;
}

const ProductCard = React.memo(({ product, onPress }: { product: Product; onPress: () => void }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [wishlistLoading, setWishlistLoading] = React.useState(false);

  const variantId = Array.isArray(product.variants)
    ? product.variants[0]?._id
    : product.variants?._id;

  const imageUrl =
    product?.images?.[0]?.url ||
    product?.variants?.[0]?.images?.[0]?.url ||
    product?.variants?.images?.[0]?.url ||
    'https://via.placeholder.com/150';

  const price =
    product?.price ||
    product?.variants?.[0]?.price ||
    product?.variants?.price;

  const mrp =
    product?.mrp ||
    product?.variants?.[0]?.mrp ||
    product?.variants?.mrp;

  const handleWishlistToggle = async () => {
    if (wishlistLoading || !variantId) return;
    setWishlistLoading(true);
    try {
      await toggleWishlist(product._id || product.id || '', String(variantId));
    } catch (err) {
      console.log('Wishlist toggle error:', err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const isLiked = variantId ? isInWishlist(String(variantId)) : false;

  return (
    <TouchableOpacity style={styles.premiumCard} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: String(imageUrl) }}
          style={styles.productImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.bestsellerBadge}>
          <Text style={styles.bestsellerText}>Bestseller</Text>
        </View>
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={handleWishlistToggle}
          disabled={wishlistLoading}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={18}
            color={isLiked ? '#FF4444' : '#fff'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.productTitle} numberOfLines={1}>
          {product.name}
        </Text>

        <View style={styles.ratingRow}>
          <View style={styles.starRating}>
            <Ionicons name="star" size={10} color="#028a34" />
            <Text style={styles.ratingValue}>{product.ratings || '4.2'}</Text>
          </View>
          {product.isTriable && (
            <View style={styles.tryContainer}>
              <Text style={styles.tryText}>Try & Buy</Text>
            </View>
          )}
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>₹{price}</Text>
          {mrp && mrp > price && (
            <Text style={styles.oldPrice}>₹{mrp}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

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
      router.push({
        pathname: '/SelectionPage',
        params: { query: searchQuery.trim() },
      });
    }
  };

  const handleSelectSearch = (query) => {
    setSearchQuery(query);
    saveSearch(query);
    setShowSuggestions(false);
    router.push({
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
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onPress={() => navigateToProduct(item.id || item._id || '')}
                />
              )}
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
  premiumCard: {
    flex: 0.5,
    backgroundColor: '#fff',
    margin: 6,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    width: '100%',
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8FAFC',
  },
  bestsellerBadge: {
    position: 'absolute',
    top: 8,
    left: 0,
    backgroundColor: '#0F0F0F',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  bestsellerText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    fontFamily: 'Manrope-ExtraBold',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 6,
    borderRadius: 20,
  },
  detailsContainer: {
    padding: 10,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F0F0F',
    marginBottom: 4,
    fontFamily: 'Manrope-Bold',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  starRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F0F0F',
    fontFamily: 'Manrope-Bold',
  },
  tryContainer: {
    backgroundColor: '#e6f7ef',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#028a34',
  },
  tryText: {
    fontSize: 9,
    color: '#028a34',
    fontWeight: '700',
    fontFamily: 'Manrope-Bold',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F0F0F',
    fontFamily: 'Manrope-ExtraBold',
  },
  oldPrice: {
    fontSize: 11,
    color: '#8E8E93',
    textDecorationLine: 'line-through',
    marginLeft: 4,
    fontFamily: 'Manrope-Medium',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});