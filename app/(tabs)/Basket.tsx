import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import CartItem from '@/components/CartComponents/CartItem';


const cartData = [
  {
    id: '1',
    name: 'AUCTP Delta - Tees',
    size: 'Extra Large (XL)',
    price: 42.99,
    originalPrice: 59.99,
    quantity: 1,
  },
  {
    id: '2',
    name: 'Minimalist Cap',
    size: 'One Size',
    price: 19.99,
    originalPrice: 29.99,
    quantity: 2,
  }
];

export default function Basket() {
  const router = useRouter();
  const { name, price } = useLocalSearchParams();
  console.log(name, price);
  const routerr = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Icon name="chevron-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Basket</Text>
        </View>

        {/* Single Item Card */}
        <ScrollView style={styles.cartList}>
          {cartData.map((item) => (
            <CartItem
              key={item.id}
              name={item.name}
              size={item.size}
              price={item.price}
              originalPrice={item.originalPrice}
              quantity={item.quantity}
              imageUrl={item.imageUrl}
              onIncrease={() => console.log(`Increase ${item.id}`)}
              onDecrease={() => console.log(`Decrease ${item.id}`)}
              onRemove={() => console.log(`Remove ${item.id}`)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={{ flex: 1 }}>
      <View style={styles.paymentContainer}>
      <View style={styles.priceDetails}>
        <View style={styles.row}>
          <Text style={styles.label}>Shipping fee</Text>
          <Text style={styles.value}>$30</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Sub total</Text>
          <Text style={styles.value}>$730.00</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>$760.00</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.paymentButton}>
        <Text style={styles.paymentText} 
        // ffefferf/]
        >
          
          Payment</Text>
      </TouchableOpacity>
    </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  headerWrapper: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  cartList: {
    backgroundColor: 'transparent',
  },
  orderInfoWrapper: {
    padding: 20,
    gap: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#6b7280',
    fontSize: 14,
  },
  value: {
    color: '#1f2937',
    fontWeight: '500',
    fontSize: 14,
  },
  discount: {
    color: '#ef4444',
    fontSize: 14,
  },
  breakdownWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
    gap: 8,
  },
  totalWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
  },
  buttonWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  continueButton: {
    backgroundColor: '#2E4E40',
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentContainer: {
    position: 'bottom',
    bottom: 0,
    width: '100%',
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

// Order Info
// <View style={styles.orderInfoWrapper}>
//   <View style={styles.rowBetween}>
//     <Text style={styles.label}>Order Date</Text>
//     <Text style={styles.value}>Sep 18, 2023 | 10:00 AM</Text>
//   </View>
//   <View style={styles.rowBetween}>
//     <Text style={styles.label}>Promo Code</Text>
//     <Text style={styles.value}>FR1254HGQWE</Text>
//   </View>
//   <View style={styles.rowBetween}>
//     <Text style={styles.label}>Delivery Type</Text>
//     <Text style={styles.value}>Economy</Text>
//   </View>

//   {/* Price Breakdown */}
//   <View style={styles.breakdownWrapper}>
//     <View style={styles.rowBetween}>
//       <Text style={styles.label}>Amount</Text>
//       <Text style={styles.value}>$300.00</Text>
//     </View>
//     <View style={styles.rowBetween}>
//       <Text style={styles.label}>Delivery Charge</Text>
//       <Text style={styles.value}>$25.00</Text>
//     </View>
//     <View style={styles.rowBetween}>
//       <Text style={styles.label}>Tax</Text>
//       <Text style={styles.value}>$25.00</Text>
//     </View>
//     <View style={styles.rowBetween}>
//       <Text style={styles.label}>Discount</Text>
//       <Text style={styles.discount}>- $25.00</Text>
//     </View>
//   </View>

//   {/* Total */}
//   <View style={styles.totalWrapper}>
//     <Text style={styles.totalText}>Total</Text>
//     <Text style={styles.totalText}>$325</Text>
//   </View>
// </View>