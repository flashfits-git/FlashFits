import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchCartProfileButton  from '../../components/FlexibleComponents/SearchCartProfileButton';


const NearbyHeaderBar = ({cartCount}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>

        <Text style={styles.title}>FlashFits Stores</Text>

      <SearchCartProfileButton cartCount={cartCount}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // fixed this from 'borderColor'
    elevation: 4,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 60,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    marginLeft: 12,
    fontSize: 20,
    fontWeight: '600',
    color: '#5c565c',
    fontFamily:'Montserrat'
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

export default NearbyHeaderBar;
