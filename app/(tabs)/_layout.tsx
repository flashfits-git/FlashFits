import React, { useEffect, useRef, useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Text,
  Platform,
  StyleSheet,
  Animated,
  Easing,
  View,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Modalize } from 'react-native-modalize';
import Colors from '../../assets/theme/Colors';
import { getAddresses } from '../api/productApis/cartProduct';

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: Platform.OS === 'ios' ? 80 : 90,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    paddingTop: Platform.OS === 'ios' ? 18 : 18,
    paddingBottom: Platform.OS === 'ios' ? 10 : 10,
  },
});

// ------------------- ANIMATED ICON WRAPPER -------------------
const AnimatedIconWrapper = ({ focused, iconName, size, color, label }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.2 : 1,
        useNativeDriver: false,
      }),
      Animated.timing(bgAnim, {
        toValue: focused ? 1 : 0,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();
  }, [focused]);

  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', Colors.accent],
  });

  return (
    <Animated.View
      style={{
        backgroundColor,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        width: 55,
        height: 55,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <Ionicons name={iconName} size={focused ? 28 : 21} color={color} />
      <Text
        style={{
          fontSize: focused ? 6 : 10,
          marginTop: 2,
          color: Colors.dark1,
          fontWeight: focused ? 'bold' : 'normal',
          fontFamily: 'Oswald-Regular',
        }}
      >
        {label}
      </Text>
    </Animated.View>
  );
};

// ------------------------ TABS ------------------------
function TabsWithCart() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: 'none',
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.dark1,
        tabBarInactiveTintColor: Colors.dark1,
        tabBarIcon: ({ color, focused }) => {
          let iconName = 'home-outline';
          let label = 'Home';

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
            label = 'Home';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'grid' : 'grid-outline';
            label = 'Categories';
          } else if (route.name === 'FlashfitsStores') {
            iconName = focused ? 'storefront' : 'storefront-outline';
            label = 'Stores';
          } else if (route.name === 'Wishlist') {
            iconName = focused ? 'heart' : 'heart-outline';
            label = 'Wishlist';
          }

          return (
            <AnimatedIconWrapper
              focused={focused}
              iconName={iconName}
              color={color}
              label={label}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="Categories" />
      <Tabs.Screen name="FlashfitsStores" />
      <Tabs.Screen name="Wishlist" />
    </Tabs>
  );
}

// ------------------------ MAIN LAYOUT ------------------------
export default function TabLayout() {
  const router = useRouter();
  const addressModalRef = useRef(null);

  const [addresses, setAddresses] = useState([]); // ARRAY ONLY
  const [loading, setLoading] = useState(true);

  // ------------------- FIRST RENDER CHECK -------------------
  useEffect(() => {
    const init = async () => {
      let selected = await SecureStore.getItemAsync('selectedAddress');

      const res = await getAddresses();
      setAddresses(res.addresses || []);
      setLoading(false);

      if (!selected) {
        setTimeout(() => addressModalRef.current?.open(), 300);
      }
    };

    init();
  }, []);

  // ------------------- RECHECK ON CLOSE -------------------
  const reCheck = async () => {
    let selected = await SecureStore.getItemAsync('selectedAddress');

    const res = await getAddresses();
    setAddresses(res.addresses || []);

    if (!selected) {
      setTimeout(() => addressModalRef.current?.open(), 200);
    }
  };

  const selectAddress = async (item) => {
    await SecureStore.setItemAsync('selectedAddress', JSON.stringify(item));
    addressModalRef.current?.close();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
      }}
    >
      <TabsWithCart />

      {/* ----------------- MODAL ----------------- */}
      <Modalize
        ref={addressModalRef}
        adjustToContentHeight
        handleStyle={{ backgroundColor: '#ccc' }}
        modalStyle={{ padding: 20 }}
        onClosed={reCheck}
      >
        {loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : addresses.length === 0 ? (

          // ---------------- NO ADDRESS FOUND ----------------
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>
              No Address Found
            </Text>

            <TouchableOpacity
              onPress={() => {
                addressModalRef.current?.close();
                router.push('/(stack)/SelectLocationScreen');
              }}
              style={{
                backgroundColor: '#000',
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 10,
                width: '100%',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                Add Address
              </Text>
            </TouchableOpacity>
          </View>

        ) : (

          // ---------------- ADDRESS LIST ----------------
          <View style={{ padding: 20, width: '100%' }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                marginBottom: 15,
                textAlign: 'left',
              }}
            >
              Select Address
            </Text>

            {addresses.map((item) => (
              <TouchableOpacity
                key={item._id}
                onPress={() => selectAddress(item)}
                style={{
                  padding: 15,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#ddd',
                  marginBottom: 12,
                  backgroundColor: '#fafafa',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700' }}>
                  {item.addressType}
                </Text>

                <Text style={{ fontSize: 13, color: '#555', marginTop: 3 }}>
                  {item.addressLine1}
                </Text>

                <Text style={{ fontSize: 13, marginTop: 5 }}>
                  {item.name} • {item.phone}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Modalize>

    </View>
  );
}
