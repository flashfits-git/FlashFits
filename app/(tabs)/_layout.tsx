import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Tabs } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StatusBar,
  Text,
  View
} from 'react-native';
import Colors from '../../assets/theme/Colors';
import AddressSelectionModalize from '../../components/AddressModalize/AddressSelectionModalize';
import { checkDeliveryAvailability } from '../api/auth';
import { getAddresses } from '../api/productApis/cartProduct';

// export const addressModalRef = React.createRef();
// ⭐ ADDRESS CONTEXT
import { useAddress } from '../AddressContext';

// --------------------------------------------
//   DISTANCE HELPERS MOVED OUTSIDE useEffect
// --------------------------------------------

const ADDRESS_MODAL_SHOWN_KEY = 'addressModalShown';
const toRad = (x: number) => (x * Math.PI) / 180;

const distanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // meters

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

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
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();
  }, [focused]);

  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', Colors.grey],
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

// --------------------------------------------
//                TABS UI
// --------------------------------------------
function TabsWithCart() {
  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          animation: 'none',
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            height: Platform.OS === 'ios' ? 80 : 90,
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingTop: 18,
            paddingBottom: 10,
          },
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
      {/* <AddressSelectionModalize ref={addressModalRef} /> */}
    </>
  );
}

// --------------------------------------------
//            MAIN SCREEN (CLEAN)
// --------------------------------------------
export default function TabLayout() {
  const addressModalRef = useRef(null);

  const { setAddresses, setSelectedAddress } = useAddress();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        // 1️⃣ Check token
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          setLoading(false);
          return;
        }

        let isServiceable = false;
        let nonServiceableMessage = 'Delivery not available in your area';

        // 2️⃣ Location permission
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          isServiceable = false;
          nonServiceableMessage = 'Location permission required';
        } else {
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;

          const response = await checkDeliveryAvailability(latitude, longitude);

          // 🟢 SERVICEABLE
          if (response?.success === true) {
            isServiceable = true;

            const res = await getAddresses();
            const userAddresses = res?.addresses || [];
            setAddresses(userAddresses);

            const saved = await SecureStore.getItemAsync('selectedAddress');

            // Restore saved
            if (saved) {
              setSelectedAddress(JSON.parse(saved));
              setLoading(false);
              return;
            }

            // Auto-pick first
            if (userAddresses.length > 0) {
              const first = userAddresses[0];
              await SecureStore.setItemAsync(
                'selectedAddress',
                JSON.stringify(first)
              );
              setSelectedAddress(first);
              setLoading(false);
              return;
            }

            // 🔴 OPEN MODAL (ONLY ONCE)
            const modalShown = await SecureStore.getItemAsync(
              ADDRESS_MODAL_SHOWN_KEY
            );

            if (!modalShown) {
              setTimeout(() => {
                addressModalRef.current?.open();
              }, 300);

              await SecureStore.setItemAsync(
                ADDRESS_MODAL_SHOWN_KEY,
                'true'
              );
            }

            setLoading(false);
            return;
          }

          // 🔴 NON-SERVICEABLE
          if (response?.success === false) {
            const nonServiceableAddress = {
              addressLine1: 'Delivery not available',
              area: 'in your area',
              addressType: 'Non-serviceable',
              isServiceable: false,
              fullMessage: response.message || nonServiceableMessage,
            };

            await SecureStore.setItemAsync(
              'selectedAddress',
              JSON.stringify(nonServiceableAddress)
            );

            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Init failed', err);
        setLoading(false);
      }
    };

    init();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop:
          Platform.OS === 'android' ? StatusBar.currentHeight : 44,
      }}
    >
      <TabsWithCart />
      <AddressSelectionModalize ref={addressModalRef} />
    </View>
  );
}
