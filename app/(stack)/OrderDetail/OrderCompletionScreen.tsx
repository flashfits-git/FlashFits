import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { CheckCircle, Package, MapPin, Clock } from "lucide-react-native";
import { useRouter } from 'expo-router';


const OrderCompletionScreen = ({ orderData }: { orderData: any }) => {

  const router = useRouter();

  console.log(orderData, 'orderDataorderDatao777777777777rderDataorderDataorderData');


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'returned': return '#ef4444';
      case 'kept': return '#10b981';
      default: return '#6b7280';
    }
  };

  // const returnedItems = orderData.items.filter(item => item.tryStatus === 'returned');
  // const keptItems = orderData.items.filter(item => item.tryStatus === 'kept');

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <CheckCircle color="#10b981" size={64} strokeWidth={2} />
        </View>
        <Text style={styles.title}>Order Completed</Text>
        <Text style={styles.subtitle}>
          {orderData.orderStatus === 'returned'
            ? 'All items have been returned'
            : 'Thank you for your order'}
        </Text>
      </View>

      {/* Order Info Card */}
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Text style={styles.label}>Order ID</Text>
          <Text style={styles.value}>#{orderData._id.slice(-8).toUpperCase()}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.cardRow}>
          <Text style={styles.label}>Order Date</Text>
          <Text style={styles.value}>{formatDate(orderData.createdAt)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.cardRow}>
          <Text style={styles.label}>Status</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(orderData.orderStatus) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(orderData.orderStatus) }]}>
              {orderData.orderStatus.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Trial Phase Info */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Clock color="#6366f1" size={20} />
          <Text style={styles.cardTitle}>Trial Phase</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.label}>Started</Text>
          <Text style={styles.value}>{formatDate(orderData.trialPhaseStart)}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.label}>Ended</Text>
          <Text style={styles.value}>{formatDate(orderData.trialPhaseEnd)}</Text>
        </View>
      </View>

      {/* Items Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Package color="#6366f1" size={20} />
          <Text style={styles.cardTitle}>Items ({orderData.items.length})</Text>
        </View>

        {orderData.items.map((item, index) => (
          <View key={item._id}>
            {index > 0 && <View style={styles.divider} />}
            <View style={styles.itemRow}>
              <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemSize}>Size: {item.size}</Text>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
                <View style={[styles.itemStatusBadge, { backgroundColor: getStatusColor(item.tryStatus) + '20' }]}>
                  <Text style={[styles.itemStatusText, { color: getStatusColor(item.tryStatus) }]}>
                    {item.tryStatus.toUpperCase()}
                  </Text>
                </View>
                {item.returnReason && (
                  <Text style={styles.returnReason}>Reason: {item.returnReason}</Text>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Delivery Address */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MapPin color="#6366f1" size={20} />
          <Text style={styles.cardTitle}>Delivery Address</Text>
        </View>
        <Text style={styles.addressName}>{orderData.deliveryLocation.name}</Text>
        <Text style={styles.addressText}>
          {orderData.deliveryLocation.addressLine1}, {orderData.deliveryLocation.addressLine2}
        </Text>
        <Text style={styles.addressText}>
          {orderData.deliveryLocation.area}, {orderData.deliveryLocation.city}
        </Text>
        <Text style={styles.addressText}>
          {orderData.deliveryLocation.state} - {orderData.deliveryLocation.pincode}
        </Text>
      </View>

      {/* Billing Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Billing Summary</Text>
        <View style={styles.cardRow}>
          <Text style={styles.label}>Base Amount</Text>
          <Text style={styles.value}>₹{orderData.finalBilling.baseAmount}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Bag Total</Text>
          <Text style={styles.summaryValue}>₹{orderData?.totalAmount || 0}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Charge</Text>
          <Text style={styles.summaryValue}>₹{orderData?.deliveryCharge || 0}</Text>
        </View>

        {orderData?.returnCharge > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Return Charge (Upfront)</Text>
            <Text style={styles.summaryValue}>₹{orderData?.returnCharge}</Text>
          </View>
        )}

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Paid</Text>
          <Text style={styles.totalAmount}>₹{orderData?.finalAmount || 0}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.label}>Discount</Text>
          <Text style={[styles.value, { color: '#10b981' }]}>-₹{orderData.finalBilling.discount}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.cardRow}>
          <Text style={styles.totalLabel}>Total Payable</Text>
          <Text style={styles.totalValue}>₹{orderData.finalBilling.totalPayable}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.primaryButtonText}>Continue Shopping</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace('/(profile)/orders')}>
        <Text style={styles.secondaryButtonText}>View Order History</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 44,
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  itemSize: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  itemStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  returnReason: {
    fontSize: 12,
    color: '#ef4444',
    fontStyle: 'italic',
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  secondaryButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderCompletionScreen;