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
  // const [currentMottoIndex, setCurrentMottoIndex] = useState(0);
  // const fadeAnim = useRef(new Animated.Value(1)).current;

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // Fade out
  //     Animated.timing(fadeAnim, {
  //       toValue: 0,
  //       duration: 500,
  //       useNativeDriver: true,
  //     }).start(() => {
  //       // Change motto after fade out
  //       setCurrentMottoIndex((prevIndex) => (prevIndex + 1) % mottos.length);

  //       // Fade in
  //       Animated.timing(fadeAnim, {
  //         toValue: 1,
  //         duration: 500,
  //         useNativeDriver: true,
  //       }).start();
  //     });
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <View style={styles.footer}>
      <Text style={styles.logo}>FlashFits -</Text>  
      <Text style={styles.motto}>Fashion in a Flash!</Text>  

      {/* <Animated.Text style={[styles.motto, { opacity: fadeAnim }]}>
        {mottos[currentMottoIndex]}
      </Animated.Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: 50,
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
    fontStyle: 'italic',
  },
  motto: {
    fontSize: 14,
    color: '#444',
    fontStyle: 'italic',
    flexShrink: 1,
  },
});

export default Footer;
