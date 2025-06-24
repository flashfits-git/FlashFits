import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Card from '../HomeComponents/Card';
import { useNavigation } from 'expo-router'; // or useNavigation from '@react-navigation/native'

function YouMayLike({ products = [] }) {
  const navigation = useNavigation();

  // const handlePress = (item) => {
  //   console.log('Navigating to product:', item.name); // 🔥 LOG the product name
  //   navigation.navigate('(stack)/ProductDetail/productdetailpage', {
  //     item: JSON.stringify(item),
  //   });
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You May Also Like</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products.map((item, index) => (
          <View key={index} style={styles.cardWrapper}  onPress={() => handlePress(item)}>
            <Card
              product={item}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Montserrat',
  },
  cardWrapper: {
    marginRight: 12,
    width: 200,
  },
});

export default YouMayLike;
