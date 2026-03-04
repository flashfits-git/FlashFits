import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const PopupCart = ({ isTabBarVisible }: { isTabBarVisible?: boolean }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.cartContainer,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.contentWrapper}>
        <View style={styles.cartBox}>
          <Image
            source={{ uri: '' }}
            style={styles.itemImage}
          />
          <View style={styles.details}>
            <Text style={styles.itemText}>1 Item | ₹127</Text>
            <Text style={styles.saveText}>You save ₹20</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/(stack)/OrderDetail/OrderTrackingPage')

            }
          >
            <Text style={styles.buttonText}>Track Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30, // fixed position from bottom
    paddingHorizontal: 16,
    // zIndex: 100,
    margin: 30,
  },
  cartBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#0F0F0F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  contentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 150,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#F2F2F2',
  },
  details: {
    flex: 4,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F0F0F',
    marginBottom: 4,
    width: 100,
    fontFamily: 'Manrope-Bold',
  },
  saveText: {
    fontSize: 9,
    color: '#00F5A0',
    fontWeight: '700',
    fontFamily: 'Manrope-Bold',
  },
  button: {
    backgroundColor: '#0F0F0F',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    fontFamily: 'Manrope-Bold',
  },
});

export default PopupCart;
