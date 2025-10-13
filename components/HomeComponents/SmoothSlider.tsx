import React, { useCallback, useRef, useState, useEffect } from 'react';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { View, Text, StyleSheet } from 'react-native';

// Debounce helper
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  const debounced = useCallback(
    (...args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debounced;
};

export default function SmoothSlider({ initialValues = [0, 5000], onChange }) {
  // ✅ Force the default to [0, 10000] even if prop is missing or empty
  const [sliderValues, setSliderValues] = useState(
    Array.isArray(initialValues) && initialValues.length === 2
      ? initialValues
      : [0, 10000]
  );

  // Sync parent changes (but fallback always to [0, 10000])
  useEffect(() => {
    setSliderValues(
      Array.isArray(initialValues) && initialValues.length === 2
        ? initialValues
        : [0, 10000]
    );
  }, [initialValues]);

  const debouncedOnChange = useDebounce(onChange, 250);

  const handleChange = (values) => {
    // Clamp values between 0–10000
    const clamped = [
      Math.max(0, Math.min(values[0], 10000)),
      Math.max(0, Math.min(values[1], 10000)),
    ];
    setSliderValues(clamped);
    debouncedOnChange(clamped);
  };

  return (
    <View style={styles.sliderWrapper}>
      <MultiSlider
        values={sliderValues}
        min={0}
        max={10000}
        step={100}
        sliderLength={300}
        onValuesChange={handleChange}
        allowOverlap={false}
        snapped
        enableLabel={false}
        selectedStyle={{ backgroundColor: '#000' }}
        unselectedStyle={{ backgroundColor: '#ddd' }}
        markerStyle={{
          backgroundColor: '#000',
          height: 22,
          width: 22,
          borderRadius: 12,
          elevation: 3,
        }}
        pressedMarkerStyle={{
          transform: [{ scale: 1.2 }],
        }}
      />

      <Text style={styles.priceLabel}>
        ₹{sliderValues[0]} - ₹{sliderValues[1]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderWrapper: {
    alignItems: 'center',
    marginVertical: 10,
  },
  priceLabel: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
