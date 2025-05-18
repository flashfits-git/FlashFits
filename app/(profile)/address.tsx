import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import HearderForProfileComponents from '../../components/ProfilePageComponents/HearderForProfileComponents'


const AddressPage = () => {
  const router = useRouter();

  return (
    <>
    <HearderForProfileComponents/>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.addressCard}>
        {/* Name and Default tag */}
        <View style={styles.row}>
          <Text style={styles.nameText}>antony efron</Text>
          <Text style={styles.defaultText}>(Default)</Text>
        </View>

        {/* Address */}
        <Text style={styles.addressText}>
          kachappilly house, kachappilly house, fr george vakayil road, maradu p.o, ernakulam, 682304, Cochin
        </Text>

        {/* Phone */}
        <Text style={styles.phoneText}>
          Phone : <Text style={styles.phoneNumber}>8138834116</Text>
        </Text>

        {/* Info message */}
        <View style={styles.infoRow}>
          <Ionicons name="information-circle-outline" size={16} color="orange" />
          <Text style={styles.infoText}> For better reach, include an alternate number</Text>
        </View>

        {/* Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.deleteButton}>
            <MaterialIcons name="delete-outline" size={20} color="red" />
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.editButton}>
            <MaterialIcons name="edit" size={20} color="green" />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Back to Home Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)')}>
        <Text style={styles.backButtonText}>Back to home</Text>
      </TouchableOpacity>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    borderColor: '#eee',
    borderWidth: 1,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  defaultText: {
    marginLeft: 8,
    fontSize: 14,
    color: 'green',
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    color: 'orange',
    marginLeft: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'flex-start',
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
    marginTop: 'auto',
    borderWidth: 1,
    borderColor: 'black',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default AddressPage;
