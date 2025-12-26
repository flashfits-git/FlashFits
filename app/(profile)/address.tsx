import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import HearderForProfileComponents from '../../components/ProfilePageComponents/HearderForProfileComponents';
import { getAddresses } from '../api/productApis/cartProduct';
import * as SecureStore from 'expo-secure-store';
const AddressPage = () => {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  console.log(addresses,'addressesaddressesaddresses');
  
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      // 🔐 0️⃣ CHECK TOKEN FIRST
      const token = await SecureStore.getItemAsync('token');

      if (!token) {
        console.log('No token found → skipping address API');
        setLoading(false);
        return; // ❌ STOP HERE — NO API CALL
      }


      const res = await getAddresses();
      setAddresses(res?.addresses || []);
    } catch (error) {
      console.log('Address fetch error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HearderForProfileComponents />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {addresses.map((item, index) => (
          <View style={styles.addressCard} key={item._id || index}>
            {/* Name + Type */}
            <View style={styles.row}>
              <Text style={styles.nameText}>{item.name}</Text>
              <Text style={styles.typeText}>
                ({item.addressType})
              </Text>
              {item.isDefault && (
                <Text style={styles.defaultText}>Default</Text>
              )}
            </View>

            {/* Full Address */}
            <Text style={styles.addressText}>
              {item.addressLine1}, {item.addressLine2}
              {item.area ? `, ${item.area}` : ''}
              {item.landmark ? `, ${item.landmark}` : ''}
              {'\n'}
              {item.city}, {item.state} - {item.pincode}
              {'\n'}
              {item.country}
            </Text>

            {/* Phone */}
            <Text style={styles.phoneText}>
              Phone : <Text style={styles.phoneNumber}>{item.phone}</Text>
            </Text>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.deleteButton}>
                <MaterialIcons name="delete-outline" size={20} color="red" />
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.editButton, { opacity: 0.3 }]}>
                <MaterialIcons name="edit" size={20} color="green" />
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(stack)/SelectLocationScreen')}
        >
          <Text style={styles.backButtonText}>Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    paddingBottom: 40, // 👈 ensures scroll reaches button
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  typeText: {
    fontSize: 13,
    color: '#555',
  },
  defaultText: {
    fontSize: 12,
    color: 'green',
    fontWeight: 'bold',
  },
  addressText: {
    marginTop: 8,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  phoneText: {
    marginTop: 8,
    fontSize: 14,
    color: 'gray',
  },
  phoneNumber: {
    color: 'black',
    fontWeight: 'bold',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 24,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteText: {
    marginLeft: 4,
    color: 'red',
    fontWeight: 'bold',
  },
  editText: {
    marginLeft: 4,
    color: 'green',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'black',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#000'
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
});

export default AddressPage;
