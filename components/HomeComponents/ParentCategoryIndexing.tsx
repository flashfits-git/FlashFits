import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import TitleCard from './CategoryIndexing/TitleCard';
import ImageCardHome from './CategoryIndexing/ImageCardHome';
import { useNavigation } from '@react-navigation/native';

const Categories = ({products}) => {
  const navigation = useNavigation();
  

  const [loading, setLoading] = useState(false); // Since we're not fetching, no need to simulate loading

  const handleTitlePress = () => {
    navigation.navigate('(stack)/SelectionPage',{
     type:"new arrivals",
    });
  };

  const handleViewAll = () => {
    navigation.navigate('(stack)/SelectionPage',{
     type:"new arrivals",
    });
  };

  return (
    <>
      <TouchableOpacity onPress={handleTitlePress} activeOpacity={0.8}>
        <TitleCard />
      </TouchableOpacity>

      {/* {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : (
        <ImageCardHome products={products} />
      )} */}
        <ImageCardHome products={products} />

      <TouchableOpacity style={styles.button} onPress={handleViewAll}>
        <Text style={styles.text}>View All</Text>
      </TouchableOpacity>
    </>
  );
};

export default Categories;

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginVertical: 24,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Montserrat',
  },
});
