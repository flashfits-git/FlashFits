import { StyleSheet, Text, View , TextInput , TouchableOpacity, FlatList} from 'react-native'
// import { View, TextInput, Text, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react'
// import LocationHeader from '@/components/LocationHeader'
import { SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import Voice from "@react-native-voice/voice";
import { useState , useEffect } from 'react'
import Category from '../../components/HomeComponents/Category';
import PopularProducts from '../../components/HomeComponents/PopulatProducts';


export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  // return (
  //   <SafeAreaView>

  //   <View>
  //   <View className="flex-row items-center p-4 bg-white shadow-md">
  //     <Ionicons name="location-outline" size={24} color="black" />
  //     <Text className="ml-2 text-lg font-bold">Kaloor, Kochi</Text>
  //   </View>


  //   <View className="flex flex-row items-center border-2 border-gray-300 rounded-xl w-[90%] mx-auto my-4 p-2">
  //       <Feather name="search" size={20} color="black" />
  //     <TextInput
  //       placeholder="Search..."
  //       className="flex-1 text-base pl-3"
  //       value={query}
  //       onChangeText={setQuery}
  //     />
  //     <TouchableOpacity>

  //     <MaterialIcons name="keyboard-voice" size={20} color="black" />
  //     </TouchableOpacity>
  //   </View>
    

  //     <Text className='text-red-600'>Home</Text>
  //   </View>
  //   </SafeAreaView>
  // )
  return (
    <LinearGradient
      colors={['#f7f7f7a', '#f7f7f7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1"
    >
      {/* Header Section */}
      <View className="flex-row items-center justify-between p-1">
        <View className="flex-row items-center ml-2 p-2">
          <View className="w-8 h-8 bg-white rounded-lg items-center justify-center mr-2">
            <Ionicons name="location-outline" size={20} color="#6E4E37" />
          </View>
          <View className="w-[200px]">
            <View className="flex-row items-center">
              <Text
                className="text-base font-bold text-black mr-2 max-w-[200px]"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                New York, USA
              </Text>
              <Ionicons name="chevron-down-outline" size={16} color="black" />
            </View>
            <Text
              className="text-sm text-[#868c8f] leading-5"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Explore trending styles around you!
            </Text>
          </View>
        </View>
        <View className="justify-center items-center mr-5">
          <Ionicons name="notifications-outline" size={30} color="#000" />
        </View>
      </View>

      {/* Search Section */}
      <View className="flex-row items-center mx-5 mb-2">
        <View className="flex-row items-center bg-[#F0F0F0] rounded-xl px-3 h-11 flex-1">
          <Ionicons name="search" size={20} color="#868c8f" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#868c8f"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 h-full text-sm text-black ml-2"
          />
        </View>
        <View className="bg-[#7B4F32] rounded-xl p-2.5 ml-2">
          <Ionicons name="git-branch-outline" size={24} color="#fff" />
        </View>
      </View>

      {/* FlatList */}
      <FlatList
        ListHeaderComponent={<Category />}
        ListFooterComponent={<View className="h-5" />}
        data={[{ key: 'popular-products' }]}
        renderItem={() => <PopularProducts />}
        keyExtractor={(item) => item.key}
      />
    </LinearGradient>
  );
}