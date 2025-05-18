import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, Image, SafeAreaView, ScrollView } from 'react-native';

export default function PhoneLogin() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [syncContacts, setSyncContacts] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Log in</Text>
        <Text style={styles.subtitle}>Enter your phone number to proceed.</Text>

        <View style={styles.inputContainer}>
          <View style={styles.countryRow}>
            <Image
              source={{ uri: 'https://flagcdn.com/w40/in.png' }}
              style={styles.flag}
            />
            <Text style={styles.countryName}>France</Text>
          </View>

          <View style={styles.phoneRow}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.input}
              placeholder="0 00 00 00 00"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By clicking, I accept the <Text style={styles.linkText}>Terms & Conditions</Text> & <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fdfdfd',
  },
  container: {
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  flag: {
    width: 24,
    height: 18,
    marginRight: 8,
    borderRadius: 3,
  },
  countryName: {
    fontSize: 16,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
    marginBottom: 15,
  },
  countryCode: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
  syncRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  syncText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#8FD9FB',
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 100,
    marginHorizontal:35,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    marginTop: 10,
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal:10,
  },
  linkText: {
    fontWeight: 'bold',
    color: '#222',
  },
});
