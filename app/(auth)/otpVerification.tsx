import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Vibration } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { phoneLogin } from '@/app/api/auth';
import { saveToken, saveUserId } from '@/app/utilities/secureStore';
import { useRouter } from 'expo-router';

const router = useRouter();

const OTPInput = () => {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputs = useRef<TextInput[]>([]);
  const navigation = useNavigation();
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const { phone } = useLocalSearchParams();

  useEffect(() => {
    // Fade in animation on mount
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const shakeInputs = () => {
    Vibration.vibrate(100);
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleChange = (text: string, index: number) => {
    if (error) setError(false);
    
    if (text.length > 1) {
      text = text.slice(-1);
    }
    
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    if (text && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
    }
    
    // Auto-verify when all digits are entered
    if (text && index === otp.length - 1) {
      const fullOtp = [...newOtp];
      if (fullOtp.every(digit => digit !== '')) {
        setTimeout(() => verifyOtp(fullOtp.join('')), 500);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (otpCode?: string) => {
    try {
      setIsLoading(true);
      const enteredOtp = otpCode || otp.join('');
      
      if (enteredOtp.length !== 5) {
        setError(true);
        shakeInputs();
        return;
      }

      const response = await phoneLogin({ phoneNumber: phone });
      console.log(response);
      await saveToken('token', response.token);
      await saveUserId('userId', response.userId);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('OTP verification failed:', error);
      setError(true);
      shakeInputs();
      setOtp(['', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      setTimer(30);
      setOtp(['', '', '', '', '']);
      setError(false);
      inputs.current[0]?.focus();
      console.log('Resend OTP API call goes here');
      // Add your resend OTP API call here
    } catch (error) {
      console.error('Resend OTP failed:', error);
    } finally {
      setIsResending(false);
    }
  };

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Animated.View style={[styles.wrapper, { opacity: fadeAnimation }]}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackButtonPress}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Verify Phone Number</Text>
          <Text style={styles.headerSubtitle}>Code sent to +91-{phone}</Text>
        </View>
        
        <View style={styles.phoneIcon}>
          <Text style={styles.phoneIconText}>📱</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>We've sent a 5-digit code to your phone</Text>

          <Animated.View 
            style={[
              styles.otpContainer, 
              { transform: [{ translateX: shakeAnimation }] }
            ]}
          >
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={[
                  styles.otpInput,
                  error && styles.errorBorder,
                  digit !== '' && styles.filledInput,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                ref={(ref) => (inputs.current[index] = ref!)}
                editable={!isLoading}
                selectTextOnFocus
              />
            ))}
          </Animated.View>

          {error && (
            <Animated.View style={styles.errorContainer}>
              <Text style={styles.errorText}>❌ Invalid code. Please try again.</Text>
            </Animated.View>
          )}

          <View style={styles.timerContainer}>
            {timer > 0 ? (
              <Text style={styles.timerText}>
                Resend code in {formatTime(timer)}
              </Text>
            ) : (
              <TouchableOpacity 
                onPress={handleResendOtp} 
                disabled={isResending}
                style={styles.resendButton}
              >
                <Text style={styles.resendText}>
                  {isResending ? 'Sending...' : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.verifyButton,
              (isLoading || otp.join('').length !== 5) && styles.disabledButton
            ]}
            onPress={() => verifyOtp()}
            disabled={isLoading || otp.join('').length !== 5}
          >
            <Text style={styles.verifyButtonText}>
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleBackButtonPress}
          >
            <Text style={styles.secondaryButtonText}>Change Phone Number</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default OTPInput;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#f8fafc',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backArrow: {
    fontSize: 20,
    color: '#334155',
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    fontFamily: 'Montserrat',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
    fontFamily: 'Montserrat',
  },
  phoneIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneIconText: {
    fontSize: 24,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 50,
    fontFamily: 'Montserrat',
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  otpInput: {
    width: 56,
    height: 56,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filledInput: {
    borderColor: '#28282892',
    backgroundColor: '#f2f2f28d',
    transform: [{ scale: 1.05 }],
  },
  errorBorder: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#ef4444db',
    fontSize: 14,
    fontFamily: 'Montserrat',
    textAlign: 'center',
    fontWeight: '500',
  },
  timerContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 16,
    color: '#64748b',
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendText: {
    fontSize: 16,
    color: '#131313ff',
    fontFamily: 'Montserrat',
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingBottom: 60,
    gap: 12,
    marginBottom:40
  },
  verifyButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#000000ff',
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    color: '#ffffffff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontFamily: 'Montserrat',
    fontWeight: '500',
  },
});
