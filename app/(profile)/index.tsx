import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, StatusBar, Animated } from 'react-native';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ProfilePage = () => {
    const router = useRouter();
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
                            await SecureStore.deleteItemAsync('token');
                            router.replace('/(auth)');
                        },
                    },
                ]
            );
            return;
        }

        const screenName = title.replace(/\s+/g, '').toLowerCase();
        router.push({
            pathname: `/(profile)/${screenName}`,
            params: { title },
        });
    };

    const handlePressIn = (index: number) => {
        Animated.spring(scaleValues[index], {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = (index: number) => {
        Animated.spring(scaleValues[index], {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Modern Header with Gradient */}
                <LinearGradient
                    colors={['#000', '#343434ff']}
                    style={styles.headerGradient}
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>My Profile</Text>
                        <TouchableOpacity style={styles.settingsButton}>
                            <Ionicons name="settings-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Enhanced Profile Card */}
                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <LinearGradient
                                colors={['#383838ff', '#171717ff']}
                                style={styles.avatar}
                            >
                                <Ionicons name="person" size={48} color="#fff" />
                            </LinearGradient>
                            <TouchableOpacity style={styles.editAvatarButton}>
                                <Ionicons name="camera" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.nameText}>John Doe</Text>
                            <Text style={styles.emailText}>john.doe@example.com</Text>
                            <View style={styles.phoneContainer}>
                                <Ionicons name="call" size={14} color="#666" />
                                <Text style={styles.phoneText}>+91 813 883 4116</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.editProfileButton}>
                            <Text style={styles.editButtonText}>Edit Profile</Text>
                            <Ionicons name="create-outline" size={16} color="#464646ff" />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <View style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="cube-outline" size={24} color="#2196F3" />
                        </View>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Orders</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
                            <MaterialIcons name="card-giftcard" size={24} color="#FF9800" />
                        </View>
                        <Text style={styles.statNumber}>5</Text>
                        <Text style={styles.statLabel}>Coupons</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <View style={[styles.statIconContainer, { backgroundColor: '#E8F5E9' }]}>
                            <MaterialIcons name="account-balance-wallet" size={24} color="#4CAF50" />
                        </View>
                        <Text style={styles.statNumber}>₹500</Text>
                        <Text style={styles.statLabel}>Wallet</Text>
                    </View>
                </View>

                {/* Menu Sections */}
                <View style={styles.menuContainer}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    {menuItems.slice(0, 4).map((item, index) => (
                        <Animated.View
                            key={index}
                            style={[
                                styles.menuItemWrapper,
                                { transform: [{ scale: scaleValues[index] }] }
                            ]}
                        >
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => handleNavigation(item.title)}
                                onPressIn={() => handlePressIn(index)}
                                onPressOut={() => handlePressOut(index)}
                                activeOpacity={1}
                            >
                                <View style={[styles.menuIconContainer, { backgroundColor: item.color }]}>
                                    {item.icon}
                                </View>
                                <View style={styles.menuTextContainer}>
                                    <Text style={styles.menuText}>{item.title}</Text>
                                    {item.subtitle && <Text style={styles.menuSubtitle}>{item.subtitle}</Text>}
                                </View>
                                {item.isNew && (
                                    <View style={styles.newBadge}>
                                        <Text style={styles.newBadgeText}>NEW</Text>
                                    </View>
                                )}
                                <Ionicons name="chevron-forward" size={20} color="#999" style={styles.chevron} />
                            </TouchableOpacity>
                        </Animated.View>
                    ))}

                    <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Support & More</Text>
                    {menuItems.slice(4).map((item, index) => {
                        const actualIndex = index + 4;
                        return (
                            <Animated.View
                                key={actualIndex}
                                style={[
                                    styles.menuItemWrapper,
                                    { transform: [{ scale: scaleValues[actualIndex] }] }
                                ]}
                            >
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={() => handleNavigation(item.title)}
                                    onPressIn={() => handlePressIn(actualIndex)}
                                    onPressOut={() => handlePressOut(actualIndex)}
                                    activeOpacity={1}
                                >
                                    <View style={[styles.menuIconContainer, { backgroundColor: item.color }]}>
                                        {item.icon}
                                    </View>
                                    <View style={styles.menuTextContainer}>
                                        <Text style={[styles.menuText, item.title === 'Logout' && styles.logoutText]}>
                                            {item.title}
                                        </Text>
                                        {item.subtitle && <Text style={styles.menuSubtitle}>{item.subtitle}</Text>}
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#999" style={styles.chevron} />
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
                </View>

                {/* App Version */}
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const menuItems = [
    { 
        title: 'Orders', 
        subtitle: 'Track your orders',
        icon: <Ionicons name="cube-outline" size={24} color="#2196F3" />,
        color: '#E3F2FD'
    },
    { 
        title: 'My Wallet', 
        subtitle: 'Manage your balance',
        icon: <MaterialIcons name="account-balance-wallet" size={24} color="#4CAF50" />,
        color: '#E8F5E9'
    },
    { 
        title: 'Coupons', 
        subtitle: 'View available offers',
        icon: <MaterialIcons name="card-giftcard" size={24} color="#FF9800" />,
        color: '#FFF3E0',
        isNew: true 
    },
    { 
        title: 'Address', 
        subtitle: 'Manage delivery addresses',
        icon: <Ionicons name="location-outline" size={24} color="#F44336" />,
        color: '#FFEBEE'
    },
    { 
        title: 'Help and Support', 
        subtitle: 'Get help anytime',
        icon: <Ionicons name="help-circle-outline" size={24} color="#9C27B0" />,
        color: '#F3E5F5'
    },
    { 
        title: 'About Us', 
        subtitle: 'Learn more about us',
        icon: <Ionicons name="information-circle-outline" size={24} color="#00BCD4" />,
        color: '#E0F7FA'
    },
    { 
        title: 'Logout', 
        subtitle: 'Sign out of your account',
        icon: <MaterialIcons name="logout" size={24} color="#F44336" />,
        color: '#FFEBEE'
    },
];

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
    },
    headerGradient: {
        paddingBottom: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingTop: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: 'white',
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileCard: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    avatarContainer: {
        alignSelf: 'center',
        marginBottom: 16,
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'white',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#313131ff',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
    },
    profileInfo: {
        alignItems: 'center',
        marginBottom: 16,
    },
    nameText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#212121',
        marginBottom: 4,
    },
    emailText: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 6,
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    phoneText: {
        fontSize: 14,
        color: '#757575',
    },
    editProfileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000ff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    editButtonText: {
        color: '#f8f8f8ff',
        fontSize: 16,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginTop: -12,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '700',
        color: '#212121',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: '#757575',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 12,
    },
    menuContainer: {
        padding: 16,
        paddingTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#212121',
        marginBottom: 12,
        marginLeft: 4,
    },
    menuItemWrapper: {
        marginBottom: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    menuIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    menuText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212121',
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 13,
        color: '#9E9E9E',
    },
    logoutText: {
        color: '#F44336',
    },
    newBadge: {
        backgroundColor: '#FF5252',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 8,
    },
    newBadgeText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '700',
    },
    chevron: {
        marginLeft: 8,
    },
    versionText: {
        textAlign: 'center',
        color: '#BDBDBD',
        fontSize: 13,
        marginVertical: 24,
    },
});

export default ProfilePage;