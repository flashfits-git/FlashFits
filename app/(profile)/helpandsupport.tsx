import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo (for icons)
import { useLocalSearchParams } from 'expo-router';
import HearderForProfileComponents from '../../components/ProfilePageComponents/HearderForProfileComponents'

const HelpSupportScreen = () => {
    const { title } = useLocalSearchParams<{ title: string }>();


  return (
    <>
 <HearderForProfileComponents title={title}/>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.helloText}>Hello 👋</Text>
        <Text style={styles.helpText}>How can we help?</Text>
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.option}>
          <Ionicons name="help-circle-outline" size={24} color="green" />
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>FAQs</Text>
            <Text style={styles.optionSubtitle}>Frequently asked questions</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity style={styles.option}>
          <Ionicons name="call-outline" size={24} color="green" />
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Contact us</Text>
            <Text style={styles.optionSubtitle}>We usually take 8–10 minutes to respond 😊✉️</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <Text style={styles.faqCategoryTitle}>FAQs categories</Text>

      <View style={styles.categoriesContainer}>
        <TouchableOpacity style={styles.categoryBox}>
          <Ionicons name="cube-outline" size={32} color="green" />
          <Text style={styles.categoryText}>Your Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryBox}>
          <Ionicons name="car-outline" size={32} color="green" />
          <Text style={styles.categoryText}>Shipping</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryBox}>
          <Ionicons name="card-outline" size={32} color="green" />
          <Text style={styles.categoryText}>Payments & Refunds</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryBox}>
          <Ionicons name="refresh-outline" size={32} color="green" />
          <Text style={styles.categoryText}>Returns & Exchanges</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    backgroundColor: '#A1E5A1', // Light green
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  helloText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  helpText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  optionText: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  optionSubtitle: {
    fontSize: 14,
    color: 'gray',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 20,
  },
  faqCategoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    color: '#333',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  categoryBox: {
    width: '45%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 30,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginTop: 10,
  },
});

export default HelpSupportScreen;
