import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function PhoneLogin() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');

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

  const handleSendOTP = async () => {
    try {
      console.log('OTP sent successfully');
      router.push({
        pathname: '/(auth)/otpVerification',
        params: { phone: phoneNumber },
      });
    } catch (error) {
      console.error('Failed to send OTP', error);
    }
  };

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
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/loaders/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Phone Input Section */}
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <View style={styles.countrySelector}>
              <Image
                source={{ uri: 'https://flagcdn.com/w40/in.png' }}
                style={styles.flag}
              />
              <Text style={styles.countryCode}>+91</Text>
              <AntDesign name="down" size={12} color="#666" />
            </View>
            
            <View style={styles.divider} />
            
            <TextInput
              style={styles.phoneInput}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '');
                if (cleaned.length <= 10) {
                  setPhoneNumber(cleaned);
                }
              }}
            />
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            phoneNumber.length === 10 ? styles.continueButtonActive : styles.continueButtonDisabled,
          ]}
          disabled={phoneNumber.length !== 10}
          onPress={handleSendOTP}
        >
          <Text style={[
            styles.continueButtonText,
            phoneNumber.length === 10 ? styles.continueButtonTextActive : styles.continueButtonTextDisabled
          ]}>
            Continue
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login Buttons */}
        <View style={styles.socialContainer}>
          <TouchableOpacity
            disabled={!request}
            onPress={() => promptAsync()}
            style={styles.socialButton}
          >
            <AntDesign name="google" size={20} color="#000000ff" />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
            <FontAwesome name="facebook" size={20} color="#030303ff" />
            <Text style={styles.socialButtonText}>Continue with Facebook</Text>
          </TouchableOpacity>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.08,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: width * 0.6,
    height: 80,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: 'Montserrat',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Montserrat',
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  flag: {
    width: 24,
    height: 18,
    borderRadius: 3,
    marginRight: 8,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 8,
    fontFamily: 'Montserrat',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E5E5',
    marginRight: 16,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'Montserrat',
    fontWeight: '500',
  },
  continueButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  continueButtonActive: {
    backgroundColor: '#181919ff',
  },
  continueButtonDisabled: {
    backgroundColor: '#F5F5F5',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  continueButtonTextActive: {
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: '#999',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#999',
    fontFamily: 'Montserrat',
  },
  socialContainer: {
    marginBottom: 32,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  facebookButton: {
    marginBottom: 0,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 12,
    fontFamily: 'Montserrat',
  },
  termsContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  termsText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'Montserrat',
  },
  termsLink: {
    color: '#1d1e1eff',
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
});
