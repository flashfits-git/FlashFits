import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import HearderForProfileComponents from '../../components/ProfilePageComponents/HearderForProfileComponents'

const OrdersScreen = () => {
    const router = useRouter();
  const { title } = useLocalSearchParams<{ title: string }>();

  return (<>
 <HearderForProfileComponents title={title}/>
    <ScrollView style={styles.container}>
      {/* Header */}
      

      {/* Order Card */}
      <View style={styles.orderCard}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order ID #6315120</Text>
          <Text style={styles.orderDetails}>26 Apr • 1 Item • COD</Text>
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalText}>TOTAL ₹1624</Text>
          <TouchableOpacity>
            <Text style={styles.viewBreakup}>View Breakup</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productSection}>
          <Image
            source={{ uri: '../../assets/images/1.jpg' }} // Replace this URL with your actual image
            style={styles.productImage}
          />
          <View style={styles.productInfo}>
            <Text style={styles.inTransit}>In Transit</Text>
            <Text style={styles.productTitle}>Dark Green Sequins Off Shoulder Mini Dress</Text>
            <Text style={styles.productDetails}>Size: XS | Qty: 1 | ₹1699</Text>
            <Text style={styles.deliveryText}>Delivery by: 02 May - 03 May</Text>
          </View>
        </View>
      </View>
    </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)')}>
              <Text style={styles.buttonText}>Home</Text>
            </TouchableOpacity>
          </View>

          
    </>
  );
};

export default OrdersScreen;

// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  helpText: {
    fontSize: 16,
    color: '#00AA00',
  },
  orderCard: {
    backgroundColor: '#E6F4EA',
    borderRadius: 12,
    padding: 16,
  },
  orderInfo: {
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewBreakup: {
    fontSize: 14,
    color: '#007BFF',
  },
  productSection: {
    flexDirection: 'row',
    marginTop: 10,
  },
  productImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  inTransit: {
    color: '#28A745',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  deliveryText: {
    fontSize: 14,
    color: '#888',
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
