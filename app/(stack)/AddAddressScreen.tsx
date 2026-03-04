import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";
import { createAddress } from '../../app/api/productApis/cartProduct';
import { useAddress } from '../AddressContext';


export default function AddAddressScreen() {
  const { setSelectedAddress } = useAddress();

  const router = useRouter();
  const params = useLocalSearchParams();
  const rawAddress = params.address
    ? JSON.parse(params.address as string)
    : null;
  const latitude = params.lat ? Number(params.lat) : null;
  const longitude = params.lng ? Number(params.lng) : null;
  const address = params.address

  console.log(address, '88898998nnkj');

  const [submitting, setSubmitting] = useState(false);
  const [orderingFor, setOrderingFor] = useState('myself');
  const [addressType, setAddressType] = useState('Home');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: rawAddress?.town || rawAddress?.suburb || '',
    state: rawAddress?.state || 'Kerala',
    pincode: rawAddress?.postcode || '',
    latitude: latitude,
    longitude: longitude,
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const errors = [];

    if (!formData.name.trim()) errors.push("Full name is required");
    if (!formData.phone.trim()) errors.push("Phone number is required");
    if (!/^[0-9]{10}$/.test(formData.phone)) errors.push("Enter valid 10-digit phone number");
    if (!formData.addressLine1.trim()) errors.push("Flat/House number is required");
    if (!formData.pincode.trim()) errors.push("Pincode is required");

    if (!formData.latitude || !formData.longitude)
      errors.push("Please select your location on the map");

    if (errors.length > 0) {
      alert(errors[0]); // show first error only
      return;
    }

    const addressData = {
      name: formData.name,
      phone: formData.phone,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      landmark: formData.landmark,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      addressType,
      location: {
        type: "Point",
        coordinates: [formData.longitude, formData.latitude],
      },
    };

    try {
      setSubmitting(true);
      const response = await createAddress(addressData);
      console.log(response, 'responseresponser4434esponseresponse');
      await SecureStore.setItemAsync('selectedAddress', JSON.stringify(response.address));
      setSelectedAddress(response.address)
      // alert("Address added successfully!");
      console.log("Address added and saved to SecureStore");
      router.replace("/(tabs)");

    } catch (error) {
      console.error("Error saving address:", error);
      alert("Error saving address");
    } finally {
      setSubmitting(false); // ✅ stop loader
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a5c3a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SELECT DELIVERY LOCATION</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Add your address details</Text>

            {/* Who are you ordering for */}
            <Text style={styles.sectionLabel}>Who are you ordering for?</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setOrderingFor('myself')}
              >
                <View style={styles.radioOuter}>
                  {orderingFor === 'myself' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioText}>Myself</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setOrderingFor('someone')}
              >
                <View style={styles.radioOuter}>
                  {orderingFor === 'someone' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioText}>Someone else</Text>
              </TouchableOpacity>
            </View>

            {/* Save address as */}
            <Text style={styles.sectionLabel}>Save address as</Text>
            <View style={styles.addressTypeGroup}>
              <TouchableOpacity
                style={[
                  styles.addressTypeButton,
                  addressType === 'Home' && styles.addressTypeButtonActive,
                ]}
                onPress={() => setAddressType('Home')}
              >
                <Feather
                  name="home"
                  size={20}
                  color={addressType === 'Home' ? '#646564ff' : '#666'}
                />
                <Text
                  style={[
                    styles.addressTypeText,
                    addressType === 'Home' && styles.addressTypeTextActive,
                  ]}
                >
                  Home
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.addressTypeButton,
                  addressType === 'Work' && styles.addressTypeButtonActive,
                ]}
                onPress={() => setAddressType('Work')}
              >
                <Feather
                  name="briefcase"
                  size={20}
                  color={addressType === 'Work' ? '#646564ff' : '#666'}
                />
                <Text
                  style={[
                    styles.addressTypeText,
                    addressType === 'Work' && styles.addressTypeTextActive,
                  ]}
                >
                  Office
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.addressTypeButton,
                  addressType === 'Other' && styles.addressTypeButtonActive,
                ]}
                onPress={() => setAddressType('Other')}
              >
                <Feather
                  name="map-pin"
                  size={20}
                  color={addressType === 'Other' ? '#646564ff' : '#666'}
                />
                <Text
                  style={[
                    styles.addressTypeText,
                    addressType === 'Other' && styles.addressTypeTextActive,
                  ]}
                >
                  Others
                </Text>
              </TouchableOpacity>
            </View>

            {/* Address details */}
            <Text style={styles.sectionLabel}>Address details</Text>
            <TextInput
              style={styles.input}
              placeholder="*Flat / House number"
              placeholderTextColor="#999"
              value={formData.addressLine1}
              onChangeText={(text) => handleInputChange('addressLine1', text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Street / Building name (optional)"
              placeholderTextColor="#999"
              value={formData.addressLine2}
              onChangeText={(text) => handleInputChange('addressLine2', text)}
            />

            <TextInput
              style={styles.input}
              placeholder="*City"
              placeholderTextColor="#999"
              value={formData.city}
              onChangeText={(text) => handleInputChange('city', text)}
            />

            <TextInput
              style={styles.input}
              placeholder="*State"
              placeholderTextColor="#999"
              value={formData.state}
              onChangeText={(text) => handleInputChange('state', text)}
            />

            <TextInput
              style={styles.input}
              placeholder="*Pincode"
              placeholderTextColor="#999"
              value={formData.pincode}
              onChangeText={(text) => handleInputChange('pincode', text)}
            />

            {/* Contact details */}
            <Text style={styles.sectionLabel}>Contact details</Text>

            <TextInput
              style={styles.input}
              placeholder="*Phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
            />

            <TextInput
              style={styles.input}
              placeholder="*Full name"
              placeholderTextColor="#999"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Landmark (optional)"
              placeholderTextColor="#999"
              value={formData.landmark}
              onChangeText={(text) => handleInputChange('landmark', text)}
            />


            {/* Confirm button */}
            <TouchableOpacity
              style={[
                styles.confirmButton,
                submitting && { opacity: 0.7 }
              ]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirm address</Text>
              )}
            </TouchableOpacity>

          </View>
        </ScrollView>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#646564ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#646564ff',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    backgroundColor: '#646564ff',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 32,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#646564ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#646564ff',
  },
  radioText: {
    fontSize: 16,
    color: '#000',
  },
  addressTypeGroup: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  addressTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    gap: 8,
  },
  addressTypeButtonActive: {
    borderColor: '#646564ff',
    backgroundColor: '#e8f5e9',
  },
  addressTypeText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  addressTypeTextActive: {
    color: '#646564ff',
    fontWeight: '600',
  },
  locationBox: {
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  locationSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  changeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  changeButtonText: {
    color: '#646564ff',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#000',
    marginBottom: 12,
  },
  contactBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    marginBottom: 24,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  contactText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});