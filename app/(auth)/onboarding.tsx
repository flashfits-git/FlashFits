import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../AuthContext';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        icon: 'bag-handle-outline',
        title: 'Order Your Style',
        description:
            'Browse & order multiple styles and sizes — no upfront product cost, just a small delivery fee.',
        gradient: ['#0F0F0F', '#1A1A2E'] as const,
        accentColor: '#00F5A0',
    },
    {
        id: '2',
        icon: 'shirt-outline',
        title: 'Try at Home',
        description:
            'A rider delivers your picks in ~60 minutes. Try everything on in the comfort of your home.',
        gradient: ['#0F0F0F', '#1E1B2E'] as const,
        accentColor: '#00D4FF',
    },
    {
        id: '3',
        icon: 'heart-outline',
        title: 'Keep What You Love',
        description:
            "Love it? Keep it and pay only for what you want. Discounts auto-applied.",
        gradient: ['#0F0F0F', '#2E1A24'] as const,
        accentColor: '#FF6B9D',
    },
    {
        id: '4',
        icon: 'refresh-circle-outline',
        title: 'Return the Rest',
        description:
            "Don't love it? Hand it back to the rider instantly — zero hassle, zero cost.",
        gradient: ['#0F0F0F', '#1A2E1F'] as const,
        accentColor: '#00F5A0',
    },
];

export default function OnboardingScreen() {
    const { completeOnboarding } = useAuth();
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleComplete = () => {
        completeOnboarding();
    };

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            const nextIndex = currentIndex + 1;
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            setCurrentIndex(nextIndex);
        }
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            const newIndex = viewableItems[0].index;
            setCurrentIndex(newIndex);
        }
    }).current;

    const viewabilityConfig = useRef({
        viewAreaCoveragePercentThreshold: 50,
    }).current;

    const isLastSlide = currentIndex === SLIDES.length - 1;
    const currentSlide = SLIDES[currentIndex];

    const renderSlide = ({ item, index }: { item: typeof SLIDES[0]; index: number }) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

        const iconScaleInterp = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
        });

        const iconOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
        });

        const textTranslateY = scrollX.interpolate({
            inputRange,
            outputRange: [40, 0, 40],
            extrapolate: 'clamp',
        });

        const textOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
        });

        return (
            <View style={styles.slide}>
                {/* Icon with glow */}
                <Animated.View
                    style={[
                        styles.iconContainer,
                        {
                            transform: [{ scale: iconScaleInterp }],
                            opacity: iconOpacity,
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.iconGlow,
                            { backgroundColor: item.accentColor + '15' },
                        ]}
                    >
                        <View
                            style={[
                                styles.iconCircle,
                                { backgroundColor: item.accentColor + '25' },
                            ]}
                        >
                            <Ionicons
                                name={item.icon}
                                size={72}
                                color={item.accentColor}
                            />
                        </View>
                    </View>
                </Animated.View>

                {/* Step Indicator */}
                <Animated.View
                    style={[
                        styles.stepBadge,
                        {
                            opacity: textOpacity,
                            backgroundColor: item.accentColor + '20',
                        },
                    ]}
                >
                    <Text style={[styles.stepBadgeText, { color: item.accentColor }]}>
                        STEP {index + 1} OF {SLIDES.length}
                    </Text>
                </Animated.View>

                {/* Title */}
                <Animated.Text
                    style={[
                        styles.title,
                        {
                            opacity: textOpacity,
                            transform: [{ translateY: textTranslateY }],
                        },
                    ]}
                >
                    {item.title}
                </Animated.Text>

                {/* Description */}
                <Animated.Text
                    style={[
                        styles.description,
                        {
                            opacity: textOpacity,
                            transform: [{ translateY: textTranslateY }],
                        },
                    ]}
                >
                    {item.description}
                </Animated.Text>
            </View>
        );
    };

    return (
        <LinearGradient
            colors={currentSlide.gradient}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />

            {/* Skip Button */}
            {!isLastSlide && (
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={handleComplete}
                    activeOpacity={0.7}
                >
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            )}

            {/* Slides */}
            <Animated.FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={renderSlide}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                scrollEventThrottle={16}
            />

            {/* Bottom Section */}
            <View style={styles.bottomContainer}>
                {/* Pagination Dots */}
                <View style={styles.dotsContainer}>
                    {SLIDES.map((slide, index) => {
                        const dotWidth = scrollX.interpolate({
                            inputRange: [
                                (index - 1) * width,
                                index * width,
                                (index + 1) * width,
                            ],
                            outputRange: [8, 28, 8],
                            extrapolate: 'clamp',
                        });

                        const dotOpacity = scrollX.interpolate({
                            inputRange: [
                                (index - 1) * width,
                                index * width,
                                (index + 1) * width,
                            ],
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });

                        return (
                            <Animated.View
                                key={slide.id}
                                style={[
                                    styles.dot,
                                    {
                                        width: dotWidth,
                                        opacity: dotOpacity,
                                        backgroundColor: currentSlide.accentColor,
                                    },
                                ]}
                            />
                        );
                    })}
                </View>

                {/* Action Button */}
                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        { backgroundColor: currentSlide.accentColor },
                    ]}
                    onPress={isLastSlide ? handleComplete : handleNext}
                    activeOpacity={0.85}
                >
                    <Text style={styles.actionButtonText}>
                        {isLastSlide ? 'Get Started' : 'Next'}
                    </Text>
                    <Ionicons
                        name={isLastSlide ? 'arrow-forward' : 'chevron-forward'}
                        size={22}
                        color="#0F0F0F"
                    />
                </TouchableOpacity>

                {/* Explore link on last slide */}
                {isLastSlide && (
                    <TouchableOpacity
                        style={styles.exploreLink}
                        onPress={handleComplete}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.exploreLinkText}>Explore FlashFits →</Text>
                    </TouchableOpacity>
                )}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    skipButton: {
        position: 'absolute',
        top: 56,
        right: 24,
        zIndex: 10,
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    skipText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        fontFamily: 'Manrope-SemiBold',
        letterSpacing: 0.5,
    },
    slide: {
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingBottom: 120,
    },
    iconContainer: {
        marginBottom: 40,
    },
    iconGlow: {
        width: 180,
        height: 180,
        borderRadius: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepBadge: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 20,
    },
    stepBadgeText: {
        fontSize: 11,
        fontFamily: 'Manrope-Bold',
        letterSpacing: 1.5,
    },
    title: {
        fontSize: 32,
        color: '#FFFFFF',
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 40,
    },
    description: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.65)',
        fontFamily: 'Manrope-Medium',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 300,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 50,
        paddingHorizontal: 32,
        alignItems: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        gap: 8,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 18,
        borderRadius: 16,
        gap: 8,
    },
    actionButtonText: {
        fontSize: 17,
        fontFamily: 'WorkSans-Bold',
        color: '#0F0F0F',
        letterSpacing: 0.3,
    },
    exploreLink: {
        marginTop: 16,
        paddingVertical: 8,
    },
    exploreLinkText: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 14,
        fontFamily: 'Manrope-Medium',
        letterSpacing: 0.3,
    },
});
