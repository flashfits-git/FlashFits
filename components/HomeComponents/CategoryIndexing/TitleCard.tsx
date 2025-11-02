// components/TitleCard.js
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function TitleCard() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/3.jpg')} // adjust the path as per your project
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6, // for Android
  },
  image: {
    width: '100%',
    height: 350, // You can adjust this depending on your layout
  },
});
