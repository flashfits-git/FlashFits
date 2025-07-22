import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import ShopCardsHome from '../HomeComponents/ShopCardsHome'
import { useNavigation } from '@react-navigation/native';
import {getMerchants} from '../../app/api/merchatApis/getMerchantHome'

const { width } = Dimensions.get('window');

const categoryData = {
  All: ['Zudio', 'Max', 'H&M', 'Levi\'s', 'Nike', 'Puma'],
  Men: ['Jack & Jones', 'Levi\'s', 'H&M', 'Puma', 'Roadster', 'U.S. Polo Assn.'],
  Women: ['Zara', 'ONLY', 'Biba', 'Global Desi', 'Levi\'s', 'H&M'],
  Kids: ['Hopscotch', 'FirstCry', 'Carter\'s', 'Babyhug', 'Zara Kids', 'Gini & Jony'],
};

const categories = Object.keys(categoryData);


const CategorySwitcher = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
    const [merchantData, setMerchnatData] = useState()
  
    const navigation = useNavigation();

      useEffect(() => {
          const getMerchantsData = async () => {
              try {
                const res = await getMerchants()
                setMerchnatData(res)
              } catch (error) {
              console.error('Error fetching products:', error);
              }
          }
        getMerchantsData()
        // setLoading(false)
      }, [])
    
  return (
    <View style={styles.container}> 
      {/* Main Category Tabs */}
      <View style={styles.topTabs}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.tabButton,
              selectedCategory === cat && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selectedCategory === cat && styles.activeTabText,
              ]}
            >
              {cat}
            </Text>
            {selectedCategory === cat && <View style={styles.underline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Subcategory Scrollable View */}
<FlatList
  data={
    merchantData?.merchants?.filter(
      (merchant) => merchant.category?.toLowerCase() === selectedCategory.toLowerCase()
    ) || []
  }
  keyExtractor={(item) => item._id}
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.subCategoryList}
  renderItem={({ item, index }) => (
    <ShopCardsHome
      title={item.shopName}
      index={index}
      merchantId={item._id}
      shopData={item}
    />
  )}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // paddingTop: 16,
  },
topTabs: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  paddingVertical: 8,
},

tabButton: {
  flex: 1, // 👈 Equally divides screen
  alignItems: 'center',
  paddingVertical: 12, // 👈 More touch area
},

tabText: {
  fontSize: 16,
  color: '#888',
    fontFamily: 'Montserrat',
},

activeTabText: {
  color: '#333',
  fontWeight: 'bold',
},

underline: {
  height: 3,
  backgroundColor: '#333',
  width: '100%',
  marginTop: 4,
  borderRadius: 2,
},
  subCategoryList: {
    paddingVertical: 6,
    paddingLeft: 10,
    // borderRadius:2
  },
  subCategoryItem: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 10,
    elevation: 2,
  },
  subCategoryText: {
    color: '#333',
    fontSize: 14,
  },
});

export default CategorySwitcher;
