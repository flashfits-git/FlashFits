import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { listenOrderUpdates } from "../../sockets/order.socket";
import OrderCompletionScreen from "./OrderCompletionScreen";


type OrderData = {
    _id?: string;
    orderStatus?: string;
    estimatedTime?: string | number;
    customerDeliveryStatus?: string;
    otp?: string;
    items?: Item[];
    trialPhaseStart?: string | number | null;
    trialPhaseDuration?: number;
    deliveryRiderDetails?: {
        name?: string;
        phone?: string;
    };
    returnCharge?: number;
    [k: string]: any;
};

export default function ReturnItemsPage() {
    const { items, otp, orderId, orderData } = useLocalSearchParams();
    const parsedOrderData = orderData ? JSON.parse(orderData as string) : null;
    const returnItems = items ? JSON.parse(items as string) : [];
    const [showCompletion, setShowCompletion] = useState(false);
    const [completedOrder, setCompletedOrder] = useState<OrderData | null>(null);

    useEffect(() => {
        let socketRef;

        const initListener = async () => {
            socketRef = await listenOrderUpdates((data) => {
                console.log("📦 SOCKET343 UPDATE:", data);// ✅ ROOT _id
                const orderStatus = data?.orderStatus;        // ✅ ROOT orderStatus

                if (
                    orderStatus === "otp-verified-return"
                ) {
                    console.log("✅ otp-verified-return detected — redirecting");
                    setCompletedOrder(parsedOrderData);
                    setShowCompletion(true);
                }
            });
        };

        initListener();

        return () => {
            if (socketRef) {
                socketRef.off("orderUpdate");
                
            }
        };
    }, [orderId]);

    if (showCompletion && completedOrder) {
        return <OrderCompletionScreen orderData={completedOrder} />;
    }


    const handleHandover = () => {
        router.replace("/(tabs)");
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
            </View>

            <View style={styles.itemDetails}>
                <Text style={styles.name} numberOfLines={2}>
                    {item.name}
                </Text>
                <View style={styles.metaRow}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Size {item.size}</Text>
                    </View>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Qty {item.quantity}</Text>
                    </View>
                </View>
                <Text style={styles.price}>₹{item.price}</Text>
            </View>

            <View style={styles.checkIcon}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.heading}>Return Order</Text>
                    <Text style={styles.orderId}>Order #{orderId || "RET123456"}</Text>
                </View>
            </View>

            <View style={styles.content}>
                {/* OTP Card */}
                <View style={styles.otpCard}>
                    <View style={styles.otpHeader}>
                        <Ionicons name="shield-checkmark" size={24} color="#fff" />
                        <Text style={styles.otpLabel}>Verification Code</Text>
                    </View>
                    <View style={styles.otpDisplay}>
                        <Text style={styles.otp}>{otp || "1234"}</Text>
                    </View>
                    <Text style={styles.otpSubtext}>
                        Share this code with the delivery partner
                    </Text>
                </View>

                {/* Instructions */}
                <View style={styles.instructionsCard}>
                    <View style={styles.instructionHeader}>
                        <Ionicons name="information-circle" size={20} color="#FFB300" />
                        <Text style={styles.instructionTitle}>Handover Instructions</Text>
                    </View>
                    <Text style={styles.instructionText}>
                        • Ensure all items are properly packaged{"\n"}
                        • Share the OTP before handing over{"\n"}
                        • Keep items ready for pickup
                    </Text>
                </View>

                {/* Items Section */}
                <View style={styles.itemsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Items to Return</Text>
                        <View style={styles.itemCount}>
                            <Text style={styles.itemCountText}>
                                {returnItems.length} {returnItems.length === 1 ? "Item" : "Items"}
                            </Text>
                        </View>
                    </View>

                    <FlatList
                        data={returnItems}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                    />
                </View>
            </View>

            {/* Bottom Actions */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.iconBtn}>
                    <View style={styles.iconBtnInner}>
                        <Ionicons name="call" size={20} color="#fff" />
                    </View>
                    <Text style={styles.iconText}>Call Delivery</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconBtn}>
                    <View style={styles.iconBtnInner}>
                        <Ionicons name="headset" size={20} color="#fff" />
                    </View>
                    <Text style={styles.iconText}>Support</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.handoverBtn}
                    onPress={handleHandover}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={["#1a1a1a", "#000"]}
                        style={styles.handoverGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        <Text style={styles.handoverText}>Complete Handover</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        backgroundColor: "#000000be",
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#1a1a1a",
    },
    backButton: {
        padding: 8,
        marginRight: 12,
    },
    headerContent: {
        flex: 1,
    },
    heading: {
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
    },
    orderId: {
        fontSize: 12,
        color: "#888",
        marginTop: 2,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    otpCard: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#2a2a2a",
    },
    otpHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    otpLabel: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "600",
        marginLeft: 8,
    },
    otpDisplay: {
        backgroundColor: "#000000be",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#333",
    },
    otp: {
        fontSize: 32,
        fontWeight: "800",
        letterSpacing: 8,
        color: "#fff",
    },
    otpSubtext: {
        fontSize: 12,
        color: "#888",
        textAlign: "center",
        marginTop: 12,
    },
    instructionsCard: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#2a2a2a",
    },
    instructionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    instructionTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#fff",
        marginLeft: 8,
    },
    instructionText: {
        fontSize: 12,
        color: "#aaa",
        lineHeight: 18,
    },
    itemsSection: {
        flex: 1,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#fff",
    },
    itemCount: {
        backgroundColor: "#1a1a1a",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    itemCountText: {
        fontSize: 12,
        color: "#888",
        fontWeight: "600",
    },
    listContent: {
        paddingBottom: 140,
    },
    card: {
        flexDirection: "row",
        padding: 14,
        borderRadius: 14,
        backgroundColor: "#1a1a1a",
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#2a2a2a",
        alignItems: "center",
    },
    imageContainer: {
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#000000be",
        padding: 4,
    },
    image: {
        width: 70,
        height: 90,
        borderRadius: 8,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 14,
    },
    name: {
        fontSize: 14,
        fontWeight: "600",
        color: "#fff",
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 8,
    },
    badge: {
        backgroundColor: "#2a2a2a",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 11,
        color: "#aaa",
        fontWeight: "600",
    },
    price: {
        fontSize: 15,
        fontWeight: "700",
        color: "#4CAF50",
    },
    checkIcon: {
        marginLeft: 8,
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: 24,
        flexDirection: "row",
        gap: 10,
        backgroundColor: "#000",
        borderTopWidth: 1,
        borderColor: "#1a1a1a",
    },
    iconBtn: {
        alignItems: "center",
        justifyContent: "center",
    },
    iconBtnInner: {
        backgroundColor: "#1a1a1a",
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#2a2a2a",
    },
    iconText: {
        color: "#888",
        fontSize: 10,
        marginTop: 6,
        fontWeight: "600",
    },
    handoverBtn: {
        flex: 1,
        borderRadius: 12,
        overflow: "hidden",
    },
    handoverGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        gap: 8,
    },
    handoverText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
});