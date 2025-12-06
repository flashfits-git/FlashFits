import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAddresses } from '@/app/api/productApis/cartProduct';
import { useAddress } from '@/app/AddressContext';   // ✅ USE CONTEXT

const HeaderBag = forwardRef((props, ref) => {
  const router = useRouter();

  // ------------------------ CONTEXT ------------------------
  const { selectedAddress, setSelectedAddress } = useAddress(); // ✅ REPLACE local state

  const [addresses, setAddresses] = useState({ addresses: [] });
  const [addressLoading, setAddressLoading] = useState(false);

  const addressModalRef = useRef<Modalize>(null);

  // open modal if autoOpen=true
  useEffect(() => {
    requestAnimationFrame(() => {
      if (props.autoOpen) {
        openAddressModal();
      }
    });
  }, []);

  // ------------------------ OPEN MODAL ------------------------
  const openAddressModal = async () => {
    setAddressLoading(true);

    try {
      const res = await getAddresses();
      setAddresses(res || { addresses: [] });
    } catch (error) {
      console.log('Error fetching addresses:', error);
    } finally {
      setAddressLoading(false);
    }

    addressModalRef.current?.open();
  };

  // Expose openAddressModal to parent
  useImperativeHandle(ref, () => ({
    openAddressModal,
  }));

  // ------------------------ SELECT ADDRESS ------------------------
  const selectAddress = async (item: any) => {
    setSelectedAddress(item); // ✅ SET IN CONTEXT

    // notify parent
    if (props.onAddressChange) {
      props.onAddressChange(item);
    }

    addressModalRef.current?.close();
  };

  // ------------------------ FORMATTED ADDRESS ------------------------
  const formattedAddress = selectedAddress
    ? [selectedAddress.addressLine1, selectedAddress.area, selectedAddress.city]
        .filter(Boolean)
        .join(', ')
    : 'Select Location';

  return (
    <>
      <View style={styles.headerWrapper}>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)')}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerTitle} onPress={openAddressModal}>
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

        <TouchableOpacity
          onPress={() => router.push('/')}
          style={styles.homeButton}
        >
          <Ionicons name="home" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* ------------------------ ADDRESS MODAL ------------------------ */}
      <Modalize ref={addressModalRef} adjustToContentHeight>
        <View style={{ padding: 20, marginBottom: 12 }}>
          {addressLoading ? (
            <ActivityIndicator size="large" color="black" />
          ) : addresses.addresses.length === 0 ? (
            <EmptyAddress router={router} modalRef={addressModalRef} />
          ) : (
            <AddressList
              addresses={addresses.addresses}
              router={router}
              modalRef={addressModalRef}
              selectAddress={selectAddress}
            />
          )}
        </View>
      </Modalize>
    </>
  );
});

export default HeaderBag;

//
// ------------------------ SUB COMPONENTS ------------------------
//

const EmptyAddress = ({ router, modalRef }) => (
  <>
    <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 15 }}>
      No Address Found
    </Text>

    <TouchableOpacity
      onPress={() => {
        modalRef.current?.close();
        router.push('/(stack)/SelectLocationScreen');
      }}
      style={{
        backgroundColor: '#000',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
        Add Address
      </Text>
    </TouchableOpacity>
  </>
);

const AddressList = ({ addresses, router, modalRef, selectAddress }) => (
  <View style={{ padding: 10, width: '100%' }}>
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
          modalRef.current?.close();
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
);

//
// ------------------------ STYLES ------------------------
//
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
