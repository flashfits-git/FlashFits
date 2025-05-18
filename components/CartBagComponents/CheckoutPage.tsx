import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');


interface CartItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  originalPrice: number;
  discountedPrice: number;
  image: any;
  unit: string;
}

export default function Basket() {
  const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([
      {
        id: '1',
        name: 'Aashirvaad Superior MP Atta',
        description: '5 kg',
        quantity: 2,
        originalPrice: 710,
        discountedPrice: 640,
        image: "",
        unit: 'kg',
      },
      {
        id: '2',
        name: 'Klf Coconad 100% Pure Coconut Oil',
        description: '1 L',
        quantity: 1,
        originalPrice: 430,
        discountedPrice: 321,
        image: "",
        unit: 'L',
      },
      {
        id: '3',
        name: 'Potato (Kizhangu)',
        description: '1 kg',
        quantity: 2,
        originalPrice: 102,
        discountedPrice: 86,
        image: "",
        unit: 'kg',
      },
      {
        id: '4',
        name: 'Parachute Advansed Nourishing Cream (Virgin Coconut Oil)',
        description: '100 g',
        quantity: 1,
        originalPrice: 150,
        discountedPrice: 127,
        image: "",
        unit: 'g',
      },
      {
        id: '5',
        name: 'Parachute Advansed Baby Gentle Powder (Virgin Coconut Oil)',
        description: '200 g',
        quantity: 2,
        originalPrice: 300,
        discountedPrice: 254,
        image: "",
        unit: 'g',
      },
      {
        id: '6',
        name: "Mother's Recipe Ginger Garlic Paste",
        description: '200 g',
        quantity: 1,
        originalPrice: 50,
        discountedPrice: 42,
        image: "",
        unit: 'g',
      },
      {
        id: '7',
        name: 'Dabur Hommade Coconut Milk',
        description: '200 ml',
        quantity: 1,
        originalPrice: 85,
        discountedPrice: 76,
        image: "",
        unit: 'ml',
      },
    ]);
      const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.discountedPrice * item.quantity,
        0
      );
    
      // Calculate total savings
      const totalSavings = cartItems.reduce(
        (sum, item) => sum + (item.originalPrice - item.discountedPrice) * item.quantity,
        0
      );
    
      // Slide to pay animation
      const slideAnimation = new Animated.Value(0);
      const maxSlide = width * 0.7;
  
      const updateQuantity = (id: string, change: number) => {
        setCartItems(
          cartItems.map((item) => {
            if (item.id === id) {
              const newQuantity = item.quantity + change;
              return newQuantity > 0
                ? { ...item, quantity: newQuantity }
                : { ...item, quantity: 0 };
            }
            return item;
          })
        );
      };

  return (
        <ScrollView style={styles.container}>
        <View style={styles.deliveryInfoContainer}>
                   <View style={styles.deliveryInfo}>
                     <View>
                       <Text style={styles.deliveryLabel}>Delivery in</Text>
                       <Text style={styles.deliveryTime}>17 Mins</Text>
                     </View>
                     <View>
                       <Text style={styles.itemsCount}>10 items</Text>
                     </View>
                   </View>
                   </View>
        {/* Cart Items */}
        <View style={styles.cartList}>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image source={item.image} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                </View>
                <View style={styles.itemPriceContainer}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
                    <Text style={styles.discountedPrice}>₹{item.discountedPrice}</Text>
                  </View>
                  <View style={styles.quantityControl}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, -1)}
                    >
                      <Text style={styles.quantityButtonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
        </View>
        </ScrollView>
  ); 
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  deliveryInfoContainer: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 0,
    overflow: 'hidden',
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  deliveryLabel: {
    fontSize: 10,
    color: '#666',
  },
  deliveryTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  itemsCount: {
    fontSize: 14,
    color: '#666',
  },

  cartList: {
    marginHorizontal: 16,
    marginBottom: 0,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 0,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: '#000', // Placeholder
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 12,
    color: '#888',
  },
  itemPriceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },

  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },
  quantityButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#00A05E',
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 15,
    fontWeight: '500',
    paddingHorizontal: 12,
    color: '#00A05E',
  },

  paymentContainer: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  priceDetails: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: '#6b7280',
    fontSize: 14,
  },
  value: {
    color: '#000',
    fontSize: 14,
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  paymentButton: {
    backgroundColor: '#2E1065',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  paymentText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

