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
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text style={styles.title}>Shopping Bag</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 4,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 16,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
    // backgroundColor: '#f5f5f5',
  },
  container: {
    paddingTop: 0,
    paddingHorizontal: 56, // to leave space for back button
    height: 60,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5c565c',
    fontFamily:'Montserrat' 
  },
});

export default HeaderBag;