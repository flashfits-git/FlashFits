import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
// import {googleLogin} from '../api/auth';
import { FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import PhoneLogin from '../../components/AuthetificationComponents/Login'
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {

  return (
    <PhoneLogin/>
  );
}
