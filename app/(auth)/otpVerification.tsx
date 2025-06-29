import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';

const OTPInput = () => {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputs = useRef<TextInput[]>([]);
  const navigation = useNavigation();

  const { phone } = useLocalSearchParams();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    console.log('Entered OTP:', enteredOtp);
    // Validate OTP here
  };

  const handleResendOtp = () => {
    setTimer(30);
    setOtp(['', '', '', '', '']);
    inputs.current[0]?.focus();
    console.log('Resend OTP API call goes here');
    // Trigger resend OTP logic here (API call)
  };

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackButtonPress}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <View style={styles.textBlock}>
          <Text style={styles.verifyText}>VERIFY DETAILS</Text>
          <Text style={styles.phoneNumber}>OTP sent to +91-{phone}</Text>
        </View>

        <View style={styles.phoneIllustration}>
          <Text style={styles.xText}>X X X X X </Text>
        </View>
      </View>

      {/* OTP Section */}
      <View style={styles.container}>
        <Text style={styles.title}>Enter OTP</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={[styles.otpInput, error && styles.errorBorder]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              ref={(ref) => (inputs.current[index] = ref!)}
            />
          ))}
        </View>

        <Text style={styles.retryText}>
          Didn’t receive the OTP? Retry in {`00:${timer < 10 ? `0${timer}` : timer}`}
        </Text>

        {error && <Text style={styles.errorText}>Wrong code, please try again</Text>}

        {timer === 0 ? (
          <TouchableOpacity style={styles.verifyButton} onPress={handleResendOtp}>
            <Text style={styles.verifyButtonText}>Resend OTP</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
            <Text style={styles.verifyButtonText}>Verify and Proceed</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OTPInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 120,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 24,
    fontFamily: 'Montserrat',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    color: '#000',
    marginHorizontal: 5,
  },
  errorBorder: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'Montserrat',
  },
  retryText: {
    marginTop: 12,
    fontSize: 16,
    color: '#888',
    fontFamily: 'Montserrat',
  },
  verifyButton: {
    marginTop: 10,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#000',
    borderRadius: 20,
    justifyContent: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  topSection: {
    width: '100%',
    backgroundColor: '#f2f8fd',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 120,
  },
  backButton: {
    marginBottom: 12,
  },
  backArrow: {
    fontSize: 24,
    color: '#333',
  },
  textBlock: {
    flex: 1,
    marginLeft: 16,
  },
  verifyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 12,
    color: '#666',
  },
  phoneIllustration: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 100,
    backgroundColor: '#cce0f4',
    borderRadius: 16,
    marginTop: 12,
    marginRight: 20,
    marginBottom: 10,
  },
  xText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1c1c1c',
  },
});
