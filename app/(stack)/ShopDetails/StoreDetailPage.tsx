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
import TrendingStyles from '../../../components/ShopDetailPage/TrendingStyles ';
import FeaturedDress from '../../../components/ShopDetailPage/FeaturedDress ';
import ShopOffersCarousel from '../../../components/ShopDetailPage/ShopOffersCarousel';
import jfnefn from '../../../assets/images/2.jpg'

const StoreDetailPage = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Image
            source={jfnefn}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName}>Max</Text>
            <Text style={styles.welcomeText}>Vytila | 30 min</Text>
          </View>
          {/* <TouchableOpacity style={styles.iconContainer}>
            <Icon name="sliders" size={22} color="#000" />
          </TouchableOpacity> */}
        </View>

        {/* Search Bar */}
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

      </View>

      {/* Body */}
      <View style={styles.body}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionContainer}>
            <ShopOffersCarousel />
          </View>
          <View style={styles.sectionContainer}>
            <TrendingStyles />
          </View>
          <View style={styles.sectionContainer}>
            <FeaturedDress />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EFEDE2',
  },
  headerContainer: {
    backgroundColor: '#EFEDE2',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  },
  welcomeText: {
    fontSize: 13,
    color: '#444',
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
    backgroundColor: '#FFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 12,
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
});

export default StoreDetailPage;
