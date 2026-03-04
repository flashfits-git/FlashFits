import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getOrderById } from "../../api/orderApis";
import { getSocket } from "../../config/socket";
import {
    joinOrderRoom,
    listenOrderUpdates,
    removeOrderListeners,
} from "@/app/sockets/order.socket";
import OrderCompletionScreen from "./OrderCompletionScreen";

/**
 * ReturnItemsPage
 *
 * Shown after the customer completes item selection (keep/return) and pays.
 * Displays a summary of what was kept vs returned, shows the pickup OTP for
 * the rider's return journey, and listens for socket events to transition to
 * the completion screen once the merchant confirms the return.
 */
export default function ReturnItemsPage() {
    const params = useLocalSearchParams() as {
        orderId?: string;
        otp?: string;
        items?: string;
    };
    const orderId = String(params?.orderId ?? "");
    const router = useRouter();

    // Parse items from params (they are passed as JSON string)
    const [items, setItems] = useState<any[]>(() => {
        try {
            return params.items ? JSON.parse(params.items as string) : [];
        } catch {
            return [];
        }
    });

    const [orderData, setOrderData] = useState<any>(null);
    const [otp, setOtp] = useState<string>(String(params?.otp ?? ""));
    const [showCompletion, setShowCompletion] = useState(false);
    const [loading, setLoading] = useState(true);

    const keptItems = items.filter(
        (i) => i.tryStatus === "accepted" || i.tryStatus === "not-triable"
    );
    const returnedItems = items.filter((i) => i.tryStatus === "returned");

    // Fetch fresh order data on mount
    const fetchOrder = useCallback(async () => {
        if (!orderId) return;
        try {
            const res = await getOrderById(orderId);
            const data = res?.order ?? res;
            if (data) {
                setOrderData(data);
                if (data.otp) setOtp(String(data.otp));
                if (data.items?.length) setItems(data.items);
            }
        } catch (err) {
            console.warn("ReturnItemsPage: failed to fetch order", err);
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    // Listen for order completion via socket
    useEffect(() => {
        if (!orderId) return;

        const setup = async () => {
            await joinOrderRoom(orderId);

            listenOrderUpdates((update: any) => {
                const status = update?.orderStatus ?? update?.status;
                // When merchant confirms return via OTP → mark as done
                if (
                    status === "otp-verified-return" ||
                    status === "reached return merchant" ||
                    status === "completed"
                ) {
                    setShowCompletion(true);
                }
                // Update otp if refreshed
                if (update?.otp) setOtp(String(update.otp));
            });
        };

        setup();

        return () => {
            removeOrderListeners();
        };
    }, [orderId]);

    if (showCompletion) {
        return <OrderCompletionScreen orderData={orderData} />;
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.loadingText}>Loading order details…</Text>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Return Summary</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Status Banner */}
                <View style={styles.statusBanner}>
                    <Ionicons name="swap-horizontal" size={28} color="#f59e0b" />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.statusTitle}>Rider is on the way back to the store</Text>
                        <Text style={styles.statusSub}>
                            Your kept items are confirmed. The rider will return the rest.
                        </Text>
                    </View>
                </View>

                {/* OTP Card — for rider's return verification */}
                {otp ? (
                    <View style={styles.otpCard}>
                        <Text style={styles.otpLabel}>RETURN VERIFICATION OTP</Text>
                        <Text style={styles.otpValue}>{otp}</Text>
                        <Text style={styles.otpHint}>
                            Share this OTP with the rider when they return the items to the merchant.
                        </Text>
                    </View>
                ) : null}

                {/* Kept items */}
                {keptItems.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                            <Text style={[styles.sectionTitle, { color: "#10b981" }]}>
                                You Kept ({keptItems.length})
                            </Text>
                        </View>
                        {keptItems.map((item, i) => (
                            <ItemCard key={i} item={item} kept />
                        ))}
                    </View>
                )}

                {/* Returned items */}
                {returnedItems.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="return-down-back" size={20} color="#ef4444" />
                            <Text style={[styles.sectionTitle, { color: "#ef4444" }]}>
                                Returning ({returnedItems.length})
                            </Text>
                        </View>
                        {returnedItems.map((item, i) => (
                            <ItemCard key={i} item={item} kept={false} />
                        ))}
                    </View>
                )}

                {/* Billing summary */}
                {orderData?.finalBilling && (
                    <View style={styles.billingCard}>
                        <Text style={styles.billingTitle}>Final Billing Summary</Text>
                        <BillingRow label="Items Total" value={orderData.finalBilling.baseAmount} />
                        {orderData.finalBilling.gst > 0 && (
                            <BillingRow label="GST" value={orderData.finalBilling.gst} />
                        )}
                        {orderData.overtimePenalty > 0 && (
                            <BillingRow label="Overtime Charge" value={orderData.overtimePenalty} warn />
                        )}
                        {orderData.finalBilling.discount > 0 && (
                            <BillingRow label="Return Deduction" value={-orderData.finalBilling.discount} />
                        )}
                        <View style={styles.billingDivider} />
                        <BillingRow
                            label="Total Paid"
                            value={orderData.finalBilling.totalPayable}
                            bold
                        />
                    </View>
                )}

                {/* Waiting state */}
                <View style={styles.waitingCard}>
                    <ActivityIndicator color="#2563eb" />
                    <Text style={styles.waitingText}>
                        Waiting for merchant to confirm return…
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

