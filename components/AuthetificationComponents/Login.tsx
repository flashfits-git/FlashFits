import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function PhoneLogin() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(50)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const inputScale = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(cardSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Progress bar animation
    Animated.spring(progressWidth, {
      toValue: phoneNumber.length / 10,
      tension: 50,
      friction: 7,
      useNativeDriver: false,
    }).start();
  }, [phoneNumber]);

  const handleSendOTP = async () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      console.log("OTP sent successfully");
      router.replace({
        pathname: "/(auth)/otpVerification",
        params: { phone: phoneNumber },
      });
    } catch (error) {
      console.error("Failed to send OTP", error);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(inputScale, {
      toValue: 1.02,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(inputScale, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const progressWidthInterpolated = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <LinearGradient
      colors={["#F8FAFC", "#FFFFFF", "#F1F5F9"]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "position"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 60}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Section with Animation */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <View style={styles.logoWrapper}>
              <Image
                source={require("../../assets/loaders/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            {/* <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>
            Enter your phone number to continue
          </Text> */}
          </Animated.View>

          {/* Main Card with Slide Animation */}
          <Animated.View
            style={[
              styles.cardContainer,
              {
                opacity: cardOpacity,
                transform: [{ translateY: cardSlide }],
              },
            ]}
          >
            <View style={styles.card}>
              {/* Phone Input Label */}
              <Text style={styles.inputLabel}>Phone Number</Text>

              {/* Phone Input Section */}
              <Animated.View
                style={[
                  styles.inputContainer,
                  {
                    transform: [{ scale: inputScale }],
                    borderColor: isFocused ? "#1A1A1A" : "#F0F0F0",
                    borderWidth: isFocused ? 2 : 1,
                    backgroundColor: isFocused ? "#FFFFFF" : "#F8FAFC",
                  },
                ]}
              >
                <TouchableOpacity style={styles.countrySelector}>
                  <Image
                    source={{ uri: "https://flagcdn.com/w40/in.png" }}
                    style={styles.flag}
                  />
                  <Text style={styles.countryCode}>+91</Text>
                  <AntDesign name="down" size={12} color="#666" />
                </TouchableOpacity>

                <View style={styles.divider} />

                <TextInput
                  style={styles.phoneInput}
                  placeholder="00000 00000"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9]/g, "");
                    if (cleaned.length <= 10) {
                      setPhoneNumber(cleaned);
                    }
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  maxLength={10}
                />
              </Animated.View>

              {/* Progress Indicator */}
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Progress</Text>
                  <Text style={styles.progressCount}>
                    {phoneNumber.length}/10
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      { width: progressWidthInterpolated },
                    ]}
                  />
                </View>
              </View>

              {/* Continue Button */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  style={[
                    styles.continueButton,
                    phoneNumber.length === 10
                      ? styles.continueButtonActive
                      : styles.continueButtonDisabled,
                  ]}
                  disabled={phoneNumber.length !== 10}
                  onPress={handleSendOTP}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      phoneNumber.length === 10
                        ? ["#1A1A1A", "#2D2D2D"]
                        : ["#F5F5F5", "#F5F5F5"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <Text
                      style={[
                        styles.continueButtonText,
                        phoneNumber.length === 10
                          ? styles.continueButtonTextActive
                          : styles.continueButtonTextDisabled,
                      ]}
                    >
                      Continue
                    </Text>
                    {phoneNumber.length === 10 && (
                      <AntDesign name="arrowright" size={20} color="#FFFFFF" />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>

          {/* Terms Section */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By continuing, you agree to our{" "}
              <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logo: {
    width: width * 0.7,
    height: 70,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    fontFamily: "Montserrat",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    fontFamily: "Montserrat",
  },
  cardContainer: {
    marginBottom: 32,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 12,
    fontFamily: "Montserrat",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 20,
  },
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  flag: {
    width: 28,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  countryCode: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    marginRight: 8,
    fontFamily: "Montserrat",
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: "#E2E8F0",
    marginRight: 16,
  },
  phoneInput: {
    flex: 1,
    fontSize: 17,
    color: "#1A1A1A",
    fontFamily: "Montserrat",
    fontWeight: "600",
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
    fontFamily: "Montserrat",
  },
  progressCount: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
    fontFamily: "Montserrat",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1A1A1A",
    borderRadius: 3,
  },
  continueButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 8,
  },
  continueButtonActive: {
    // Active state handled by gradient
  },
  continueButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Montserrat",
  },
  continueButtonTextActive: {
    color: "#FFFFFF",
  },
  continueButtonTextDisabled: {
    color: "#94A3B8",
  },
  termsContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  termsText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    fontFamily: "Montserrat",
  },
  termsLink: {
    color: "#1A1A1A",
    fontWeight: "700",
    fontFamily: "Montserrat",
  },
});
