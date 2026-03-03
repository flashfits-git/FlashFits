import { useAddress } from '@/app/AddressContext';
import { getAddresses } from '@/app/api/productApis/cartProduct';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { forwardRef, useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Address {
  _id: string;
  addressLine1?: string;
  area?: string;
  city?: string;
  addressType?: string;
  name?: string;
  phone?: string;
  [key: string]: any;
}

interface HeaderBagProps {
  onAddressChange?: (address: Address) => void;
  onOpenAddressModal?: () => void;   // <-- NEW
}

const HeaderBag = forwardRef(({ onOpenAddressModal }: HeaderBagProps, ref) => {
  const router = useRouter();

  const {
    selectedAddress
  } = useAddress();
  // Keep SecureStore in sync whenever selectedAddress changes
  useEffect(() => {
    if (selectedAddress) {
      SecureStore.setItemAsync('selectedAddress', JSON.stringify(selectedAddress)).catch(
        (err) => console.log('SecureStore save error:', err)
      );
    }
  }, [selectedAddress]);

  const formattedAddress = selectedAddress
    ? [
        selectedAddress.addressLine1,
        selectedAddress.area,
        selectedAddress.city,
      ]
        .filter(Boolean)
        .join(', ')
    : 'Select Location';

  return (
    <>
      <View style={styles.headerWrapper}>
        {/* BACK BUTTON */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>

        {/* ADDRESS SELECT FIELD */}
        <TouchableOpacity style={styles.headerTitle} onPress={onOpenAddressModal}>
          <View style={styles.homeRow}>
            <Ionicons name="navigate" size={20} color="#333" />
            <Text style={styles.homeText} numberOfLines={1}>
              {selectedAddress?.addressType || 'Select Address'}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </View>

          <Text style={styles.addressText} numberOfLines={1}>
            {formattedAddress}
          </Text>
        </TouchableOpacity>

        {/* HOME BUTTON */}
        <TouchableOpacity onPress={() => router.push('/')} style={styles.homeButton}>
          <Ionicons name="home" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </>
  );
});

export default HeaderBag;

// Styles (unchanged)
const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'space-between',
  },
  homeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingRight: 4,
  },
  headerTitle: {
    marginLeft: 4,
    flex: 1,
  },
  homeText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
    marginLeft: 4,
    marginRight: 2,
  },
  addressText: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  homeButton: {
    padding: 8,
  },
});