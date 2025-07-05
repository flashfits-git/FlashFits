import React, { useRef, useEffect, useState } from 'react';
import { View, FlatList, Image, Dimensions, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

const images = [
  require('../../assets/images/carousal/poster1.jpg'),
  require('../../assets/images/carousal/poster2.jpg'),
  require('../../assets/images/dvv.jpg'),
  require('../../assets/images/45g.jpg'),
];

const Carousel = () => {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (index + 1) % images.length;
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
      setIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [index]);

  const handleScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    setIndex(newIndex);
  };

  return (
    <View style={{ height: height * 0.15 }}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Image
            source={item}
            style={{ width: width, height: height * 0.8, resizeMode: 'cover' }}
          />
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

export default Carousel;