import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

interface ErrorMessageProps {
    message: string | null;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
    const errorOpacity = useRef(new Animated.Value(0)).current;
    const errorTranslateY = useRef(new Animated.Value(-20)).current;

    useEffect(() => {
        if (message && message !== '') {
            // Animate fade in + slide down
            Animated.parallel([
                Animated.timing(errorOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(errorTranslateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Animate fade out + slide up
            Animated.parallel([
                Animated.timing(errorOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(errorTranslateY, {
                    toValue: -20,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [message]);

    if (!message) return null;

    return (
        <Animated.View
            style={[
                styles.errorBox,
                {
                    opacity: errorOpacity,
                    transform: [{ translateY: errorTranslateY }],
                },
            ]}
        >
            <Text style={styles.errorText}>{message.toUpperCase()}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    errorBox: {
        position: 'absolute',
        bottom: 110,
        alignSelf: 'center',
        width: 250,
        height: 50,
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: '#f35454ff',
        borderColor: '#f35454ff',
        borderWidth: 0.5,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        elevation: 8,
        shadowColor: '#f35454ff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    errorText: {
        color: '#ffffffff',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        fontFamily: 'Montserrat',
        textShadowRadius: 1,
    },
});

export default memo(ErrorMessage);
