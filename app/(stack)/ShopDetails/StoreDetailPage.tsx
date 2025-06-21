import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import TrendingStyles from '../../../components/ShopDetailPage/TrendingStyles ';
import FeaturedDress from '../../../components/ShopDetailPage/FeaturedDress ';
import ShopOffersCarousel from '../../../components/ShopDetailPage/ShopOffersCarousel';
import RecentlyViewed from '../../../components/HomeComponents/RecentlyViewed';
import jfnefn from '../../../assets/images/2.jpg';

const StoreDetailPage = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Image source={jfnefn} style={styles.avatar} />
          <View>
            <Text style={styles.userName}>Max</Text>
            <Text style={styles.welcomeText}>Vytila | 30 min</Text>
          </View>
        </View>

        {/* Search Bar */}
        {/* 
        <View style={styles.searchContainer}>
          <Icon name="search" size={18} color="#888" style={styles.searchIcon} />
          <TextInput
            placeholder="Search for styles or offers"
            placeholderTextColor="#888"
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.iconContainer}>
            <Icon name="sliders" size={22} color="#000" />
          </TouchableOpacity>
        </View>
        */}
      </View>

      <LinearGradient colors={['#fff', '#fff']} style={styles.body}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionContainer}>
            <ShopOffersCarousel />
          </View>

          <Text style={styles.sectionTitle}>Products in Store</Text>

          <View style={styles.sectionContainer}>
            <RecentlyViewed />
          </View>
          <View style={styles.sectionContainer}>
            <RecentlyViewed />
          </View>
          <View style={styles.sectionContainer}>
            <RecentlyViewed />
          </View>
          <View style={styles.sectionContainer1}>
            <FeaturedDress />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
    sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    // marginBottom: 12,
    marginTop: 16,
    fontFamily: 'Montserrat',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  userName: {
    fontSize: 30,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Montserrat',
  },
  welcomeText: {
    fontSize: 13,
    color: '#444',
    fontFamily: 'Montserrat',
  },
  iconContainer: {
    marginLeft: 'auto',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  body: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 12,
    overflow: 'hidden', // to handle radius clipping
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  sectionContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',

  },
    sectionContainer1: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    borderTopWidth:1,
    
  },
});

export default StoreDetailPage;
