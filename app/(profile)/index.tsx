import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAddress } from '../AddressContext';
import { useAuth } from '../AuthContext';

const ProfilePage = () => {
    const router = useRouter();
    const { setSelectedAddress } = useAddress();
    const { signOut } = useAuth();
    const [scaleValues] = useState(menuItems.map(() => new Animated.Value(1)));

    const handleNavigation = async (title: string) => {
        if (title === 'Logout') {
            Alert.alert(
                'Confirm Logout',
                'Are you sure you want to logout?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Logout',
                        style: 'destructive',
                        onPress: async () => {
                            // Ensure any local context state unhandled by AuthContext is cleared
                            setSelectedAddress(null);

                            // Call global signout
                            await signOut();
                        },
                    },
                ]
            );
            return;
        }
        const screenName = title.replace(/\s+/g, '').toLowerCase();
        router.push({
            pathname: `/(profile)/${screenName}` as any,
            params: { title },
        });
    };

    const handlePressIn = (index: number) => {
        Animated.spring(scaleValues[index], {
            toValue: 0.96,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = (index: number) => {
        Animated.spring(scaleValues[index], {
            toValue: 1,
            friction: 4,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* PREMIUM HEADER */}
                <LinearGradient
                    colors={['#1c1c1c', '#333333']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <View style={styles.headerTop}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="settings-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.userInfoSection}>
                        <View style={styles.avatarWrapper}>
                            <View style={styles.avatarBorder}>
                                <Image
                                    style={styles.avatar}
                                    source="https://ui-avatars.com/api/?name=User&background=random"
                                    contentFit="cover"
                                />
                            </View>
                            <TouchableOpacity style={styles.editBadge}>
                                <Ionicons name="pencil" size={14} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.nameContainer}>
                            <Text style={styles.userName}>Rahul Sharma</Text>
                            <Text style={styles.userEmail}>rahul.sharma@example.com</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* QUICK STATS - REIMAGINED */}
                <View style={styles.statsRow}>
                    <TouchableOpacity style={styles.statCard} activeOpacity={0.7}>
                        <LinearGradient colors={['#eef2ff', '#e0e7ff']} style={styles.statIconBg}>
                            <Ionicons name="cube" size={22} color="#4338ca" />
                        </LinearGradient>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statName}>Orders</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.statCard} activeOpacity={0.7}>
                        <LinearGradient colors={['#fff7ed', '#ffedd5']} style={styles.statIconBg}>
                            <MaterialIcons name="card-giftcard" size={22} color="#ea580c" />
                        </LinearGradient>
                        <Text style={styles.statValue}>05</Text>
                        <Text style={styles.statName}>Offers</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.statCard} activeOpacity={0.7}>
                        <LinearGradient colors={['#f0fdf4', '#dcfce7']} style={styles.statIconBg}>
                            <Ionicons name="wallet" size={22} color="#16a34a" />
                        </LinearGradient>
                        <Text style={styles.statValue}>₹450</Text>
                        <Text style={styles.statName}>Wallet</Text>
                    </TouchableOpacity>
                </View>

                {/* MENU SECTIONS */}
                <View style={styles.menuWrapper}>
                    <Text style={styles.groupTitle}>ACCOUNT SETTINGS</Text>
                    {menuItems.slice(0, 2).map((item, index) => (
                        <Animated.View
                            key={index}
                            style={[
                                styles.itemContainer,
                                { transform: [{ scale: scaleValues[index] }] }
                            ]}
                        >
                            <TouchableOpacity
                                style={styles.itemTouch}
                                onPress={() => handleNavigation(item.title)}
                                onPressIn={() => handlePressIn(index)}
                                onPressOut={() => handlePressOut(index)}
                                activeOpacity={1}
                            >
                                <View style={[styles.itemIconBox, { backgroundColor: item.color }]}>
                                    {item.icon}
                                </View>
                                <View style={styles.itemTextContent}>
                                    <Text style={styles.itemLabel}>{item.title}</Text>
                                    <Text style={styles.itemSubLabel}>{item.subtitle}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
                            </TouchableOpacity>
                        </Animated.View>
                    ))}

                    <Text style={[styles.groupTitle, { marginTop: 24 }]}>RESOURCES & SUPPORT</Text>
                    {menuItems.slice(2).map((item, index) => {
                        const actualIndex = index + 2;
                        return (
                            <Animated.View
                                key={actualIndex}
                                style={[
                                    styles.itemContainer,
                                    { transform: [{ scale: scaleValues[actualIndex] }] }
                                ]}
                            >
                                <TouchableOpacity
                                    style={styles.itemTouch}
                                    onPress={() => handleNavigation(item.title)}
                                    onPressIn={() => handlePressIn(actualIndex)}
                                    onPressOut={() => handlePressOut(actualIndex)}
                                    activeOpacity={1}
                                >
                                    <View style={[styles.itemIconBox, { backgroundColor: item.color }]}>
                                        {item.icon}
                                    </View>
                                    <View style={styles.itemTextContent}>
                                        <Text style={[styles.itemLabel, item.title === 'Logout' && styles.redText]}>
                                            {item.title}
                                        </Text>
                                        <Text style={styles.itemSubLabel}>{item.subtitle}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.versionLabel}>FlashFits v1.2.0 • Build 152</Text>
                    <Text style={styles.madeWith}>Made with ❤️ for Fashion</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const menuItems = [
    {
        title: 'Orders',
        subtitle: 'View and track your package',
        icon: <Ionicons name="receipt-outline" size={22} color="#2563eb" />,
        color: '#eff6ff'
    },
    {
        title: 'Address',
        subtitle: 'Home, work and other locations',
        icon: <Ionicons name="location-outline" size={22} color="#dc2626" />,
        color: '#fef2f2'
    },
    {
        title: 'Help and Support',
        subtitle: 'FAQs, chat and call support',
        icon: <Ionicons name="help-buoy-outline" size={22} color="#7c3aed" />,
        color: '#f5f3ff'
    },
    {
        title: 'About Us',
        subtitle: 'Our story and sustainability',
        icon: <Ionicons name="leaf-outline" size={22} color="#059669" />,
        color: '#ecfdf5'
    },
    {
        title: 'Logout',
        subtitle: 'Safely sign out of the app',
        icon: <MaterialIcons name="logout" size={22} color="#b91c1c" />,
        color: '#fff1f2'
    },
];

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    container: {
        flex: 1,
    },
    headerGradient: {
        paddingTop: 10,
        paddingBottom: 40,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfoSection: {
        alignItems: 'center',
        marginTop: 10,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarBorder: {
        padding: 4,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e2e8f0',
    },
    editBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        backgroundColor: '#2563eb',
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: '#1c1c1c',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameContainer: {
        alignItems: 'center',
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#ffffff',
        letterSpacing: -0.5,
    },
    userEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 4,
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: -30,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#ffffff',
        marginHorizontal: 4,
        borderRadius: 20,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 8,
    },
    statIconBg: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1e293b',
    },
    statName: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
        marginTop: 2,
    },
    menuWrapper: {
        paddingTop: 32,
        paddingHorizontal: 20,
    },
    groupTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#94a3b8',
        letterSpacing: 1.2,
        marginBottom: 16,
        marginLeft: 4,
    },
    itemContainer: {
        marginBottom: 12,
    },
    itemTouch: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 14,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    itemIconBox: {
        width: 46,
        height: 46,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemTextContent: {
        flex: 1,
        marginLeft: 14,
    },
    itemLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
    },
    itemSubLabel: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 2,
    },
    redText: {
        color: '#ef4444',
    },
    footer: {
        alignItems: 'center',
        marginVertical: 40,
        gap: 6,
    },
    versionLabel: {
        fontSize: 13,
        color: '#94a3b8',
        fontWeight: '600',
    },
    madeWith: {
        fontSize: 12,
        color: '#cbd5e1',
        fontWeight: '500',
    },
});

export default ProfilePage;