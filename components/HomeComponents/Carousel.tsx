import { Image } from 'expo-image';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const images = [
  require('../../assets/images/carousal/poster1.jpg'),
  require('../../assets/images/carousal/poster2.jpg'),
  require('../../assets/images/carousal/poster3.jpg'),
  require('../../assets/images/carousal/poster4.jpg'),
];

type CarouselProps = {
  banners?: string[];
};

const Carousel = ({ banners }: CarouselProps) => {
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);

  const displayImages = useMemo(() => {
    if (banners && banners.length > 0) {
      return banners.map(url => ({ uri: url }));
    }
    return images;
  }, [banners]);

  useEffect(() => {
    if (!displayImages || displayImages.length === 0) return;
    const interval = setInterval(() => {
      let nextIndex = (index + 1) % displayImages.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [index, displayImages]);

  const handleScrollEnd = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    setIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={displayImages}
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
      {/* Dot indicators */}
      {displayImages.length > 1 && (
        <View style={styles.dotsContainer}>
          {displayImages.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.activeDot]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: height * 0.17, backgroundColor: '#000' },
  imageContainer: {
    width: width,
    height: height * 0.20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 16,
    borderRadius: 3,
  },
});

export default memo(Carousel);
