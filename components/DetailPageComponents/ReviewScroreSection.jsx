// RatingReview.tsx

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const reviews = [
  { label: 'Fit', value: 69, text: 'Just right(69%)' },
  { label: 'Length', value: 44, text: 'Just right(44%)' },
  { label: 'Transparency', value: 56, text: 'Low(56%)' },
  { label: 'Stretchability', value: 56, text: 'Medium(56%)' },
];

const ReviewScroreSection = () => {
  return (
    <LinearGradient
      colors={['#F1FAF2', '#E8F7E6']}
      style={styles.container}
    >
      <Text style={styles.title}>Ratings & Reviews</Text>
      <Text style={styles.subTitle}>16 ratings | 17 Reviews</Text>

      <View style={styles.scoreContainer}>
        <Text style={styles.score}>4.9</Text>
        <Ionicons name="leaf" size={24} color="#F2C94C" />
      </View>

      <Text style={styles.loveText}>Our loyal customers love us</Text>

      <Text style={styles.sectionTitle}>What our customers say about the product</Text>

      {reviews.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.label}>{item.label}</Text>
          <View style={styles.barContainer}>
            <View style={[styles.barFill, { width: `${item.value}%` }]} />
          </View>
          <Text style={styles.percentText}>{item.text}</Text>
        </View>
      ))}

      <Text style={styles.viewDetails}>View Details</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // borderRadius: 12,
    // margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
  subTitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  score: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1B1B1B',
    marginRight: 8,
  },
  loveText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 12,
    color: '#1B1B1B',
    fontWeight: '600',
  },
  row: {
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: '#222',
    marginBottom: 4,
  },
  barContainer: {
    height: 6,
    width: '100%',
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    backgroundColor: '#2BA84A',
  },
  percentText: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
  viewDetails: {
    fontSize: 14,
    color: '#1BA84A',
    fontWeight: '600',
    marginTop: 12,
    textDecorationLine: 'underline',
  },
});

export default ReviewScroreSection;
