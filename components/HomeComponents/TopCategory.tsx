import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 3; // spacing for 3 cards per row

const TopCategory = () => {
  const categories = [
    { id: 1, title: "Tops & Dresses", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop" },
    { id: 2, title: "Men's Topwear", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop" },
    { id: 3, title: "Women's Ethnic", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop" },
    { id: 4, title: "Men's Ethnic", image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=400&h=400&fit=crop" },
    { id: 5, title: "Bottomwear", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop" },
    { id: 6, title: "Accessories", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=400&h=400&fit=crop" },
    { id: 7, title: "Makeup & Skin", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop" },
    { id: 8, title: "Men's Grooming", image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&h=400&fit=crop" },
    { id: 9, title: "Travel", image: "https://images.unsplash.com/photo-1553697388-94e804e2f0f6?w=400&h=400&fit=crop" },
    { id: 10, title: "Footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop" },
    { id: 11, title: "Essentials", image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=400&fit=crop" },
    { id: 12, title: "Home Decor", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop" },
  ];

  const renderCategory = (category) => (
    <TouchableOpacity key={category.id} style={styles.categoryCard} activeOpacity={0.8}>
      <Image source={{ uri: category.image }} style={styles.categoryImage} resizeMode="cover" />
      <Text style={styles.categoryTitle}>{category.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>
          TOP <Text style={styles.italicText}>Categories</Text>
        </Text>
        <Text style={styles.subtitle}>Discover the Best in Every Category</Text>
      </View>

      <View style={styles.grid}>
        {categories.map(renderCategory)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#e0f4f4',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  italicText: {
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 12,
  },
  categoryCard: {
    width: CARD_WIDTH,
    marginBottom: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1.5,
    borderColor: '#f4d19b',
    alignItems: 'center',
  },
  categoryImage: {
    width: '100%',
    height: CARD_WIDTH - 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    paddingVertical: 6,
    textAlign: 'center',
  },
});

export default TopCategory;