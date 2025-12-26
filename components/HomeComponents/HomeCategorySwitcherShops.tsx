// components/HomeComponents/HomeCategorySwitcherShops.tsx (or your file)
import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ShopCardsHome from '../HomeComponents/ShopCardsHome';
import { getMerchants } from '../../app/api/merchatApis/getMerchantHome';
import { normalizeCategory } from '../../app/utilities/categoryUtils';
import { useGender } from '../../app/GenderContext';

const CATEGORIES: ('All' | 'Men' | 'Women' | 'Kids')[] = ['All', 'Men', 'Women', 'Kids'];

const CategorySwitcherShops = () => {
  const { selectedGender, setSelectedGender } = useGender(); // Use context
  const [merchantData, setMerchantData] = React.useState<any[]>([]);
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

  const splitShops = useMemo(() => {
    const data = categoryMap[selectedGender] || [];
    const mid = Math.ceil(data.length / 2);

    return {
      firstRow: data.slice(0, mid),
      secondRow: data.slice(mid),
    };
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

      {/* Shops List */}
      {/* Row 1 */}
      <FlatList
        data={splitShops.firstRow}
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

      {/* Row 2 */}
      <FlatList
        data={splitShops.secondRow}
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