// SavedAddressesScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAddresses } from '@/app/api/productApis/cartProduct';
import { useAddress } from '@/app/AddressContext';

interface Address {
  _id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  addressType: string;
  isDefault?: boolean;
}

const SavedAddressesScreen = () => {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedAddress } = useAddress();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const response = await getAddresses();
        console.log(response, 'response');
        setAddresses(response.addresses || []);
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleRedirect = () => {
    router.push('/(stack)/SelectLocationScreen');
  };

  const formatDescription = (addr: Address) => {
    const parts = [
      addr.addressLine1,
      addr.addressLine2,
      addr.landmark,
      addr.city,
      addr.state,
      addr.pincode,
    ].filter(Boolean);

    return parts.join(', ');
  };

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'home':
        return 'home-outline';
      case 'work':
        return 'briefcase-outline';
      default:
        return 'navigate-outline';
    }
  };

  const renderAddressItem = ({ item }: { item: Address }) => (
    <TouchableOpacity
      style={styles.addressCard}
      onPress={() => {
        // ✅ Set selected address in context
        setSelectedAddress(item);

        // Optional: Navigate back after selection
        router.back();
      }}
    >
      <View style={styles.iconDistanceContainer}>
        <Ionicons
          name={getIcon(item.addressType)}
          size={26}
          color="#666"
        />
        <Text style={styles.distanceText}>4.3 km</Text>
      </View>

      <View style={styles.addressInfo}>
        <Text style={styles.addressName}>
          {item.name || item.addressType || 'Address'}
        </Text>
        <Text style={styles.addressDescription} numberOfLines={2}>
          {formatDescription(item)}
        </Text>
      </View>

      <TouchableOpacity style={styles.menuButton}>
        <Ionicons name="ellipsis-vertical" size={20} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Select your location</Text>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchPlaceholder}>Search an area or address</Text>
        <Ionicons name="search" size={22} color="#999" />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.currentLocationButton} onPress={handleRedirect}>
          <Ionicons name="locate" size={22} color="#797b7eff" />
          <Text style={styles.currentLocationText}>Use Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addNewButton} onPress={handleRedirect}>
          <Ionicons name="add-circle" size={22} color="#797b7eff" />
          <Text style={styles.addNewText}>Add New Address</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.savedTitle}>SAVED ADDRESSES</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#797b7eff" />
        </View>
      ) : addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved addresses yet</Text>
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item._id}
          renderItem={renderAddressItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 4,
    // elevation: 2,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  buttonRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  currentLocationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 4,
    // elevation: 2,
  },
  currentLocationText: {
    marginLeft: 8,
    fontSize: 10,
    color: '#797b7eff',
    fontWeight: '500',
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 4,
    // elevation: 2,
  },
  addNewText: {
    marginLeft: 6,
    fontSize: 10,
    color: '#797b7eff',
    fontWeight: '500',
  },
  savedTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    letterSpacing: 0.5,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconDistanceContainer: {
    alignItems: 'center',
    marginRight: 14,
    paddingTop: 2,
  },
  distanceText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  addressInfo: {
    flex: 1,
    paddingRight: 8,
  },
  addressName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  addressDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  menuButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default SavedAddressesScreen;