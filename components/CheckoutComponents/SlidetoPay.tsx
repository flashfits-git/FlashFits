import React, { useRef } from "react";
import { View, Text, Animated, PanResponder } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

// Make sure styles and maxSlide are defined/imported elsewhere in your file

const maxSlide = 250; // Example value, set as needed

const SlideToPay = ({ label, onComplete }: { label: string; onComplete: () => void }) => {
  const slideAnimation = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0 && gestureState.dx <= maxSlide) {
          slideAnimation.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx >= maxSlide * 0.7) {
          Animated.timing(slideAnimation, {
            toValue: maxSlide,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onComplete();
            slideAnimation.setValue(0);
          });
        } else {
          Animated.timing(slideAnimation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Only render if label matches
  if (label === 'tryandby') {
    return (
      <View style={styles.slideToPayContainer}>
        <LinearGradient
          colors={['#20c269f4', '#66e49fd8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.slideTrack}
        >
          {/* "Try and Buy" specific UI */}
          <Animated.View
            style={[styles.slideThumb, { transform: [{ translateX: slideAnimation }] }]}
            {...panResponder.panHandlers}
          >
            <View style={styles.slideArrows}>
              <Ionicons name="chevron-forward" size={18} color="#F00" />
              <Ionicons name="chevron-forward" size={18} color="#F00" />
            </View>
          </Animated.View>
          <Text style={styles.slideText}>{label}</Text>
        </LinearGradient>
      </View>
    );
  }

  if (label === 'prepaid') {
    return (
      <View style={styles.slideToPayContainer}>
        <LinearGradient
          colors={['#20c269f4', '#66e49fd8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.slideTrack}
        >
          {/* "Prepaid" specific UI */}
          <Animated.View
            style={[styles.slideThumb, { transform: [{ translateX: slideAnimation }] }]}
            {...panResponder.panHandlers}
          >
            <View style={styles.slideArrows}>
              <Ionicons name="chevron-forward" size={18} color="#00F" />
              <Ionicons name="chevron-forward" size={18} color="#00F" />
            </View>
          </Animated.View>
          <Text style={styles.slideText}>{label}</Text>
        </LinearGradient>
      </View>
    );
  }

  // Optionally, render nothing or something else if label doesn't match
  return null;
};

export default SlideToPay;
