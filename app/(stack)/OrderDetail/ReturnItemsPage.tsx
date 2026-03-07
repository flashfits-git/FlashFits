import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../../assets/theme/Colors";
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

type Item = {
    _id: string;
    name: string;
    image?: string;
    size?: string;
    price: number;
    quantity: number;
};

export default function ReturnItemsPage() {
    const { items, otp, orderId, orderData } = useLocalSearchParams();
    const parsedOrderData = orderData
        ? (typeof orderData === 'string' ? JSON.parse(orderData) : orderData)
        : null;
    const returnItems = items
        ? (typeof items === 'string' ? JSON.parse(items) : items)
        : [];
    const [showCompletion, setShowCompletion] = useState(false);
    const [completedOrder, setCompletedOrder] = useState<OrderData | null>(null);

    useEffect(() => {
        let socketRef;

        const initListener = async () => {
            socketRef = await listenOrderUpdates((data) => {
                const orderStatus = data?.orderStatus;

                if (orderStatus === "otp-verified-return") {
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

    const renderItem = ({ item }: { item: Item }) => (
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
                <Ionicons name="checkmark-circle" size={24} color={Colors.accent} />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.black} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={28} color={Colors.white} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.heading}>Return Order</Text>
                    <Text style={styles.orderId}>Order #{orderId || "RET123456"}</Text>
                </View>
            </View>

            <View style={styles.content}>
                {/* OTP Card */}
                <View style={styles.otpCard}>
                    <LinearGradient
                        colors={[Colors.dark2, Colors.dark1]}
                        style={styles.otpGradient}
                    >
                        <View style={styles.otpHeader}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="shield-checkmark" size={20} color={Colors.accent} />
                            </View>
                            <Text style={styles.otpLabel}>Verification Code</Text>
                        </View>
                        <View style={styles.otpDisplay}>
                            <Text style={styles.otp}>{otp || "1234"}</Text>
                        </View>
                        <View style={styles.otpSubtextRow}>
                            <Ionicons name="information-circle-outline" size={14} color={Colors.secondary} />
                            <Text style={styles.otpSubtext}>
                                Share this code with the delivery partner
                            </Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Instructions */}
                <View style={styles.instructionsCard}>
                    <View style={styles.instructionHeader}>
                        <Ionicons name="flash" size={18} color={Colors.accent} />
                        <Text style={styles.instructionTitle}>Handover Instructions</Text>
                    </View>
                    <View style={styles.instructionContent}>
                        <Text style={styles.instructionText}>• Ensure all items are properly packaged</Text>
                        <Text style={styles.instructionText}>• Share the OTP before handing over</Text>
                        <Text style={styles.instructionText}>• Keep items ready for pickup</Text>
                    </View>
                </View>

                {/* Items Section */}
                <View style={styles.itemsSection}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <Text style={styles.sectionTitle}>Items to Return</Text>
                            <View style={styles.itemCount}>
                                <Text style={styles.itemCountText}>{returnItems.length}</Text>
                            </View>
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
                <View style={styles.secondaryActions}>
                    <TouchableOpacity style={styles.iconAction}>
                        <View style={styles.iconCircleSmall}>
                            <Ionicons name="call" size={18} color={Colors.white} />
                        </View>
                        <Text style={styles.iconBtnText}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconAction}>
                        <View style={styles.iconCircleSmall}>
                            <Ionicons name="chatbubbles" size={18} color={Colors.white} />
                        </View>
                        <Text style={styles.iconBtnText}>Support</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.handoverBtn}
                    onPress={handleHandover}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={[Colors.accent, '#00d18b']}
                        style={styles.handoverGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.handoverText}>Complete Handover</Text>
                        <Ionicons name="arrow-forward" size={18} color={Colors.black} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        backgroundColor: Colors.black,
        paddingHorizontal: 20,
        paddingVertical: 24,
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        marginRight: 16,
        marginLeft: -8,
    },
    headerContent: {
        flex: 1,
    },
    heading: {
        fontSize: 24,
        fontFamily: "Manrope-Bold",
        color: Colors.white,
    },
    orderId: {
        fontSize: 13,
        fontFamily: "Manrope-Medium",
        color: Colors.secondary,
        marginTop: 2,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    otpCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 8,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    otpGradient: {
        padding: 24,
    },
    otpHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 245, 160, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    otpLabel: {
        fontSize: 14,
        color: Colors.white,
        fontFamily: "Manrope-SemiBold",
    },
    otpDisplay: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        paddingVertical: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 16,
    },
    otp: {
        fontSize: 42,
        fontFamily: "Manrope-ExtraBold",
        letterSpacing: 10,
        color: Colors.accent,
    },
    otpSubtextRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    otpSubtext: {
        fontSize: 12,
        fontFamily: "Manrope-Medium",
        color: Colors.secondary,
        marginLeft: 6,
    },
    instructionsCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    instructionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    instructionTitle: {
        fontSize: 15,
        fontFamily: "Manrope-Bold",
        color: Colors.black,
        marginLeft: 10,
    },
    instructionContent: {
        gap: 6,
    },
    instructionText: {
        fontSize: 13,
        fontFamily: "Manrope-Medium",
        color: Colors.secondary,
        lineHeight: 20,
    },
    itemsSection: {
        flex: 1,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitleRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: "Manrope-Bold",
        color: Colors.black,
    },
    itemCount: {
        backgroundColor: Colors.black,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    itemCountText: {
        fontSize: 12,
        color: Colors.white,
        fontFamily: "Manrope-Bold",
    },
    listContent: {
        paddingBottom: 120,
    },
    card: {
        flexDirection: "row",
        padding: 16,
        borderRadius: 16,
        backgroundColor: Colors.white,
        marginBottom: 14,
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.surface,
        elevation: 2,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    imageContainer: {
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: Colors.surface,
    },
    image: {
        width: 64,
        height: 80,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 16,
    },
    name: {
        fontSize: 15,
        fontFamily: "Manrope-Bold",
        color: Colors.black,
        marginBottom: 6,
    },
    metaRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 8,
    },
    badge: {
        backgroundColor: Colors.surface,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 11,
        fontFamily: "Manrope-SemiBold",
        color: Colors.secondary,
    },
    price: {
        fontSize: 16,
        fontFamily: "Manrope-Bold",
        color: Colors.black,
    },
    checkIcon: {
        marginLeft: 12,
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 34,
        flexDirection: "row",
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderColor: Colors.surface,
        gap: 20,
    },
    secondaryActions: {
        flexDirection: 'row',
        gap: 16,
    },
    iconAction: {
        alignItems: 'center',
    },
    iconCircleSmall: {
        backgroundColor: Colors.black,
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    iconBtnText: {
        color: Colors.secondary,
        fontSize: 10,
        fontFamily: "Manrope-SemiBold",
        marginTop: 6,
    },
    handoverBtn: {
        flex: 1,
        borderRadius: 16,
        overflow: "hidden",
        elevation: 4,
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    handoverGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 18,
        gap: 10,
    },
    handoverText: {
        color: Colors.black,
        fontSize: 16,
        fontFamily: "Manrope-ExtraBold",
    },
});