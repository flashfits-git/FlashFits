import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from "../../../assets/theme/Colors";

const OrderCompletionScreen = ({ orderData }: { orderData: any }) => {
  const router = useRouter();

  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'returned':
      case 'otp-verified-return':
        return Colors.red || '#ef4444';
      case 'kept':
      case 'completed':
      case 'delivered':
        return Colors.accent || '#00F5A0';
      default: return Colors.secondary || '#6b7280';
    }
  };

  if (!orderData) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Ionicons name="checkmark-circle" color={Colors.accent} size={80} />
          </View>
        </View>
        <Text style={styles.title}>Order Completed</Text>
        <Text style={styles.subtitle}>
          {orderData.orderStatus === 'otp-verified-return'
            ? 'Your return has been processed successfully'
            : 'Thank you for shopping with FlashFits'}
        </Text>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* Order Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="receipt-outline" size={20} color={Colors.black} />
            <Text style={styles.cardTitle}>Order Summary</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.value}>#{orderData._id?.slice(-8).toUpperCase()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{formatDate(orderData.createdAt)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Text style={styles.label}>Status</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(orderData.orderStatus) + '15' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(orderData.orderStatus) === Colors.accent ? '#00A86B' : getStatusColor(orderData.orderStatus) }]}>
                {(orderData.orderStatus || 'Completed').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Items Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cube-outline" size={20} color={Colors.black} />
            <Text style={styles.cardTitle}>Items ({orderData.items?.length || 0})</Text>
          </View>

          {orderData.items?.map((item: any, index: number) => (
            <View key={item._id || index}>
              {index > 0 && <View style={styles.divider} />}
              <View style={styles.itemRow}>
                <View style={styles.itemImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <View style={styles.itemMeta}>
                    <Text style={styles.itemSize}>Size: {item.size}</Text>
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                  </View>
                  <View style={[styles.itemStatusBadge, { backgroundColor: getStatusColor(item.tryStatus) + '15' }]}>
                    <Text style={[styles.itemStatusText, { color: getStatusColor(item.tryStatus) === Colors.accent ? '#00A86B' : getStatusColor(item.tryStatus) }]}>
                      {(item.tryStatus || 'Delivered').toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Address Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location-outline" size={20} color={Colors.black} />
            <Text style={styles.cardTitle}>Delivery Details</Text>
          </View>
          <Text style={styles.addressName}>{orderData.deliveryLocation?.name}</Text>
          <Text style={styles.addressText} numberOfLines={2}>
            {orderData.deliveryLocation?.addressLine1}, {orderData.deliveryLocation?.area}
          </Text>
          <Text style={styles.addressText}>
            {orderData.deliveryLocation?.city}, {orderData.deliveryLocation?.pincode}
          </Text>
        </View>

        {/* Billing Summary */}
        <View style={[styles.card, styles.billingCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="wallet-outline" size={20} color={Colors.black} />
            <Text style={styles.cardTitle}>Payment Details</Text>
          </View>

          <View style={styles.billingRow}>
            <Text style={styles.billingLabel}>Items Total</Text>
            <Text style={styles.billingValue}>₹{orderData.finalBilling?.baseAmount || 0}</Text>
          </View>

          <View style={styles.billingRow}>
            <Text style={styles.billingLabel}>Delivery Fee</Text>
            <Text style={styles.billingValue}>₹{orderData?.deliveryCharge || 0}</Text>
          </View>

          {orderData.finalBilling?.discount > 0 && (
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Discount</Text>
              <Text style={[styles.billingValue, { color: Colors.green }]}>-₹{orderData.finalBilling.discount}</Text>
            </View>
          )}

          <View style={styles.billingDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount Paid</Text>
            <Text style={styles.totalValue}>₹{orderData.finalBilling?.totalPayable || orderData.finalAmount || 0}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.primaryButtonText}>Continue Shopping</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.7}
            onPress={() => router.replace('/(profile)/orders')}
          >
            <Text style={styles.secondaryButtonText}>Order History</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === "android" ? 60 : 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#00F5A010',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Manrope-ExtraBold',
    color: Colors.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Manrope-Medium',
    color: Colors.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.surface,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: Colors.black,
    marginLeft: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Manrope-Medium',
    color: Colors.secondary,
  },
  value: {
    fontSize: 14,
    fontFamily: 'Manrope-Bold',
    color: Colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Manrope-ExtraBold',
  },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
  },
  itemImageContainer: {
    width: 60,
    height: 75,
    borderRadius: 12,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Manrope-Bold',
    color: Colors.black,
    marginBottom: 6,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemSize: {
    fontSize: 12,
    fontFamily: 'Manrope-Medium',
    color: Colors.secondary,
  },
  itemPrice: {
    fontSize: 13,
    fontFamily: 'Manrope-Bold',
    color: Colors.black,
  },
  itemStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  itemStatusText: {
    fontSize: 10,
    fontFamily: 'Manrope-Bold',
  },
  addressName: {
    fontSize: 15,
    fontFamily: 'Manrope-Bold',
    color: Colors.black,
    marginBottom: 6,
  },
  addressText: {
    fontSize: 13,
    fontFamily: 'Manrope-Medium',
    color: Colors.secondary,
    lineHeight: 18,
  },
  billingCard: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  billingLabel: {
    fontSize: 14,
    fontFamily: 'Manrope-Medium',
    color: 'rgba(255,255,255,0.6)',
  },
  billingValue: {
    fontSize: 14,
    fontFamily: 'Manrope-Bold',
    color: Colors.white,
  },
  billingDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: Colors.white,
  },
  totalValue: {
    fontSize: 22,
    fontFamily: 'Manrope-ExtraBold',
    color: Colors.accent,
  },
  actions: {
    marginTop: 32,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: Colors.black,
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.black,
  },
  secondaryButtonText: {
    color: Colors.black,
    fontSize: 15,
    fontFamily: 'Manrope-Bold',
  },
  // Re-style card headers for dark mode
  billingHeader: {
    fontFamily: 'Manrope-Bold',
    color: Colors.white,
  }
});

// Update the billing card header style in the TSX to use a specific color
// I'll adjust the styles locally since I can't overwrite the previous styles object easily here without repeating it all.

export default OrderCompletionScreen;