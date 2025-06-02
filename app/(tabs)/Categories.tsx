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

  const products = {
    mens: [
      { id: 'p1', title: 'Mens Jeans', image: require('../../assets/images/3.jpg') },
      { id: 'p2', title: 'Mens Shirt', image: require('../../assets/images/3.jpg') },
      { id: 'p3', title: 'Mens Jacket', image: require('../../assets/images/3.jpg') },
      { id: 'p4', title: 'Mens Hoodie', image: require('../../assets/images/3.jpg') },
      { id: 'p5', title: 'Mens Suit', image: require('../../assets/images/3.jpg') },
      { id: 'p6', title: 'Mens Shorts', image: require('../../assets/images/3.jpg') },
    ],
    womens: [
      { id: 'p7', title: 'Womens Dress', image: require('../../assets/images/3.jpg') },
    ],
    boys: [
      { id: 'p8', title: 'Boys T-Shirt', image: require('../../assets/images/3.jpg') },
    ],
    girls: [
      { id: 'p9', title: 'Girls Frock', image: require('../../assets/images/3.jpg') },
    ],
    baby: [
      { id: 'p10', title: 'Baby Clothes', image: require('../../assets/images/3.jpg') },
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
              onPress={() => setSelectedMainCategory(cat.id)}
            >
              <Image source={cat.image} style={styles.mainCategoryImage} />
              <Text style={styles.mainCategoryText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products Only */}
      <View style={styles.productsOnlyContainer}>
        <FlatList
          data={products[selectedMainCategory] || []}
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
    </>
  );
};

const styles = StyleSheet.create({
  categoryBarContainer: {
    height: 110,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingTop: 10,
    elevation: 3,
    zIndex: 10,
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
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily:'Montserrat'
  },
  productsOnlyContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 8,
    paddingTop: 12,
  },
  productCard: {
    flex: 1,
    margin: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    height: 150,
    overflow: 'hidden',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  productImage: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  productTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
    lineHeight: 16,
    textTransform: 'capitalize',
        fontFamily:'Montserrat'
  
  },
});

export default Categories;
