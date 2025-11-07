import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';


const ProfilePage = () => {
    const router = useRouter();

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

    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container}>
            {/* Top Bar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Me</Text>
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={40} color="#fff" />
                </View>
                <View style={styles.profileInfo}>
                    <Text style={styles.nameText}>Name</Text>
                    <Text style={styles.emailText}>E-mail address</Text>
                    <Text style={styles.phoneText}>+918138834116</Text>
                </View>
                <TouchableOpacity>
                    <Text style={styles.addText}>Add</Text>
                </TouchableOpacity>
            </View>

            {/* Menu List */}
            <View style={styles.menuList}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.menuItem} onPress={() => handleNavigation(item.title)}>
                        <View style={styles.menuIcon}>{item.icon}</View>
                        <Text style={styles.menuText}>{item.title}</Text>
                        {item.isNew && <Text style={styles.newBadge}>NEW</Text>}
                        <Entypo name="chevron-right" size={20} color="gray" style={{ marginLeft: 'auto' }} />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
        </SafeAreaView>
    );
};

const menuItems = [
    { title: 'Orders', icon: <Ionicons name="cube-outline" size={22} color="black" /> },
    { title: 'My Wallet', icon: <MaterialIcons name="account-balance-wallet" size={22} color="black" /> },
    { title: 'Coupons', icon: <MaterialIcons name="card-giftcard" size={22} color="black" />, isNew: true },
    { title: 'Address', icon: <Ionicons name="home-outline" size={22} color="black" /> },
    // { title: 'FlashFits stores', icon: <Ionicons name="storefront-outline" size={22} color="black" /> },
    { title: 'Help and Support', icon: <Ionicons name="help-circle-outline" size={22} color="black" /> },
    { title: 'Logout', icon: <MaterialIcons name="logout" size={22} color="black" /> },
    { title: 'About Us', icon: <Image source={require('../../assets/images/2.jpg')} style={{ width: 22, height: 22 }} /> },
];

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#B2E3B2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 14,
    color: 'gray',
  },
  phoneText: {
    fontSize: 14,
    color: 'gray',
  },
  addText: {
    color: 'green',
    fontWeight: 'bold',
  },
  walletSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  walletInfo: {
    marginLeft: 10,
  },
  walletLabel: {
    fontSize: 14,
    color: 'gray',
  },
  walletAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  menuList: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  menuIcon: {
    width: 24,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
  },
  newBadge: {
    backgroundColor: 'red',
    color: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
    marginLeft: 8,
  },
});

export default ProfilePage;
