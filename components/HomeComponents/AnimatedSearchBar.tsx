import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../../app/ContextParent';

const KEYWORDS = ['Jeans', 'Shirts', 'Sneakers', 'Accessories', 'Dresses', 'Jackets'];

export default function AnimatedSearchBar() {
    const router = useRouter();
    const { cartCount } = useCart();
    const [index, setIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            // Fade out
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                // Change text
                setIndex((prevIndex) => (prevIndex + 1) % KEYWORDS.length);
                // Fade in
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            });
        }, 2500); // Change keyword every 2.5 seconds

        return () => clearInterval(interval);
    }, [fadeAnim]);

    return (
        <View style={styles.row}>
            <TouchableOpacity
                style={styles.container}
                activeOpacity={0.8}
                onPress={() => router.push('/MainSearchPage')}
            >
                <Ionicons name="search-outline" size={20} color="#8E8E93" style={styles.icon} />
                <View style={styles.textContainer}>
                    <Text style={styles.staticText}>Try your </Text>
                    <Animated.Text style={[styles.animatedText, { opacity: fadeAnim }]}>
                        "{KEYWORDS[index]}"
                    </Animated.Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.cartButton}
                onPress={() => router.push('/ShoppingBag')}
            >
                <Ionicons name="bag-handle-outline" size={24} color="#0F0F0F" />
                {cartCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{cartCount}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 16,
        gap: 10,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        height: 48,
        borderRadius: 24,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cartButton: {
        position: 'relative',
        padding: 8,
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: '#FF3B30',
        borderRadius: 8,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'Manrope-Bold',
    },
    icon: {
        marginRight: 8,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    staticText: {
        fontSize: 14,
        color: '#8E8E93',
        fontFamily: 'Manrope-Medium',
    },
    animatedText: {
        fontSize: 14,
        color: '#0F0F0F',
        fontFamily: 'Manrope-Bold',
    },
});
