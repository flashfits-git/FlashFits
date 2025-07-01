import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import Logo from '../../assets/loaders/logo.png';

function Loader() {
  const lineWidth = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(20)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    Barrio: require('../../assets/fonts/Barrio-Regular.ttf'),
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(lineWidth, {
        toValue: 300,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }, 1000);

    const taglineTimeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(taglineTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(taglineOpacity, {
          toValue: .7,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1500);

    return () => {
      clearTimeout(timeout);
      clearTimeout(taglineTimeout);
    };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.loadingContainer}>


      <Image source={Logo} style={styles.logo} resizeMode="contain" />

      <Animated.View style={[styles.lineContainer, { width: lineWidth }]}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', 'black', 'rgba(0,0,0,0.4)', 'transparent']}
          style={styles.line}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>

      <Animated.Text
        style={[
          styles.tagline,
          {
            transform: [{ translateY: taglineTranslateY }],
            opacity: taglineOpacity,
          },
        ]}
      >
        Fashion in a Flash !
      </Animated.Text>


    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingBottom: 60,
  },
  logo: {
    width: 250,
    height: 100,
  },
  tagline: {
    fontSize: 20,
    color: 'black',
    fontWeight: '400',
    marginTop: 20,
    letterSpacing: 1,
    fontFamily: 'Barrio',
    // opacity:.5
  },
  lineContainer: {
    height: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  line: {
    flex: 1,
    borderRadius: 1,
  },
});

export default Loader;
