import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const captions = [
  '🔥 FREE TRY & BUY FOR FIRST ORDERS! 🔥',
  '🚚 GET IT TODAY. TRY IT TODAY!',
  '👕 TRY BEFORE YOU BUY — NO PRESSURE!',
  '🛍️ LOVE IT OR LEAVE IT — EASY RETURNS!',
  '💃 FAST FASHION, FASTER TRYOUTS!',
  '🆓 FIRST TRY-ON ALWAYS FREE!',
  '⚡ INSTANT STYLE, ZERO RISK!',
  '🛒 TRY FAST. BUY SMART. FLASHFITS.'
];

export default function Banner() {
  const [index, setIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    const animate = (direction) => {
      slideAnim.setValue(direction === 'left' ? -width : width);

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    };

    // Animate first slide (from left)
    animate('left');

    const interval = setInterval(() => {
      const nextIndex = (indexRef.current + 1) % captions.length;
      const direction = nextIndex % 2 === 0 ? 'left' : 'right';

      setIndex(nextIndex);
      animate(direction);

      indexRef.current = nextIndex;
    }, 3500);

    const indexRef = { current: 0 };
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.banner}>
      <Animated.View style={[styles.animatedContainer, { transform: [{ translateX: slideAnim }] }]}>
        <Text style={styles.bannerText}>{captions[index]}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    paddingHorizontal: 10,
  },
  animatedContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
  bannerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'Oswald-Regular',
    textAlign: 'center',
  },
});
