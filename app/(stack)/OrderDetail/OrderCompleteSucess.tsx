import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function SuccessReturnPage() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams<{ orderId: string }>();

    const handleReturnHome = () => {
        router.replace('/(tabs)');
    };

    const handleRateOrder = () => {
        if (orderId) {
            router.push({ pathname: '/(stack)/ReviewOrder' as any, params: { orderId } });
        } else {
            router.replace('/(tabs)');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Ionicons name="bicycle" size={200} color="green" />
                <Text style={styles.title}>Success!</Text>

                <Text style={styles.message}>
                    Order Completed
                </Text>

                <TouchableOpacity
                    style={styles.rateButton}
                    onPress={handleRateOrder}
                    activeOpacity={0.8}
                >
                    <Ionicons name="star" size={20} color="#fff" />
                    <Text style={styles.rateButtonText}>Rate Your Experience</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleReturnHome}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Return to Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 24,
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    button: {
        backgroundColor: '#10b981',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    rateButton: {
        backgroundColor: '#2563eb',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 12,
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    rateButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
});