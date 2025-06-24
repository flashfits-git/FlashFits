import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const HeaderBag = () => {
  const router = useRouter();

  return (
    <View style={styles.headerWrapper}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="#333" />
        {/* <Text style={styles.title}>Shopping Bag</Text> */}

      </TouchableOpacity>

      <View style={styles.centerContainer}>
        <Text style={styles.title}>Shopping Bag</Text>
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
});

export default HeaderBag;
