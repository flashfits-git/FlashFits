import { Image } from 'expo-image';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const images = [
  require('../../assets/images/carousal/poster1.jpg'),
  require('../../assets/images/carousal/poster2.jpg'),
  require('../../assets/images/carousal/poster3.jpg'),
  require('../../assets/images/carousal/poster4.jpg'),
];

const Carousel = () => {
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (index + 1) % images.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [index]);

  const handleScrollEnd = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    setIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image
              source={item}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          </View>
        )}
        onMomentumScrollEnd={handleScrollEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: height * 0.17, backgroundColor: '#000' },
  imageContainer: {
    width: width,
    height: height * 0.17,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default memo(Carousel);
