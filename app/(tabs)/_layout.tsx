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
import * as Location from 'expo-location';
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

/**
 * RETURNS address if within 300m radius
 */
const findNearestAddress = (currLat, currLng, list) => {
  let nearest = null;

  list.forEach((addr) => {
    if (!addr.location?.coordinates) return;

    const [lng, lat] = addr.location.coordinates;
    const dist = distanceInMeters(currLat, currLng, lat, lng);

    if (dist <= 300) {
      nearest = addr;
    }
  });

  return nearest;
};

// --------------------------------------------
//                TAB ICON
// --------------------------------------------
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
     <AddressSelectionModalize ref={addressModalRef} />
    </>
  );
}

// --------------------------------------------
//            MAIN SCREEN (CLEAN)
// --------------------------------------------
export default function TabLayout() {
  const router = useRouter();
  const addressModalRef = useRef(null);

  const { addresses, setAddresses, setSelectedAddress } = useAddress();

  const [loading, setLoading] = useState(true);

  // --------------------------------------------
  //          FIRST MOUNT → LOCATION + ADDRESS
  // --------------------------------------------
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        // 1️⃣ PERMISSION
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Location permission denied');
        }

        // 2️⃣ GET CURRENT GPS
        let currentLoc = await Location.getCurrentPositionAsync({});
        const { latitude: currLat, longitude: currLng } = currentLoc.coords;

        // 3️⃣ API FETCH ADDRESSES
        const res = await getAddresses();
        const userAddresses = res?.addresses || [];
        setAddresses(userAddresses);

        // 4️⃣ GET SAVED ADDRESS
        let saved = await SecureStore.getItemAsync('selectedAddress');
        let savedAddress = saved ? JSON.parse(saved) : null;

        // 5️⃣ GPS AUTO-MATCH WITH NEAREST
        const nearest = findNearestAddress(currLat, currLng, userAddresses);

        if (nearest) {
          setSelectedAddress(nearest);
          await SecureStore.setItemAsync(
            'selectedAddress',
            JSON.stringify(nearest)
          );
          setLoading(false);
          return;
        }

        // 6️⃣ USE SAVED IF EXISTS
        if (savedAddress) {
          setSelectedAddress(savedAddress);
          setLoading(false);
          return;
        }

        // 7️⃣ OPEN MODAL ONLY ONCE
        setTimeout(() => addressModalRef.current?.open(), 300);
      } catch (err) {
        console.log('INIT ERR:', err);
      }

      setLoading(false);
    };

    init();
  }, []);

  // --------------------------------------------
  //         WHEN MODAL CLOSES → VERIFY
  // --------------------------------------------
  const reCheck = async () => {
    let saved = await SecureStore.getItemAsync('selectedAddress');

    const res = await getAddresses();
    setAddresses(res.addresses || []);

    if (!saved) {
      setTimeout(() => addressModalRef.current?.open(), 200);
    }
  };

  // --------------------------------------------
  //             SELECT ADDRESS
  // --------------------------------------------
  const selectAddress = async (item) => {
    setSelectedAddress(item);
    await SecureStore.setItemAsync('selectedAddress', JSON.stringify(item));
    addressModalRef.current?.close();
  };

  // --------------------------------------------
  //                UI RETURN
  // --------------------------------------------
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
      }}
    >
      <TabsWithCart />

      {/* ------------------------------------------ */}
      {/*                ADDRESS MODAL               */}
      {/* ------------------------------------------ */}
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
          <View style={{ padding: 20, width: '100%' }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 15,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700' }}>Select Address</Text>

              <TouchableOpacity
                onPress={() => {
                  addressModalRef.current?.close();
                  router.push('/(stack)/SelectLocationScreen');
                }}
                style={{
                  backgroundColor: '#000',
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
                  Add Address
                </Text>
              </TouchableOpacity>
            </View>

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
