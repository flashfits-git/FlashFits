// import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
// import { useState, useEffect } from 'react';
// import { Link } from 'expo-router';
// import {googleLogin} from '../api/auth';
// import { FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import PhoneLogin from '../../components/AuthetificationComponents/Login'
// import * as Google from 'expo-auth-session/providers/google';
// import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
// import * as AuthSession from 'expo-auth-session';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  // Prevent Android back button from navigating back to tabs after logout
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Return true to prevent default behavior (going back to previous screen)
      // This will make the back button do nothing on the login screen,
      // or you can call BackHandler.exitApp() to exit instead
      BackHandler.exitApp();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  return (
    <PhoneLogin />
  );
}
