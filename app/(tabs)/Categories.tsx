import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import CategoryTitleBar from '../../components/CategoryPageComponents/CategoryTitleBar';
import { useNavigation } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';

const Categories = () => {
  const [selectedMainCategory, setSelectedMainCategory] = useState('mens');
  const [selectedSideCategory, setSelectedSideCategory] = useState('1');
  const navigation = useNavigation();
  const scrollOffset = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  useEffect(() => {
    const listener = scrollOffset.addListener(({ value }) => {
      const clampedValue = Math.max(0, value);

      if (clampedValue < currentOffset.current - 5) {
        setIsTabBarVisible(true);
        navigation.setOptions({
          tabBarStyle: {
            position: 'absolute',
            height: Platform.OS === 'ios' ? 70 : 70,
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5,
            paddingTop: Platform.OS === 'ios' ? 18 : 10,
          },
        });
      } else if (clampedValue > currentOffset.current + 5 && clampedValue > 3) {
        setIsTabBarVisible(false);
        navigation.setOptions({
          tabBarStyle: { display: 'none' },
        });
      }
      currentOffset.current = clampedValue;
    });

    return () => {
      scrollOffset.removeListener(listener);
    };
  }, []);

  const mainCategories = [
    { id: 'mens', name: 'MENS', image: require('../../assets/images/3.jpg') },
    { id: 'womens', name: 'WOMENS', image: require('../../assets/images/3.jpg') },
    { id: 'boys', name: 'BOYS', image: require('../../assets/images/3.jpg') },
    { id: 'girls', name: 'GIRLS', image: require('../../assets/images/3.jpg') },
    { id: 'baby', name: 'BABY', image: require('../../assets/images/3.jpg') },
  ];

  const sideCategories = {
    mens: [
      { id: '1', name: 'Casual Wear' },
      { id: '2', name: 'Formal Wear' },
      { id: '3', name: 'Shoes' },
      { id: '4', name: 'Accessories' },
    ],
    womens: [
      { id: '5', name: 'Dresses' },
      { id: '6', name: 'Handbags' },
      { id: '7', name: 'Jewelry' },
      { id: '8', name: 'Shoes' },
    ],
    boys: [
      { id: '9', name: 'T-Shirts' },
      { id: '10', name: 'Shorts' },
    ],
    girls: [
      { id: '11', name: 'Frocks' },
      { id: '12', name: 'Skirts' },
    ],
    baby: [
      { id: '13', name: 'Baby Clothes' },
      { id: '14', name: 'Toys' },
    ],
  };

  const products = {
    '1': [
      {
        id: 'p1',
        title: 'Jeans',
        image: require('../../assets/images/3.jpg'),
      },
      {
        id: 'p2',
        title: 'Jeans',
        image: require('../../assets/images/3.jpg'),
      },
    ],
    '2': [
      {
        id: 'p3',
        title: 'Jeans',
        image: require('../../assets/images/3.jpg'),
      },
    ],
    '5': [
      {
        id: 'p4',
        title: 'Jeans',
        image: require('../../assets/images/3.jpg'),
      },
    ],
    '9': [
      {
        id: 'p5',
        title: 'Jeans',
        image: require('../../assets/images/3.jpg'),
      },
    ],
  };

  return (
    <>
      <CategoryTitleBar />

      {/* Main Categories Bar */}
      <View style={styles.categoryBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {mainCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.mainCategoryButton,
                selectedMainCategory === cat.id && { borderColor: '#bbdcff' },
              ]}
              onPress={() => {
                setSelectedMainCategory(cat.id);
                const firstSideCat = sideCategories[cat.id]?.[0];
                if (firstSideCat) setSelectedSideCategory(firstSideCat.id);
              }}
            >
              <Image source={cat.image} style={styles.mainCategoryImage} />
              <Text style={styles.mainCategoryText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sidebar + Products */}
      <View style={styles.container}>
        {/* Sidebar */}
        <ScrollView style={styles.sidebar} contentContainerStyle={{ alignItems: 'center' }}>
          <View style={{ width: '100%', padding: 3 }}>
            {(sideCategories[selectedMainCategory] || []).map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.sideCategoryButton,
                  selectedSideCategory === cat.id && {
                    backgroundColor: '#e8f8ff',
                    borderRadius: 10,
                  },
                ]}
                onPress={() => setSelectedSideCategory(cat.id)}
              >
                <Text style={styles.sideCategoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Products */}
<View style={styles.productsContainer}>
  <FlatList
    data={products[selectedSideCategory] || []}
    keyExtractor={(item) => item.id}
    numColumns={2}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('(stack)/SelectionPage')}
      >
        <Image source={item.image} style={styles.productImage} />
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
    )}
    showsVerticalScrollIndicator={false}
  />
</View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 3,
    flexDirection: 'row',
  },
  sidebar: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sideCategoryButton: {
    width: '100%',
    height: 60,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  sideCategoryText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'left',
    width: '100%',
  },
  productsContainer: {
    flex: 2.3,
    backgroundColor: '#fff',
  },
  productCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 2, // 👈 Updated padding
    position: 'relative',
    alignItems: 'center', // 👈 Ensure image is centered
    justifyContent: 'center',
    overflow: 'hidden', // 👈 Ensures image corners stay inside card
  },
  productImage: {
    width: '100%',
    height: 140,
    resizeMode: 'contain',
    borderRadius: 20, // 👈 Rounded corners
    paddingLeft:6,
    paddingRight:6
  },
  categoryBarContainer: {
    height: 110,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingTop: 10,
    elevation: 3,
    zIndex: 10,
  },
productTitle: {
  fontSize: 13,
  fontWeight: '600',
  color: '#1a1a1a',
  textAlign: 'center',
  marginBottom: 10,
  paddingHorizontal: 6,
  lineHeight: 18,
  textTransform: 'capitalize',
},
  categoryScrollContent: {
    alignItems: 'center',
  },
  mainCategoryButton: {
    alignItems: 'center',
    marginRight: 30,
    borderBottomWidth: 2,
    borderColor: 'transparent',
    paddingBottom: 5,
  },
  mainCategoryImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginBottom: 5,
    resizeMode: 'cover',
  },
  mainCategoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
});


export default Categories;
