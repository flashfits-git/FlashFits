import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const mottos = [
  'Fashion in a Flash!',
  'Wear It Before You Buy It.',
  'Try it On. Keep What You Love.',
  'Try First. Decide Later.',
  'Try. Style. Return. Easy.',
  'No Fuss. Just Fashion.',
  'Try Fast. Dress Faster.',
  'Shop Today. Try Today.'
];

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.logo}>FlashFits -</Text>  
      <Text style={styles.motto}>Fashion in a Flash!</Text>  
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    opacity: 0.7,
    marginRight: 10,
    marginTop: 10,
    fontStyle: 'italic',
  },
  motto: {
    fontSize: 14,
    color: '#444',
    fontStyle: 'italic',
    flexShrink: 1,
    marginTop: 10,
  },
});

export default Footer;
