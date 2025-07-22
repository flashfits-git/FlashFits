import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const { height } = Dimensions.get('window');

const LocationSelector = () => {
  const [region, setRegion] = useState({
    latitude: 9.9329,
    longitude: 76.2673,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setRegion({
        ...region,
        latitude,
        longitude,
      });
    } catch (error) {
      Alert.alert('Error fetching location', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} style={{ marginRight: 8 }} />
        <Text style={styles.headerText}>Select delivery location</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#aaa" />
        <TextInput
          style={styles.input}
          placeholder="Search for a building, street name or area"
        />
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(reg) => setRegion(reg)}
      >
        <Marker coordinate={region} pinColor="orange" />
      </MapView>

      {/* Pin Marker Message */}
      <View style={styles.pinLabel}>
        <Text style={styles.pinTextTitle}>Order will be delivered here</Text>
        <Text style={styles.pinTextSub}>Move the pin to change location</Text>
      </View>

      {/* Use Current Location Button */}
      <TouchableOpacity style={styles.useLocation} onPress={getCurrentLocation}>
        <Ionicons name="locate" size={20} color="#f60" />
        <Text style={styles.useLocationText}>Use Current Location</Text>
      </TouchableOpacity>

      {/* Address Display */}
      <View style={styles.addressBox}>
        <View>
          <Text style={styles.addressLabel}>📍 VRRA-125</Text>
          <Text style={styles.addressText}>
            Maradu, Ernakulam, Kochi, Kerala 682304, India.
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.changeText}>CHANGE</Text>
        </TouchableOpacity>
      </View>

      {/* Confirm Button Fixed at Bottom */}
<TouchableOpacity
  style={styles.confirmButton}
  onPress={() => {
    console.log('Confirmed coordinates:', region.latitude, region.longitude);
    // You can also send it to backend or save in state here
  }}
>
  <Text style={styles.confirmButtonText}>CONFIRM LOCATION</Text>
</TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 10,
  },
  headerText: { fontSize: 18, fontWeight: '600' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8,
    paddingHorizontal: 20,
    height: 40,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: '#000',
  },
  map: {
    flex: 1,
  },
  pinLabel: {
    position: 'absolute',
    top: height / 2 - 60,
    alignSelf: 'center',
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 8,
    opacity: 0.8,
    alignItems: 'center',
  },
  pinTextTitle: { color: '#fff', fontWeight: 'bold' },
  pinTextSub: { color: '#ddd', fontSize: 12 },
  useLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 150,
    alignSelf: 'center',
    padding: 12,
    borderRadius: 30,
    elevation: 5,
  },
  useLocationText: {
    marginLeft: 8,
    color: '#f60',
    fontWeight: 'bold',
  },
  addressBox: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 4,
  },
  addressLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  addressText: {
    color: '#555',
    fontSize: 13,
  },
  changeText: {
    color: '#f60',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#f60',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LocationSelector;
