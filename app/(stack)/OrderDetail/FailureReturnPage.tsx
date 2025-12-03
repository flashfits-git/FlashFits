import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function FailureReturnPage() {
    const router = useRouter();

    const handleReturnHome = () => {
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Ionicons name="close-circle" size={200} color="#ef4444" />

                <Text style={styles.title}>Payment Failed</Text>

                <Text style={styles.message}>
                    Something went wrong with your payment.  
                    Please try again or choose another method.
                </Text>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#ef4444' }]}
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
});
