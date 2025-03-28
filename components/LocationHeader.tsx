import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const LocationHeader = () => {
  return (
    <View className="flex-row items-center p-4 bg-white shadow-md">
      <Ionicons name="location-outline" size={24} color="black" />
      <Text className="ml-2 text-lg font-bold">New York, USA</Text>
    </View>
  )
}

export default LocationHeader