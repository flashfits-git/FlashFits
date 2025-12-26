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
} from 'react-native';
import * as Location from 'expo-location';
import { checkDeliveryAvailability } from '../api/auth';
import * as SecureStore from 'expo-secure-store';
import { Modalize } from 'react-native-modalize';
import Colors from '../../assets/theme/Colors';
import { getAddresses } from '../api/productApis/cartProduct';
import AddressSelectionModalize from '../../components/AddressModalize/AddressSelectionModalize';

export const addressModalRef = React.createRef();
// ⭐ ADDRESS CONTEXT
import { useAddress } from '../AddressContext';

// --------------------------------------------
//   DISTANCE HELPERS MOVED OUTSIDE useEffect
// --------------------------------------------
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
  // const router = useRouter();
  const addressModalRef = useRef(null);

  const { addresses, setAddresses, setSelectedAddress } = useAddress();


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        // 1️⃣ Check token
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          console.log('Guest user → skipping delivery check');
          setLoading(false);
          return;
        }

        let isServiceable = false;
        let nonServiceableMessage = 'Delivery not available in your area';

        // 2️⃣ Get location permission
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === 'granted') {
          try {
            await SecureStore.deleteItemAsync('selectedAddress');
            // 🔴 FOR TESTING: Force out-of-zone location (uncomment to test non-serviceable)
            // const lat = 28.7041; // Delhi
            // const lng = 77.1025;
            // ✅ NORMAL: Use real device location
            const location = await Location.getCurrentPositionAsync({});
            const lat = location.coords.latitude;
            const lng = location.coords.longitude;

            // 3️⃣ Call API
            const response = await checkDeliveryAvailability(lat, lng);

            console.log(response, 'responserespons666eresponseresponse');


            // Success + serviceable
            if (response?.success === true && response?.serviceable === true) {
              isServiceable = true;
            }
            // Explicit non-serviceable (includes 403 responses that Axios resolves)
            else if (response?.success === false && response?.serviceable === false) {
              isServiceable = false;
              nonServiceableMessage = response.message || nonServiceableMessage;
            }
            // Any other unexpected success=false case
            else {
              isServiceable = false;
            }

          } catch (apiError: any) {
            // console.error('Delivery check failed:', apiError);

            console.log(apiError, 'apiErrorapiErrorapiError');
            

            // Axios rejects on 4xx/5xx → error has .response
            // if (apiError.response) {
            //   if (apiError.response.status === 403) {
            //     isServiceable = false;
            //     nonServiceableMessage =
            //       apiError.response.data?.message || 'Delivery not available in your area';
            //   } else {
            //     isServiceable = false;
            //     nonServiceableMessage = 'Service temporarily unavailable';
            //   }
            // } else {
            //   // Network error, timeout, etc.
            //   isServiceable = false;
            //   nonServiceableMessage = 'Unable to verify location. Please try again.';
            // }
          }
        } else {
          console.log('Location permission denied');
          isServiceable = false;
          nonServiceableMessage = 'Location permission required to check delivery';
        }

        console.log(isServiceable, 'isServiceableisServiceable');

        // 4️⃣ NON-SERVICEABLE: Set placeholder and exit early
        if (!isServiceable) {
          const nonServiceableAddress = {
            addressLine1: 'Delivery not available',
            area: 'in your area',
            city: '',
            state: '',
            addressType: 'Non-serviceable',
            isServiceable: false,
            fullMessage: nonServiceableMessage,
          };

          await SecureStore.setItemAsync('selectedAddress', JSON.stringify(nonServiceableAddress));
          // setSelectedAddress(nonServiceableAddress);

          setLoading(false);
          return; // ← Critical: stop here, don't fetch addresses or open modal
        }

        // 5️⃣ SERVICEABLE: Continue normally
        const res = await getAddresses();
        const userAddresses = res?.addresses || [];

        setAddresses(userAddresses);

        const saved = await SecureStore.getItemAsync('selectedAddress');
        const savedAddress = saved ? JSON.parse(saved) : null;

        if (savedAddress) {
          setSelectedAddress(savedAddress);
          setLoading(false);
          return;
        }
        console.log(userAddresses, 'userAddressesuserAddresses');

        // 6️⃣ No saved address → open modal
        setTimeout(() => addressModalRef.current?.open(), 500);

        setLoading(false);
      } catch (err) {
        console.error('App init failed:', err);
        setLoading(false);
      }
    };

    init();
  }, [setAddresses, setSelectedAddress]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
      }}
    >
      <TabsWithCart />
      <AddressSelectionModalize ref={addressModalRef} />
    </View>
  );
}
