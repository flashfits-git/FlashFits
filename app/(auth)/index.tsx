import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
// import {googleLogin} from '../api/auth';
import { FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    // const redirectUri = AuthSession.makeRedirectUri({
    //     native: 'com.anonymous.FlashFits:/oauth2redirect/google',
    //   });
    const redirectUri = 'https://auth.expo.dev/@shubhamexpo7/FlashFits';

    // console.log("🔁 Redirect URI:", redirectUri);
    
    const [request, response, promptAsync] = Google.useAuthRequest(
      {
        clientId: '38756562066-okgjrlcfekdntca9af6cps7bgknc0dhr.apps.googleusercontent.com',
        redirectUri,
        scopes: ['profile', 'email'],
      },
      {
        useProxy: true, // ✅ MUST go in second object
      }
    );

      useEffect(() => {
        const getUserInfo = async () => {
          if (response?.type === 'success') {
            const { authentication } = response;
      
            // Fetch user info
            const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
              headers: {
                Authorization: `Bearer ${authentication?.accessToken}`,
              },
            });
      
            const user = await userInfoResponse.json();
      
            console.log('User Info:', user); // You’ll get name, email, picture
      
            // Example: save in secure store or send to backend
            await SecureStore.setItemAsync('user_email', user.email);
            await SecureStore.setItemAsync('user_name', user.name);
          }
        };
      
        getUserInfo();
      }, [response]);
      
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    Alert.alert('Login Success', `Welcome, ${email}`);
  };

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <Text className="text-3xl font-bold text-center mb-8">Login to FlashFits</Text>

      <TextInput
        placeholder="Email"
        className="border border-gray-300 rounded-xl px-4 py-3 text-base mb-4"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        className="border border-gray-300 rounded-xl px-4 py-3 text-base mb-4"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity className="bg-black py-3 rounded-xl items-center mb-6" onPress={handleLogin}>
        <Text className="text-white text-base font-semibold">Log In</Text>
      </TouchableOpacity>

      <Text className="text-center text-gray-500 mb-4">or continue with</Text>

      <View className="space-y-6">
        {/* Google Button */}
        <TouchableOpacity
        disabled={!request}
        onPress={() => promptAsync()}
        className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 my-2 bg-white">
          <AntDesign name="google" size={20} color="#DB4437" style={{ marginRight: 10 }} />
          <Text
            
          className="text-base text-gray-800">Continue with Google</Text>
        </TouchableOpacity>

        {/* Facebook Button */}
        <TouchableOpacity className="flex-row items-center border border-blue-600 rounded-xl px-4 py-3 my-2 bg-blue-600">
          <FontAwesome name="facebook" size={20} color="white" style={{ marginRight: 10 }} />
          <Text className="text-base text-white">Continue with Facebook</Text>
        </TouchableOpacity>

        {/* Phone Button */}
        <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 my-2 bg-white">
          <Entypo name="phone" size={20} color="#222" style={{ marginRight: 10 }} />
          <Text className="text-base text-gray-800">Continue with Phone</Text>
        </TouchableOpacity>
      </View>

      <Link href="/(auth)/signup" className="text-center text-gray-600 mt-6">
        Don’t have an account? <Text className="font-bold text-black">Sign up</Text>
      </Link>
    </View>
  );
}
