import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import CardYouMaylike from '../DetailPageComponents/CardYouMaylike';
import { getProductsByMerchantId } from '../../app/api/merchatApis/getMerchantHome';

function YouMayLike({
  merchantId,
  shownProductId,
  subCategoryId,
  subSubCategoryId,
}) {
  const [allProducts, setAllProducts] = useState([]);

  // 🔑 normalize incoming IDs
  const subCatId =
    typeof subCategoryId === 'object'
      ? subCategoryId?._id
      : subCategoryId;

  const subSubCatId =
    typeof subSubCategoryId === 'object'
      ? subSubCategoryId?._id
      : subSubCategoryId;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByMerchantId(merchantId);
        setAllProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [merchantId]);

  // ❌ remove currently shown product
  const baseProducts = useMemo(() => {
    return allProducts.filter(p => p?._id !== shownProductId);
  }, [allProducts, shownProductId]);

  // 🔥 ROW 1 → Same subSubCategory
  const sameSubSubCategoryProducts = useMemo(() => {
    return baseProducts.filter(
      p => p?.subSubCategoryId?._id === subSubCatId
    );
  }, [baseProducts, subSubCatId]);

  // 🔥 ROW 2 → Same subCategory (excluding row 1)
  const sameSubCategoryProducts = useMemo(() => {
    const usedIds = new Set(
      sameSubSubCategoryProducts.map(p => p._id)
    );

    return baseProducts.filter(
      p =>
        p?.subCategoryId?._id === subCatId &&
        !usedIds.has(p._id)
    );
  }, [baseProducts, sameSubSubCategoryProducts, subCatId]);

  return (
    <View style={styles.container}>

      {sameSubSubCategoryProducts.length > 0 && (
        <>
          <Text style={styles.title}>Similar Fits You May Like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {sameSubSubCategoryProducts.map(item => (
              <View key={item._id} style={styles.cardWrapper}>
                <CardYouMaylike product={item} />
              </View>
            ))}
          </ScrollView>
        </>
      )}

      {sameSubCategoryProducts.length > 0 && (
        <>
          <Text style={styles.title}>More From This Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {sameSubCategoryProducts.map(item => (
              <View key={item._id} style={styles.cardWrapper}>
                <CardYouMaylike product={item} />
              </View>
            ))}
          </ScrollView>
        </>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  cardWrapper: {
    width: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 10,
    fontFamily: 'Montserrat',
  },
});

export default YouMayLike;
