import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HearderForProfileComponents from "../../components/ProfilePageComponents/HearderForProfileComponents";
import { listenOrderUpdates, removeOrderListeners } from "../sockets/order.socket";
import { getSocket } from "../config/socket";
import { getAllOrders } from "../api/orderApis";

const OrdersScreen = () => {
  const router = useRouter();
  const { title } = useLocalSearchParams<{ title: string }>();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();
      console.log(res);
      
      if (res) {
        setOrders(res);
        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  // Listen for socket updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      console.log("Socket not connected");
      return;
    }

    console.log("🟢 Listening for order updates...");
    listenOrderUpdates((updateData) => {
      console.log("📦 Order update received:", updateData);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === updateData.orderId
            ? { ...o, orderStatus: updateData.newStatus }
            : o
        )
      );
    });

    return () => {
      console.log("🔴 Removing order update listener");
      removeOrderListeners();
    };
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    const statusColors = {
      placed: "#FF9800",
      confirmed: "#2196F3",
      preparing: "#9C27B0",
      ready: "#4CAF50",
      picked: "#00BCD4",
      delivered: "#4CAF50",
      cancelled: "#F44336",
    };
    return statusColors[status?.toLowerCase()] || "#666";
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      placed: "receipt-outline",
      confirmed: "checkmark-circle-outline",
      preparing: "restaurant-outline",
      ready: "cube-outline",
      picked: "bicycle-outline",
      delivered: "checkmark-done-circle",
      cancelled: "close-circle-outline",
    };
    return statusIcons[status?.toLowerCase()] || "information-circle-outline";
  };

  const getPaymentStatusBadge = (status) => {
    return status === "pending" ? (
      <View style={styles.paymentBadge}>
        <Ionicons name="time-outline" size={12} color="#FF9800" />
        <Text style={[styles.paymentText, { color: "#FF9800" }]}>Pending</Text>
      </View>
    ) : (
      <View style={[styles.paymentBadge, { backgroundColor: "#E8F5E9" }]}>
        <Ionicons name="checkmark-circle" size={12} color="#4CAF50" />
        <Text style={[styles.paymentText, { color: "#4CAF50" }]}>Paid</Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="receipt-outline" size={80} color="#E0E0E0" />
      </View>
      <Text style={styles.emptyTitle}>No Orders Yet</Text>
      <Text style={styles.emptySubtitle}>
        Your order history will appear here once you make your first purchase
      </Text>
      <TouchableOpacity
        style={styles.shopNowButton}
        onPress={() => router.push("/(tabs)")}
      >
        <Text style={styles.shopNowText}>Start Shopping</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <HearderForProfileComponents title={title || "My Orders"} />
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      ) : orders.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.orderCount}>
              {orders.length} {orders.length === 1 ? "Order" : "Orders"}
            </Text>

            {orders.map((order, index) => (
              <TouchableOpacity
                key={order._id}
                style={[
                  styles.orderCard,
                  { 
                    borderLeftColor: getStatusColor(order.orderStatus),
                    borderLeftWidth: 4,
                  }
                ]}
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: '/(stack)/OrderDetail/OrderTrackingPage',
                    params: { orderId: order._id },
                  })
                }
              >
                {/* Header Section */}
                <View style={styles.orderHeader}>
                  <View style={styles.orderIdSection}>
                    <Ionicons name="receipt" size={18} color="#666" />
                    <Text style={styles.orderId} numberOfLines={1}>
                      #OrderId_{order._id.slice(-5).toUpperCase()}
                    </Text>
                  </View>
                  {getPaymentStatusBadge(order.paymentStatus)}
                </View>

                {/* Date & Items Info */}
                <View style={styles.orderMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={14} color="#999" />
                    <Text style={styles.metaText}>
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                  <View style={styles.metaDivider} />
                  <View style={styles.metaItem}>
                    <Ionicons name="cube-outline" size={14} color="#999" />
                    <Text style={styles.metaText}>
                      {order.items?.length || 0} {order.items?.length === 1 ? "Item" : "Items"}
                    </Text>
                  </View>
                </View>

                {/* Items Preview */}
                {order.items && order.items.length > 0 && (
                  <View style={styles.itemsPreview}>
                    {order.items.slice(0, 3).map((item, idx) => (
                      <View key={idx} style={styles.itemDot} />
                    ))}
                    {order.items.length > 3 && (
                      <Text style={styles.moreItems}>
                        +{order.items.length - 3} more
                      </Text>
                    )}
                  </View>
                )}

                {/* Status & Price Section */}
                <View style={styles.orderFooter}>
                  <View style={styles.statusContainer}>
                    <Ionicons
                      name={getStatusIcon(order.orderStatus)}
                      size={20}
                      color={getStatusColor(order.orderStatus)}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(order.orderStatus) },
                      ]}
                    >
                      {order.orderStatus?.charAt(0).toUpperCase() +
                        order.orderStatus?.slice(1)}
                    </Text>
                  </View>

                  <View style={styles.priceContainer}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalAmount}>
                      ₹{order.finalBilling?.totalPayable || order.totalAmount}
                    </Text>
                  </View>
                </View>

                {/* Delivery Info */}
                {order.deliveryCharge > 0 && (
                  <View style={styles.deliveryInfo}>
                    <Ionicons name="bicycle" size={14} color="#666" />
                    <Text style={styles.deliveryText}>
                      Delivery: ₹{order.deliveryCharge}
                    </Text>
                  </View>
                )}

                {/* Track Order Arrow */}
                <View style={styles.trackArrow}>
                  <Text style={styles.trackText}>Track Order</Text>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </View>
              </TouchableOpacity>
            ))}

            <View style={styles.bottomSpacing} />
          </Animated.View>
        </ScrollView>
      )}
    </View>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  orderCount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 12,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderIdSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  orderId: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: 0.5,
  },
  paymentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paymentText: {
    fontSize: 11,
    fontWeight: "600",
  },
  orderMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: "#666",
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DDD",
    marginHorizontal: 10,
  },
  itemsPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },
  itemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#BBB",
  },
  moreItems: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "700",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  totalLabel: {
    fontSize: 11,
    color: "#999",
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  deliveryText: {
    fontSize: 12,
    color: "#666",
  },
  trackArrow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 10,
  },
  trackText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
  },
  shopNowButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#000",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 25,
  },
  shopNowText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 20,
  },
});