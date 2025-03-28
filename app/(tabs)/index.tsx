import { StyleSheet, Text, View , TextInput , TouchableOpacity} from 'react-native'
import React from 'react'
import LocationHeader from '@/components/LocationHeader'
import { SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Voice from "@react-native-voice/voice";
import { useState , useEffect } from 'react'


export default function Home() {
    const [query, setQuery] = useState("");
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        Voice.onSpeechResults = (event) => {
          if (event.value) {
            setQuery(event.value[0]); // Set recognized text
            stopListening();
          }
        };
    
        return () => {
          Voice.destroy().then(Voice.removeAllListeners);
        };
      }, []);

      // Start Listening
  const startListening = async () => {
    try {
      setIsListening(true);
      await Voice.start("en-US");
    } catch (error) {
      console.error(error);
    }
  };

   // Stop Listening
   const stopListening = async () => {
    try {
      setIsListening(false);
      await Voice.stop();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <SafeAreaView>

    <View>
    <View className="flex-row items-center p-4 bg-white shadow-md">
      <Ionicons name="location-outline" size={24} color="black" />
      <Text className="ml-2 text-lg font-bold">Kaloor, Kochi</Text>
    </View>


    <View className="flex flex-row items-center border-2 border-gray-300 rounded-xl w-[90%] mx-auto my-4 p-2">
        <Feather name="search" size={20} color="black" />
      <TextInput
        placeholder="Search..."
        className="flex-1 text-base pl-3"
        value={query}
        onChangeText={setQuery}
      />
      <TouchableOpacity onPress={startListening}>

      <MaterialIcons name="keyboard-voice" size={20} color="black" />
      </TouchableOpacity>
    </View>
    

      <Text className='text-red-600'>Home</Text>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})