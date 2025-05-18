import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import HearderForProfileComponents from '../../components/ProfilePageComponents/HearderForProfileComponents'


const Wallet = () => {
  const router = useRouter();
  const { title } = useLocalSearchParams<{ title: string }>();

  return (

    <>
 <HearderForProfileComponents title={title}/>
    <View style={styles.container}>
      {/* Wallet Balance Section */}
      <View style={styles.balanceContainer}>
        <View>
          <Text style={styles.balanceAmount}>₹0</Text>
          <Text style={styles.balanceLabel}>total wallet balance</Text>
        </View>
        <Image 
          source={require('../../assets/images/2.jpg')} // Add a light wallet icon here
          style={styles.walletIcon}
        />
      </View>

      {/* No Transaction Found Section */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image 
          source={require('../../assets/images/4.jpg')} // Your "No Transaction" illustration
          style={styles.noTransactionImage}
          resizeMode="contain"
        />
        <Text style={styles.noTransactionText}>No transaction found</Text>
      </ScrollView>

      {/* Shop Now Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.buttonText}>Shop now</Text>
        </TouchableOpacity>
      </View>
    </View>
    </>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8f5e9', // Light green background
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  walletIcon: {
    width: 60,
    height: 60,
    opacity: 0.3,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noTransactionImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  noTransactionText: {
    fontSize: 16,
    color: '#777',
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
