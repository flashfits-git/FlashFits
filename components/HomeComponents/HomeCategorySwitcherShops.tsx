// components/HomeComponents/HomeCategorySwitcherShops.tsx
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Category, fetchCategories } from '../../app/api/categories';
import { getMerchants } from '../../app/api/merchatApis/getMerchantHome';
import { useGender } from '../../app/GenderContext';

import Carousel from '../HomeComponents/Carousel';
import ShopGridHome from '../HomeComponents/ShopGridHome';

const CATEGORIES: ('All' | 'Men' | 'Women' | 'Kids')[] = ['All', 'Men', 'Women', 'Kids'];

// Map UI gender labels to backend enum values
const GENDER_MAP: Record<string, string> = { Men: 'MEN', Women: 'WOMEN', Kids: 'KIDS' };

const CategorySwitcherShops = () => {
  const { selectedGender, setSelectedGender } = useGender();
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
      const rawGender = merchant.genderCategory;
      const genders: string[] = Array.isArray(rawGender)
        ? rawGender.map((g: any) => String(g).toUpperCase())
        : [String(rawGender || '').toUpperCase()];

      // Always push to All
      map.All.push(merchant);

      if (genders.includes('MEN')) map.Men.push(merchant);
      if (genders.includes('WOMEN')) map.Women.push(merchant);
      if (genders.includes('KIDS')) map.Kids.push(merchant);
    });

    return map;
  }, [merchantData]);

  const filteredMerchants = useMemo(() => {
    return categoryMap[selectedGender] || [];
  }, [categoryMap, selectedGender]);

  const carouselBanners = useMemo(() => {
    const backendGender = GENDER_MAP[selectedGender];

    // Filter categories whose allowedGenders includes selected gender
    let targetCategories: Category[] = [];

    if (selectedGender === 'All') {
      // Show banners from all categories
      targetCategories = categories;
    } else {
      targetCategories = categories.filter(c =>
        (c.allowedGenders || []).includes(backendGender)
      );
    }

    const urls: string[] = [];
    targetCategories.forEach(c => {
      if (c.title_banners && Array.isArray(c.title_banners)) {
        c.title_banners.forEach((b: any) => {
          if (b.url && b.url.trim() !== '') urls.push(b.url);
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
  // container: {  },
  topTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // marginBottom: 5,
  },
  tabButton: { paddingVertical: 8, paddingHorizontal: 12 },
  tabText: { fontSize: 16, color: '#666' },
  activeTabText: { color: '#000', fontWeight: 'bold' },
  underline: { height: 2, backgroundColor: '#000', marginTop: 4 },
  subCategoryList: { paddingHorizontal: 16 },
});

export default CategorySwitcherShops;