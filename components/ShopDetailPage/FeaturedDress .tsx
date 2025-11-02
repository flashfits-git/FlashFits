import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const CARD_HEIGHT = 140;
 
const plans = [
  {
    id: '1',
    title: 'Jeans Cargo Collection',
    subtitle: '5 week • 4x/week',
  },
  {
    id: '2',
    title: 'T-Shirts Acid Wash ',
    subtitle: '4 week • 3x/week',
  },
];

const FeaturedDress = () => {
  return (
    <View style={{ marginVertical: 12 }}>
      <Text style={styles.sectionTitle}>View All Collections</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 10, paddingRight: 4 }}
      >
        {plans.map((plan) => (
          <View key={plan.id} style={styles.card}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{plan.title}</Text>
              <View style={styles.subtitleRow}>
                {/* <Text style={styles.icon}>👁️</Text>
                <Text style={styles.subtitle}>{plan.subtitle}</Text> */}
              </View>
              <TouchableOpacity style={styles.exploreButton}>
                <Text style={styles.exploreButtonText}>Explore</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    backgroundColor: '#1e1e2f',
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  icon: {
    color: '#aaa',
    marginRight: 6,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 13,
  },
  exploreButton: {
    backgroundColor: '#f2f2ff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  exploreButtonText: {
    color: '#4a148c',
    fontWeight: 'bold',
    fontSize: 13,
  },
  cardImage: {
    width: 120,
    height: '100%',
    resizeMode: 'cover',
  },
});

export default FeaturedDress ;
