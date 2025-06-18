import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { FontAwesome, AntDesign  } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

export default function PhoneLogin() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [syncContacts, setSyncContacts] = useState(true);

  const redirectUri = 'https://auth.expo.dev/@shubhamexpo7/FlashFits';

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      clientId: '38756562066-okgjrlcfekdntca9af6cps7bgknc0dhr.apps.googleusercontent.com',
      redirectUri,
      scopes: ['profile', 'email'],
    },
    {
      useProxy: true,
    }
  );

  useEffect(() => {
    const getUserInfo = async () => {
      if (response?.type === 'success') {
        const { authentication } = response;
        const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: {
            Authorization: `Bearer ${authentication?.accessToken}`,
          },
        });

        const user = await userInfoResponse.json();
        console.log('User Info:', user);
        await SecureStore.setItemAsync('user_email', user.email);
        await SecureStore.setItemAsync('user_name', user.name);
      }
    };

    getUserInfo();
  }, [response]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Enter your phone number to proceed.</Text>

        <View style={styles.inputContainer}>
          <View style={styles.countryRow}>
            <Image
              source={{ uri: 'https://flagcdn.com/w40/in.png' }}
              style={styles.flag}
            />
            <Text style={styles.countryName}>India</Text>
          </View>

          <View style={styles.phoneRow}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.input}
              // placeholder="0 00 00 00 00"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, ''); // only digits
                if (cleaned.length <= 10) {
                  setPhoneNumber(cleaned);
                }
              }}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            phoneNumber.length === 10 ? {} : styles.buttonDisabled,
          ]}
          disabled={phoneNumber.length !== 10}
          onPress={() => router.push({ pathname: '/(auth)/otpVerification', params: { phone: phoneNumber } })}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>


        <Text style={styles.termsText}>
          By clicking, I accept the <Text style={styles.linkText}>Terms & Conditions</Text> &{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>

        {/* Google Login Button */}
          <View style={{ marginTop: 10, width:'100%',alignItems: 'center'  }}>
            <TouchableOpacity
              disabled={!request}
              onPress={() => promptAsync()}
              style={[styles.socialButton, styles.googleButton]}
            >
              <AntDesign  name="google" size={20} color="#DB4437" style={{ marginRight: 10 }} />
              <Text style={[styles.socialButtonText, styles.googleText]}>
                Continue with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
              <FontAwesome name="facebook" size={20} color="white" style={{ marginRight: 10 }} />
              <Text style={[styles.socialButtonText, styles.facebookText]}>
                Continue with Facebook
              </Text>
            </TouchableOpacity>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fdfdfd',
  },
  container: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Montserrat',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Montserrat',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  flag: {
    width: 24,
    height: 18,
    marginRight: 8,
    borderRadius: 3,
  },
  countryName: {
    fontSize: 16,
    fontFamily: 'Montserrat',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
    marginBottom: 15,
  },
  countryCode: {
    fontSize: 18,
    marginRight: 10,
    fontFamily: 'Montserrat',
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Montserrat',
  },
  button: {
    // backgroundColor: '#8FD9FB',
    marginTop: 10,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
     height: 70,
    backgroundColor: '#000',
    borderRadius: 20,
    justifyContent: 'center',
  },
  buttonDisabled: {
  opacity: 0.5,
},
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  termsText: {
    marginTop: 15,
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 10,
    fontFamily: 'Montserrat',
  },
  linkText: {
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'Montserrat',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 8,
    width: '90%',
    justifyContent: 'center',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  facebookButton: {
    backgroundColor: '#74b0ff',
    borderWidth: 1,
    borderColor: '#74b0ff',
  },
  socialButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat',
  },
  googleText: {
    color: '#333',
    fontFamily: 'Montserrat',
  },
  facebookText: {
    color: '#fff',
  },
});
