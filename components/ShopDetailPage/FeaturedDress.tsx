import { Image } from 'expo-image';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const CARD_HEIGHT = 140;

const plans = [
  {
    id: '1',
    title: 'Spring Season Sale',
    subtitle: 'Flat 50% Off',
    image: 'https://res.cloudinary.com/dpmliygpg/image/upload/v1752321239/merchant/logo/xdowa0ebeuigpipfok6b.jpg', // Placeholder
  },
  {
    id: '2',
    title: 'New Collections',
    subtitle: 'Zudio Originals',
    image: 'https://res.cloudinary.com/dpmliygpg/image/upload/v1752321239/merchant/logo/xdowa0ebeuigpipfok6b.jpg', // Placeholder
  },
];

const FeaturedDress = () => {
  return (
    <View style={{ marginVertical: 12 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 12, paddingRight: 4 }}
      >
        {plans.map((plan) => (
          <TouchableOpacity key={plan.id} style={styles.card} activeOpacity={0.9}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{plan.title}</Text>
              <Text style={styles.collectionSubtitle}>{plan.subtitle}</Text>
              <View style={styles.exploreButton}>
                <Text style={styles.exploreButtonText}>Explore  →</Text>
              </View>
            </View>
            <Image source={{ uri: plan.image }} style={styles.cardImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 16,
    fontFamily: 'Montserrat',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    marginRight: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  textContainer: {
    flex: 1.2,
    padding: 18,
    justifyContent: 'center',
  },
  title: {
    color: '#1c1c1c',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
  },
  collectionSubtitle: {
    color: '#666',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
  exploreButton: {
    marginTop: 12,
  },
  exploreButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 13,
  },
  cardImage: {
    flex: 1,
    height: '100%',
    width: 100,
    backgroundColor: '#eee',
  },
});

export default FeaturedDress;
