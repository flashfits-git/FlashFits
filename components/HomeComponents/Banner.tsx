// components/Banner.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import * as Font from 'expo-font';


export default function Banner() {

  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>🔥 FREE TRY & BUY FOR FIRST ORDER! 🔥</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  bannerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Oswald-Regular',
    letterSpacing:1
  },
});
