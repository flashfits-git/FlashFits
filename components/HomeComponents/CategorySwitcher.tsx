// components/HomeComponents/CategorySwitcher.tsx
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { fetchCategories } from '../../app/api/categories';
import { useGender } from '../../app/GenderContext';

const { width } = Dimensions.get('window');

type Category = {
  _id: string;
  name: string;
  parentId: string | null;
  level: number;
  image?: { url: string };
  ancestors?: {
    parentName?: string;
    parentGender?: string;
    grandparentName?: string;
    grandparentGender?: string;
  };
};

const CATEGORY_IMAGES: Record<string, any> = {
  't-shirts': require('../../assets/images/1.jpg'),
  'shirts': require('../../assets/images/2.jpg'),
  'shoes': require('../../assets/images/3.jpg'),
  'jeans': require('../../assets/images/4.jpg'),
  'dresses': require('../../assets/images/premium_photo-1673384389447-5a4364e7c93b.avif'),
  'accessories': require('../../assets/images/premium_photo-1675186049409-f9f8f60ebb5e.avif'),
  'default': require('../../assets/images/shopshed.jpg'),
};

const getCategoryImage = (name: string) => {
  const key = name.toLowerCase().replace(/\s+/g, '-');
  return CATEGORY_IMAGES[key] || CATEGORY_IMAGES.default;
};

const CategorySwitcher = () => {
  const router = useRouter();
  const { selectedGender } = useGender();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        console.log(res, '332332323cwec');

        setCategories(res || []);
        // console.log(res);

      } catch (err) {
        console.error('Category fetch failed', err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const subCategories = useMemo(() => {
    if (selectedGender === 'All') return [];

    const level2 = categories.filter(c => c.level === 2);
    const genderLower = selectedGender.toLowerCase();

    return level2.filter(c => {
      const gpGender = (c.ancestors?.grandparentGender || '').toLowerCase();
      if (genderLower === 'kids') return gpGender === 'kids';
      return gpGender === genderLower || gpGender === 'unisex';
    });
  }, [categories, selectedGender]);

  const handleViewAll = useCallback(
    (item: Category) => {
      const subCatName = item.name;
      const subCategoryId = item._id;
      const parentId = item.parentId || undefined;
      let selectedParentId = parentId;

      if (selectedGender === 'All') {
        const firstParent = categories.find(c => c.level === 0);
        selectedParentId = firstParent?._id || undefined;
      }

      // Determine gender from ancestors
      const gender = item.level === 1
        ? item.ancestors?.parentName
        : item.level === 2
          ? item.ancestors?.grandparentName
          : undefined;

      router.push({
        pathname: '/(stack)/SelectionPage',
        params: {
          filterss: JSON.stringify({
            priceRange: [0, 10000],
            selectedCategoryIds: selectedParentId
              ? [selectedParentId, subCategoryId]
              : [subCategoryId],
          }),
          subCatName,
          gender: gender || selectedGender // fallback to context gender if ancestor not present
        },
      } as any);
      console.log(subCatName, subCategoryId, parentId, 'subCatName', gender);
    },
    [router, categories, selectedGender]
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="small" color="#1A1A1A" />
      </View>
    );
  }

  if (subCategories.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={subCategories}
        numColumns={4}
        keyExtractor={(item) => item._id}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContent}
        scrollEnabled={false}
        renderItem={({ item }) => {
          const parent = categories.find(c => c._id === item.parentId);
          const localImage = getCategoryImage(item.name);

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleViewAll(item)}
              activeOpacity={0.7}
            >
              <View style={styles.squareContainer}>
                <Image
                  source={item.image?.url ? { uri: item.image.url } : localImage}
                  style={styles.squareImage}
                  contentFit="cover"
                  transition={200}
                />
              </View>
              <Text style={styles.cardText} numberOfLines={2}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories available</Text>
          </View>
        }
      />
    </View>
  );
};

const ITEM_WIDTH = (width - 48) / 4;

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 12,
  },
  loader: { height: 100, justifyContent: 'center', alignItems: 'center' },
  gridContent: {
    paddingBottom: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    gap: 6,
  },
  squareContainer: {
    width: ITEM_WIDTH - 10,
    height: ITEM_WIDTH - 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    // Premium Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F8FAFC',
  },
  squareImage: {
    width: '100%',
    height: '100%',
  },
  cardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    fontFamily: 'Montserrat',
    textAlign: 'center',
    marginTop: 2,
  },
  emptyContainer: { padding: 20, alignItems: 'center' },
  emptyText: { color: '#94A3B8', fontSize: 13 },
});

export default memo(CategorySwitcher);