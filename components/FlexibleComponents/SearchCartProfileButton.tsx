import * as React from 'react';
import { View, StyleSheet, TouchableOpacity,Pressable  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../assets/theme/Colors';


function SearchCartProfileButton() {
  const router = useRouter();

  return (
    <View style={styles.flx}>

      <TouchableOpacity  onPress={() => router.push('/MainSearchPage')} >
        {/* <Ionicons name="search" size={26} color="#091f5b" style={{ paddingHorizontal: 4 }}/> */}
                    <Ionicons name="search-outline" size={28} color={Colors.dark1}  style={{ paddingHorizontal: 4 }} />
        
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/ShoppingBag')}>
        <Ionicons name="bag-handle-outline" size={26} color="#091f5b" style={{ paddingHorizontal: 4 }} />
      </TouchableOpacity>
      <TouchableOpacity  onPress={() => router.push('/(profile)')}>
      <Ionicons name="person-outline" size={26} color="#091f5b" style={{ paddingHorizontal: 4 }} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  flx: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12, // Optional: fallback with marginRight if unsupported
  },
});

export default SearchCartProfileButton;
