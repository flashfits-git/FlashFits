import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
// import SearchCartProfileButton  from '../../components/FlexibleComponents/SearchCartProfileButton';
import { useRouter } from 'expo-router';



const HearderForProfileComponents = () => {
        const router = useRouter();

    const { title } = useLocalSearchParams<{ title: string }>(); 

  return (
    <View style={styles.container}>
        <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
        

      <View style={styles.topRow}>

        <Text style={styles.title}>{title}</Text>

      {/* <SearchCartProfileButton/> */}
      </View>
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
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingVertical: 10,
    // paddingHorizontal: 5,
  },
  
});

export default HearderForProfileComponents;
