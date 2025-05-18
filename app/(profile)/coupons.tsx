import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import HearderForProfileComponents from '../../components/ProfilePageComponents/HearderForProfileComponents'

const CouponPage = () => {
  const [activeTab, setActiveTab] = useState<'Active' | 'Expired'>('Active');
    const { title } = useLocalSearchParams<{ title: string }>();

  return (
    <>
 <HearderForProfileComponents title={title}/>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Coupons</Text>
        <Text style={styles.headerSubtitle}>You can only use one coupon at a time.</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity onPress={() => setActiveTab('Active')} style={styles.tabButton}>
          <Text style={[styles.tabText, activeTab === 'Active' && styles.activeTabText]}>
            Active {activeTab === 'Active' && <Text style={styles.tabCount}>(0)</Text>}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('Expired')} style={styles.tabButton}>
          <Text style={[styles.tabText, activeTab === 'Expired' && styles.activeTabText]}>
            Expired {activeTab === 'Expired' && <Text style={styles.tabCount}>(0)</Text>}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabIndicator} />

      {/* Empty State */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image 
          source={require('../../assets/images/3.jpg')} // <- put your no_coupon image here
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.emptyText}>Oops! No Coupons found!</Text>
      </ScrollView>
    </View>
    </>
  );
};

export default CouponPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    backgroundColor: '#fff',
  },
  tabButton: {
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  tabCount: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  tabIndicator: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 4,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
});
