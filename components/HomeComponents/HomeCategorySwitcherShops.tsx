// components/HomeComponents/HomeCategorySwitcherShops.tsx (or your file)
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { fetchCategories, Category } from '../../app/api/categories';
import { getMerchants } from '../../app/api/merchatApis/getMerchantHome';
import { useGender } from '../../app/GenderContext';

import Carousel from '../HomeComponents/Carousel';
import ShopGridHome from '../HomeComponents/ShopGridHome';

const CATEGORIES: ('All' | 'Men' | 'Women' | 'Kids')[] = ['All', 'Men', 'Women', 'Kids'];

const CategorySwitcherShops = () => {
  const { selectedGender, setSelectedGender } = useGender(); // Use context
  const [merchantData, setMerchantData] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const res = await getMerchants();
        setMerchantData(res?.merchants || []);
      } catch (err) {
        console.error('Error fetching merchants:', err);
      } 
    };

    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        setCategories(res || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchMerchants();
    loadCategories();
  }, []);

  const categoryMap = useMemo(() => {
    const map: Record<string, any[]> = {
      All: [],
      Men: [],
      Women: [],
      Kids: [],
    };

    merchantData.forEach((merchant) => {
      const gender = (merchant.genderCategory || '').toLowerCase();

      // Always push to All
      map.All.push(merchant);

      // Men + Unisex → Men tab
      if (gender === 'men' || gender === 'unisex') map.Men.push(merchant);
      // Women + Unisex → Women tab
      if (gender === 'women' || gender === 'unisex') map.Women.push(merchant);
      // Kids only → Kids tab
      if (gender === 'kids') map.Kids.push(merchant);
    });

    return map;
  }, [merchantData]);

  const filteredMerchants = useMemo(() => {
    return categoryMap[selectedGender] || [];
  }, [categoryMap, selectedGender]);

  const carouselBanners = useMemo(() => {
    const level0 = categories.filter(c => c.level === 0);
    let targetCategories: Category[] = [];

    if (selectedGender === 'All') {
      targetCategories = level0.filter(c => {
        const name = c.name.toLowerCase();
        return name.includes('men') || name.includes('women') || name.includes('kids') || name.includes('unisex');
      });
    } else {
      const genderLower = selectedGender.toLowerCase();
      targetCategories = level0.filter(c => c.name.toLowerCase() === genderLower);
    }

    const urls: string[] = [];
    targetCategories.forEach(c => {
      if (c.title_banners && Array.isArray(c.title_banners)) {
        c.title_banners.forEach((b: any) => {
          if (b.url) urls.push(b.url);
        });
      }
    });

    return urls;
  }, [categories, selectedGender]);

  return (
    <View style={styles.container}>
      {/* Single Top Gender Tabs */}
      <View style={styles.topTabs}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedGender(cat)}
            style={styles.tabButton}
          >
            <Text
              style={[
                styles.tabText,
                selectedGender === cat && styles.activeTabText,
              ]}
            >
              {cat}
            </Text>
            {selectedGender === cat && <View style={styles.underline} />}
          </TouchableOpacity>
        ))}
      </View>
      <Carousel banners={carouselBanners} />

      {/* Shops Grid */}
      <ShopGridHome merchants={filteredMerchants} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 5 },
  topTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // paddingHorizontal: 20,
    marginBottom: 12,
  },
  tabButton: { paddingVertical: 8, paddingHorizontal: 12 },
  tabText: { fontSize: 16, color: '#666' },
  activeTabText: { color: '#000', fontWeight: 'bold' },
  underline: { height: 2, backgroundColor: '#000', marginTop: 4 },
  subCategoryList: { paddingHorizontal: 16 },
});

export default CategorySwitcherShops;