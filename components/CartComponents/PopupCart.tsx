import React,{useRef, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';

const PopupCart = ({isTabBarVisible}) => {

    const animatedBottom = useRef(new Animated.Value(isTabBarVisible ? 90 : 30)).current;
    useEffect(() => {
        Animated.timing(animatedBottom, {
          toValue: isTabBarVisible ? 90 : 30,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }, [isTabBarVisible]);

  return (
    <Animated.View style={[
        styles.cartContainer,
        {
          bottom: animatedBottom // moves lower if tab bar hidden
        },
      ] }>
      <View style={styles.cartBox}>
        <Image
          source={{ uri: '' }} // Replace with real image
          style={styles.itemImage}
        />
        <View style={styles.details}>
          <Text style={styles.itemText}>1 Item | ₹127</Text>
          <Text style={styles.saveText}>You save ₹20</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Go to cart</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    position: 'absolute',
    bottom: 70, // Adjust based on your bottom bar height
    left: 10,
    right: 10,
    zIndex: 10,
    // transitionDelay: 'easy'
  },
  cartBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveText: {
    fontSize: 14,
    color: 'green',
  },
  button: {
    backgroundColor: '#00B14F',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default PopupCart;
