import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


const { width, height } = Dimensions.get('window');

const TAB_BAR_HEIGHT = 70; // Assumed height of the hidden tab bar
const OFFSET_FROM_BAR = 90; // Position when tab bar is visible

const PopupCart = ({ isTabBarVisible }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(OFFSET_FROM_BAR)).current;
const router = useRouter()

  useEffect(() => {
    if (isTabBarVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 30, // Drop down to the tab bar's hidden position
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: OFFSET_FROM_BAR, // Sit above the tab bar
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isTabBarVisible]);

  return (
    <Animated.View
      style={[
        styles.cartContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
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
      <View style={styles.downArrow}>
      <Ionicons name="chevron-down-outline" size={16} color="black" />
      </View>
      <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/(stack)/ShoppingBag')}
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
    bottom: 30,
    paddingHorizontal: 16,
    zIndex: 20,
    margin:30,
  },
  cartBox: {
    backgroundColor: '#fff', // soft blue background
    borderRadius: 16,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    // width:4z00
  },
  contentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height:150
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#cfe0f4',
  },
  details: {
    flex: 4,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    width:100
  },
  saveText: {
    fontSize: 10,
    color: '#256D1B',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#008ab7', // blue button
    paddingVertical: 15,
    paddingHorizontal:25,
    borderRadius: 8,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  downArrow:{
    paddingEnd:20
  }
});

export default PopupCart;
