import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For back and search icons
import { useRouter } from 'expo-router';

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


  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24}  />
        </TouchableOpacity>
        <TextInput 
          placeholder="Search"
          placeholderTextColor="black"
          style={styles.searchInput}
        />
        <TouchableOpacity>
          <Ionicons name="search" size={24} />
        </TouchableOpacity>
      </View>

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

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Viral Searches */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Viral Searches 🔥</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {viralSearches.map((item, index) => (
              <View key={index} style={styles.viralItem}>
                <View style={styles.viralIcon}>
                  <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                </View>
                <Text style={styles.viralText}>{item.title}</Text>
              </View>
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
            keyExtractor={item => item.id}
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
            keyExtractor={item => item.id}
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
    fontSize: 15 
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
    marginBottom: 12,
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
