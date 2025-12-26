// components/HomeComponents/CategorySwitcher.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { fetchCategories } from '../../app/api/categories';
import { useGender } from '../../app/GenderContext';

type Category = {
  _id: string;
  name: string;
  parentId: string | null;
  level: number;
  image?: { url: string };
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.21;

const CategorySwitcher = () => {
  const router = useRouter();
  const { selectedGender } = useGender();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        setCategories(res || []);
      } catch (err) {
        console.error('Category fetch failed', err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Determine which sub-categories to show
  const subCategories = useMemo(() => {
    if (selectedGender === 'All') {
      // Show ALL level-1 categories when "All" is selected
      return categories.filter(c => c.level === 1);
    }

    // For specific gender: find the matching level-0 parent
    const level0Parents = categories.filter(c => c.level === 0);
    const matchingParent = level0Parents.find(parent => {
      const nameLower = parent.name.toLowerCase();
      const genderLower = selectedGender.toLowerCase();
      return nameLower.includes(genderLower) || nameLower.includes('unisex');
    });

    if (!matchingParent) {
      return [];
    }

    return categories.filter(
      c => c.level === 1 && c.parentId === matchingParent._id
    );
  }, [categories, selectedGender]);

  const handleViewAll = useCallback(
    (subCatName: string, subCategoryId: string, parentId?: string) => {
      let selectedParentId = parentId;

      if (selectedGender === 'All') {
        // Fallback to first level-0 parent when in "All" mode
        const firstParent = categories.find(c => c.level === 0);
        selectedParentId = firstParent?._id || null;
      }

      router.push({
        pathname: '(stack)/SelectionPage',
        params: {
          filterss: JSON.stringify({
            priceRange: [0, 10000],
            selectedCategoryIds: selectedParentId
              ? [selectedParentId, subCategoryId]
              : [subCategoryId],
          }),
          subCatName,
        },
      });
    },
    [router, categories, selectedGender]
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  // console.log(subCategories, 'subCategoriessubCategoriessubCategories');


  if (subCategories.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={subCategories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.horizontalList}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 12} // card width + marginRight
        snapToAlignment="start"
        renderItem={({ item }) => {
          const parent = categories.find(c => c._id === item.parentId);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleViewAll(item.name, item._id, parent?._id)} // Fixed: added ()
              activeOpacity={0.8}
            >
              <View style={styles.imageContainer}>
                {item.image?.url ? (
                  <Image
                    source={{ uri: item.image.url }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholderImage} />
                )}
                <View style={styles.gradientOverlay} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardText} numberOfLines={2}>
                  {item.name}
                </Text>
              </View>
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

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  horizontalList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.15,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    height: CARD_WIDTH * 0.75, // 👈 reduced image height
    position: 'relative',
  },
  cardImage: { width: '100%', height: '100%' },
  placeholderImage: { width: '100%', height: '100%', backgroundColor: '#ddd' },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  cardTextContainer: {
    padding: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  cardText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  emptyContainer: { padding: 20 },
  emptyText: { color: '#999' },
});

export default CategorySwitcher;