import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
    ScrollView,
    ActivityIndicator,
    Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getOrderById } from "../api/orderApis";
import { submitReview } from "../api/reviewApis";

const STAR_LABELS = ["", "Poor", "Bad", "Okay", "Good", "Excellent"];

interface ReviewTarget {
    targetId: string;
    targetType: "product" | "merchant" | "rider";
    label: string;
    image?: string;
    emoji: string;
    rating: number;
    comment: string;
}

export default function ReviewOrder() {
    const { orderId } = useLocalSearchParams<{ orderId: string }>();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [targets, setTargets] = useState<ReviewTarget[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        loadOrder();
    }, []);

    const loadOrder = async () => {
        try {
            const data = await getOrderById(orderId);
            const order = data.order || data;
            const reviewTargets: ReviewTarget[] = [];

            // Products
            if (order.items?.length) {
                for (const item of order.items) {
                    reviewTargets.push({
                        targetId: item.productId,
                        targetType: "product",
                        label: item.name || "Product",
                        image: item.image,
                        emoji: "👕",
                        rating: 0,
                        comment: "",
                    });
                }
            }

            // Merchant
            if (order.merchantId) {
                const merchantId = typeof order.merchantId === "object" ? order.merchantId._id : order.merchantId;
                reviewTargets.push({
                    targetId: merchantId,
                    targetType: "merchant",
                    label: order.merchantDetails?.name || order.merchantId?.shopName || "Shop",
                    emoji: "🏪",
                    rating: 0,
                    comment: "",
                });
            }

            // Rider
            if (order.deliveryRiderId) {
                const riderId = typeof order.deliveryRiderId === "object" ? order.deliveryRiderId._id : order.deliveryRiderId;
                reviewTargets.push({
                    targetId: riderId,
                    targetType: "rider",
                    label: order.deliveryRiderDetails?.name || "Delivery Partner",
                    emoji: "🚴",
                    rating: 0,
                    comment: "",
                });
            }

            setTargets(reviewTargets);
        } catch (err) {
            console.error("Failed to load order:", err);
            Alert.alert("Error", "Could not load order details.");
        } finally {
            setLoading(false);
        }
    };

    const updateTarget = (index: number, updates: Partial<ReviewTarget>) => {
        setTargets((prev) => prev.map((t, i) => (i === index ? { ...t, ...updates } : t)));
    };

    const handleSubmitAll = async () => {
        const reviewed = targets.filter((t) => t.rating > 0);
        if (reviewed.length === 0) {
            Alert.alert("No Ratings", "Please rate at least one item.");
            return;
        }

        setSubmitting(true);
        let submitted = 0;
        for (const target of reviewed) {
            try {
                await submitReview({
                    targetId: target.targetId,
                    targetType: target.targetType,
                    orderId,
                    rating: target.rating,
                    comment: target.comment.trim() || undefined,
                });
                submitted++;
            } catch (err: any) {
                console.warn(`Failed to submit ${target.targetType} review:`, err.response?.data?.message);
            }
        }
        setSubmitting(false);

        if (submitted > 0) {
            Alert.alert("Thanks!", `${submitted} review${submitted > 1 ? "s" : ""} submitted.`, [
                { text: "OK", onPress: () => router.back() },
            ]);
        } else {
            Alert.alert("Error", "Could not submit reviews. Try again.");
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    const current = targets[activeIndex];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Rate Your Order</Text>
                <Text style={styles.headerSub}>
                    {activeIndex + 1} of {targets.length}
                </Text>
            </View>

            {/* Dots */}
            <View style={styles.dots}>
                {targets.map((_, i) => (
                    <TouchableOpacity key={i} onPress={() => setActiveIndex(i)}>
                        <View
                            style={[
                                styles.dot,
                                i === activeIndex && styles.dotActive,
                                targets[i].rating > 0 && styles.dotDone,
                            ]}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Current target card */}
                <View style={styles.card}>
                    {current?.image ? (
                        <Image source={{ uri: current.image }} style={styles.productImage} />
                    ) : (
                        <Text style={styles.emoji}>{current?.emoji}</Text>
                    )}

                    <Text style={styles.targetType}>
                        {current?.targetType === "product"
                            ? "Product"
                            : current?.targetType === "merchant"
                                ? "Store"
                                : "Delivery Partner"}
                    </Text>
                    <Text style={styles.targetName}>{current?.label}</Text>

                    {/* Stars */}
                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => updateTarget(activeIndex, { rating: star })}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.star, star <= (current?.rating || 0) && styles.starActive]}>
                                    ★
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {(current?.rating || 0) > 0 && (
                        <Text style={styles.ratingLabel}>{STAR_LABELS[current.rating]}</Text>
                    )}

                    {/* Comment */}
                    <TextInput
                        style={styles.input}
                        placeholder="Write a review (optional)"
                        placeholderTextColor="#94a3b8"
                        value={current?.comment || ""}
                        onChangeText={(text) => updateTarget(activeIndex, { comment: text })}
                        maxLength={300}
                        multiline
                    />
                </View>

                {/* Navigation */}
                <View style={styles.navRow}>
                    {activeIndex > 0 && (
                        <TouchableOpacity style={styles.navBtn} onPress={() => setActiveIndex((i) => i - 1)}>
                            <Text style={styles.navBtnText}>← Previous</Text>
                        </TouchableOpacity>
                    )}
                    <View style={{ flex: 1 }} />
                    {activeIndex < targets.length - 1 && (
                        <TouchableOpacity style={styles.navBtn} onPress={() => setActiveIndex((i) => i + 1)}>
                            <Text style={styles.navBtnText}>Next →</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>

            {/* Submit */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleSubmitAll}
                    disabled={submitting}
                    activeOpacity={0.8}
                >
                    {submitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitText}>
                            Submit {targets.filter((t) => t.rating > 0).length > 0
                                ? `${targets.filter((t) => t.rating > 0).length} Review${targets.filter((t) => t.rating > 0).length > 1 ? "s" : ""}`
                                : "Reviews"}
                        </Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.back()} style={styles.skipBtn}>
                    <Text style={styles.skipText}>Skip for now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8fafc" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: {
        paddingTop: 56,
        paddingHorizontal: 24,
        paddingBottom: 8,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },
    headerTitle: { fontSize: 24, fontWeight: "700", color: "#0f172a" },
    headerSub: { fontSize: 13, color: "#94a3b8", marginTop: 2 },
    dots: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 16,
        backgroundColor: "#fff",
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#e2e8f0",
    },
    dotActive: { backgroundColor: "#2563eb", width: 24 },
    dotDone: { backgroundColor: "#10b981" },
    scrollContent: { padding: 20, paddingBottom: 100 },
    card: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 28,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 16,
        marginBottom: 16,
        backgroundColor: "#f1f5f9",
    },
    emoji: { fontSize: 48, marginBottom: 12 },
    targetType: {
        fontSize: 12,
        fontWeight: "600",
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    targetName: {
        fontSize: 20,
        fontWeight: "700",
        color: "#0f172a",
        marginTop: 4,
        marginBottom: 20,
        textAlign: "center",
    },
    starsRow: { flexDirection: "row", gap: 6, marginBottom: 8 },
    star: { fontSize: 44, color: "#e2e8f0" },
    starActive: { color: "#f59e0b" },
    ratingLabel: { fontSize: 14, color: "#f59e0b", fontWeight: "600", marginBottom: 16 },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 14,
        padding: 14,
        fontSize: 14,
        color: "#0f172a",
        minHeight: 80,
        textAlignVertical: "top",
        marginTop: 8,
    },
    navRow: {
        flexDirection: "row",
        marginTop: 16,
        paddingHorizontal: 4,
    },
    navBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    navBtnText: { fontSize: 15, color: "#2563eb", fontWeight: "600" },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        padding: 20,
        paddingBottom: 36,
        borderTopWidth: 1,
        borderTopColor: "#f1f5f9",
        alignItems: "center",
    },
    submitBtn: {
        width: "100%",
        backgroundColor: "#2563eb",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        shadowColor: "#2563eb",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    skipBtn: { marginTop: 12 },
    skipText: { color: "#94a3b8", fontSize: 14, fontWeight: "500" },
});
