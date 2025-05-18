import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import ImageCardHome from '../HomeComponents/CategoryIndexing/ImageCardHome';



const TrendingStyles = () => {
  const categories = ['All', 'Casual', 'Party', 'Formal'];
  const [selected, setSelected] = useState('All');

  // Sample items for demonstration
  const items = [
    { id: '1', title: 'Red Maxi Dress', image: 'https://via.placeholder.com/150' },
    { id: '2', title: 'Blue Cocktail Dress', image: 'https://via.placeholder.com/150' },
    { id: '3', title: 'Floral Summer Dress', image: 'https://via.placeholder.com/150' },
    { id: '4', title: 'Black Lace Dress', image: 'https://via.placeholder.com/150' },
  ];

  return (
    <View style={styles.trendingContainer}>
      {/* Category Filter */}
      {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selected === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelected(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selected === category && styles.categoryTextActive
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView> */}
      {/* Trending Items */}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.itemsScroll}>
        <ImageCardHome/>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  trendingContainer: {
    marginTop: 20,
    // paddingTop:14,
    // width:'100%'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingLeft:14
  },
  categoryScroll: {
    marginBottom: 12,
  },
  categoryButton: {
    marginRight: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',  // Inactive background
  },
  categoryButtonActive: {
    backgroundColor: '#4A148C',  // Active background (deep purple)
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  itemsScroll: {
    width:'100%',
    
  },
  itemCard: {
    width: 120,
    marginRight: 12,
    alignItems: 'center',
  },
  itemImage: {
    width: 120,
    height: 160,
    borderRadius: 10,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  
});

export default TrendingStyles;
