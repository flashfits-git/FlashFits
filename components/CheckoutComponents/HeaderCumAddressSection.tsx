import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Added missing router import

const HeaderCumAddressSection = () => {
  const router = useRouter(); // Corrected router usage

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <View style={styles.homeRow}>
              <Ionicons name="home" size={20} color="#333" />
              <Text style={styles.homeText} numberOfLines={1}>Kachapilly Maradu P.O</Text>
              <Ionicons name="chevron-down" size={16} color="#333" />
     
     
     <Text style={styles.greenText}>2 hour</Text>

            </View>
            <Text style={styles.addressText} numberOfLines={1}>
              72/1533 Baby Smarka Road, Mamangalam, Mamang...
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.bellContainer}>
            <Ionicons name="notifications-outline" size={22} color="#333" />
          </View>
          <TouchableOpacity>
            <Feather name="more-vertical" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    width:140,
    // backgroundColor:'red'
  },
  addressText: {
    color: '#666666',
    fontSize: 12,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  greenText:{
    marginLeft:8,
    fontFamily:'YourFont'
  }
});

export default HeaderCumAddressSection;