/* ---- Sub-components ---- */

function ItemCard({ item, kept }: { item: any; kept: boolean }) {
    return (
        <View style={styles.itemCard}>
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.itemImage} />
            ) : (
                <View style={[styles.itemImage, styles.itemImagePlaceholder]}>
                    <Ionicons name="shirt-outline" size={22} color="#94a3b8" />
                </View>
            )}
            <View style={{ flex: 1 }}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemMeta}>Size: {item.size} · ₹{item.price}</Text>
                {!kept && item.returnReason ? (
                    <Text style={styles.returnReason}>{item.returnReason}</Text>
                ) : null}
            </View>
            <View style={[styles.badge, { backgroundColor: kept ? "#d1fae5" : "#fee2e2" }]}>
                <Text style={[styles.badgeText, { color: kept ? "#059669" : "#dc2626" }]}>
                    {kept ? "Kept" : "Return"}
                </Text>
            </View>
        </View>
    );
}

function BillingRow({
    label,
    value,
    bold,
    warn,
}: {
    label: string;
    value: number;
    bold?: boolean;
    warn?: boolean;
}) {
    const color = warn ? "#f59e0b" : value < 0 ? "#10b981" : "#1e293b";
    return (
        <View style={styles.billingRow}>
            <Text style={[styles.billingLabel, bold && styles.billingLabelBold]}>{label}</Text>
            <Text style={[styles.billingValue, { color }, bold && styles.billingValueBold]}>
                {value < 0 ? `−₹${Math.abs(value)}` : `₹${value}`}
            </Text>
        </View>
    );
}

/* ---- Styles ---- */

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#f8fafc" },
    loadingContainer: {
        flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc",
    },
    loadingText: { marginTop: 12, color: "#64748b", fontSize: 14 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 56,
        paddingBottom: 16,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
        gap: 12,
    },
    backBtn: {
        width: 36, height: 36, alignItems: "center", justifyContent: "center",
        borderRadius: 10, backgroundColor: "#f1f5f9",
    },
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
    content: { padding: 20, paddingBottom: 60 },

    // Status banner
    statusBanner: {
        flexDirection: "row", gap: 12, alignItems: "flex-start",
        backgroundColor: "#fffbeb", borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: "#fde68a", marginBottom: 16,
    },
    statusTitle: { fontSize: 14, fontWeight: "700", color: "#92400e" },
    statusSub: { fontSize: 13, color: "#b45309", marginTop: 3, lineHeight: 18 },

    // OTP card
    otpCard: {
        backgroundColor: "#fff", borderRadius: 16, padding: 20, alignItems: "center",
        marginBottom: 20, elevation: 2, shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 6,
        borderWidth: 1.5, borderColor: "#2563eb20",
    },
    otpLabel: { fontSize: 11, fontWeight: "700", color: "#94a3b8", letterSpacing: 1, marginBottom: 8 },
    otpValue: { fontSize: 44, fontWeight: "800", color: "#2563eb", letterSpacing: 12, marginBottom: 10 },
    otpHint: { fontSize: 12, color: "#64748b", textAlign: "center", lineHeight: 17 },

    // Sections
    section: { marginBottom: 20 },
    sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
    sectionTitle: { fontSize: 15, fontWeight: "700" },

    // Item card
    itemCard: {
        flexDirection: "row", alignItems: "center", gap: 12,
        backgroundColor: "#fff", borderRadius: 14, padding: 12, marginBottom: 8,
        elevation: 1, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4,
    },
    itemImage: { width: 52, height: 52, borderRadius: 10 },
    itemImagePlaceholder: {
        backgroundColor: "#f1f5f9", alignItems: "center", justifyContent: "center",
    },
    itemName: { fontSize: 14, fontWeight: "600", color: "#1e293b" },
    itemMeta: { fontSize: 12, color: "#64748b", marginTop: 2 },
    returnReason: { fontSize: 11, color: "#ef4444", marginTop: 2, fontStyle: "italic" },
    badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    badgeText: { fontSize: 12, fontWeight: "700" },

    // Billing
    billingCard: {
        backgroundColor: "#fff", borderRadius: 16, padding: 18, marginBottom: 16,
        elevation: 2, shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 6,
    },
    billingTitle: { fontSize: 14, fontWeight: "700", color: "#1e293b", marginBottom: 14 },
    billingRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
    billingLabel: { fontSize: 14, color: "#64748b" },
    billingLabelBold: { fontWeight: "700", color: "#1e293b" },
    billingValue: { fontSize: 14, color: "#1e293b" },
    billingValueBold: { fontWeight: "700", fontSize: 16 },
    billingDivider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 6 },

    // Waiting
    waitingCard: {
        flexDirection: "row", alignItems: "center", gap: 12,
        backgroundColor: "#eff6ff", borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: "#bfdbfe",
    },
    waitingText: { fontSize: 14, color: "#2563eb", fontWeight: "500", flex: 1 },
});
