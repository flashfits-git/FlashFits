import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const HeaderBag = () => {
  const router = useRouter();

  return (
    <View style={styles.headerWrapper}>
      {/* <View style={styles.centerContainer}>
        <Text style={styles.title}>Shopping Bag</Text>
      </View> */}
              <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <View style={styles.homeRow}>
              <Ionicons name="navigate" size={20} color="#333" />
              <Text style={styles.homeText} numberOfLines={1}>Kachapilly Maradu P.O</Text>
              <Ionicons name="chevron-down" size={16} color="#333" />

            </View>
            <Text style={styles.addressText} numberOfLines={1}>
              72/1533 Baby Smarka Road, Mamangalam, Mamang...
            </Text>
          </View>
        </View>

      <TouchableOpacity onPress={() => router.push('/')} style={styles.homeButton}>
        <Ionicons name="home" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 4,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5c565c',
    fontFamily: 'Montserrat',
  },
  homeButton: {
    padding: 8,
    borderRadius: 20,
  },
    headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    paddingRight: 4,
  },
  headerTitle: {
    marginLeft: 4,
    flex: 1,
  },
  homeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000000',
    marginLeft: 4,
    marginRight: 2,
    width: 140,
    // backgroundColor: 'red' // optional for debug
  },
  addressText: {
    color: '#666666',
    fontSize: 12,
    marginTop: 2,
  },
});

export default HeaderBag;
