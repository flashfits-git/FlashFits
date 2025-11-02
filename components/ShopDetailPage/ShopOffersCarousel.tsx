import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface ShopOfferCardProps {
  image: any;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const ShopOfferCard = ({ image, title, subtitle, onPress }: ShopOfferCardProps) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <ImageBackground source={image} style={styles.image} imageStyle={styles.imageStyle}>
        <View style={styles.overlay}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
            <Text style={styles.detailsText}>Details</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const offers = [
  {
    image: require('../../assets/images/3.jpg'),
    title: '25% Off at Trendy Threads',
    subtitle: 'Limited time on summer styles',
  },
  {
    image: require('../../assets/images/3.jpg'),
    title: 'Buy 1 Get 1 at Style Stop',
    subtitle: 'Best deals this week!',
  },
  {
    image: require('../../assets/images/3.jpg'),
    title: 'Exclusive Offer at Fashion Hub',
    subtitle: 'Hurry! While stocks last!',
  },
];

const ShopOffersCarousel = () => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % offers.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000); // 3 seconds

    return () => clearInterval(timer); // cleanup
  }, [currentIndex]);

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={offers}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <ShopOfferCard
            image={item.image}
            title={item.title}
            subtitle={item.subtitle}
            onPress={() => console.log('Go to offer detail')}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 350,
    height: 180,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
    // marginRight:10
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 16,
  },
  overlay: {
    // backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 16,
  },
  title: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
        fontFamily: 'Montserrat',
  },
  subtitle: {
    color: '#000',
    fontSize: 13,
    marginBottom: 10,
    fontFamily: 'Oswald-Regular',
  },
  detailsButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  detailsText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    fontFamily: 'Montserrat',
  },
});

export default ShopOffersCarousel;
