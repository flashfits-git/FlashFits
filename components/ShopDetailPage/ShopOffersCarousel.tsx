import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface ShopOfferCardProps {
  image: any;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const ShopOfferCard = ({ image, title, subtitle, onPress }: ShopOfferCardProps) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.9}>
      <LinearGradient
        colors={['#ffffff', '#f8f8f8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.offerTextContainer}>
          <View style={styles.offerBadge}>
            <Ionicons name="pricetag" size={12} color="#fff" />
            <Text style={styles.badgeText}>OFFER</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <ImageBackground source={image} style={styles.image} imageStyle={styles.imageStyle} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const offers = [
  {
    image: require('../../assets/images/3.jpg'),
    title: 'FLAT ₹175 OFF',
    subtitle: 'On orders above ₹1399',
    code: 'FLASH175',
  },
  {
    image: require('../../assets/images/3.jpg'),
    title: 'GET 20% OFF',
    subtitle: 'On all footwear',
    code: 'FITS20',
  },
  {
    image: require('../../assets/images/3.jpg'),
    title: 'FREE DELIVERY',
    subtitle: 'On your first order',
    code: 'FIRSTFREE',
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
    width: 280,
    height: 120,
    marginLeft: 16,
    marginRight: 4,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerTextContainer: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  offerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3c6be5',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
    marginBottom: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  image: {
    width: 100,
    height: '100%',
  },
  imageStyle: {
    opacity: 0.8,
  },
  title: {
    color: '#1c1c1c',
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 20,
  },
  subtitle: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});

export default ShopOffersCarousel;
