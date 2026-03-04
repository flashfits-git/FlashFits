// components/HomeComponents/HomeCategorySwitcherShops.tsx (or your file)
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getMerchants } from '../../app/api/merchatApis/getMerchantHome';
import { useGender } from '../../app/GenderContext';
import { normalizeCategory } from '../../app/utilities/categoryUtils';
import ShopGridHome from '../HomeComponents/ShopGridHome';

const CATEGORIES: ('All' | 'Men' | 'Women' | 'Kids')[] = ['All', 'Men', 'Women', 'Kids'];

const CategorySwitcherShops = () => {
  const { selectedGender, setSelectedGender } = useGender(); // Use context
  const [merchantData, setMerchantData] = React.useState<any[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const res = await getMerchants();
        // console.log(res,'3323w');

        setMerchantData(res?.merchants || []);
      } catch (err) {
        console.error('Error fetching merchants:', err);
      }
    };
    fetchMerchants();
  }, []);

  const categoryMap = useMemo(() => {
    const map: Record<string, any[]> = {
      All: [],
      Men: [],
      Women: [],
      Kids: [],
    };

    const seenInSpecific = new Set<string>(); // Track merchants already in Men/Women/Kids

    merchantData.forEach((merchant) => {
      const normalized = normalizeCategory(merchant.category);
      const id = merchant._id;

      // Always push to All - safe because it's separate
      map.All.push(merchant);

      // Only push to specific gender if it's not Unisex and matches
      if (normalized === 'Men' || normalized === 'Women' || normalized === 'Kids') {
        if (!seenInSpecific.has(id)) {
          map[normalized].push(merchant);
          seenInSpecific.add(id); // Prevent same merchant in multiple genders
        }
      }
      // Unisex stays only in All → perfect
    });

    return map;
  }, [merchantData]);

  const filteredMerchants = useMemo(() => {
    return categoryMap[selectedGender] || [];
  }, [categoryMap, selectedGender]);

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

      {/* Shops Grid */}
      <ShopGridHome merchants={filteredMerchants} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 16 },
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