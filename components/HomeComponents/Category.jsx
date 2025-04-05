import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { id: '1', name: 'T-Shirt', icon: 'shirt-outline' },
  { id: '2', name: 'Pant', icon: 'podium-outline' },
  { id: '3', name: 'Dress', icon: 'accessibility-outline' },
  { id: '4', name: 'Jacket', icon: 'globe-outline' },
];

const Category = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={32} color="#7B4F32" />
      </View>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Category</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    color: '#7B4F32',
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  iconContainer: {
    width: 70,
    height: 70,
    backgroundColor: '#F5F5F5',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    marginTop: 8,
    fontSize: 14,
  },
});

export default Category;
