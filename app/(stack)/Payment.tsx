import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import HeaderCumAddressSection from '../../components/CheckoutComponents/HeaderCumAddressSection';
import ReviewItemCardsSection from '../../components/CheckoutComponents/ReviewItemCardsSection';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const maxSlide = width * 0.7;

const SlideToPay = ({ label, onComplete }: { label: string; onComplete: () => void }) => {
  const slideAnimation = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0 && gestureState.dx <= maxSlide) {
          slideAnimation.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx >= maxSlide * 0.7) {
          Animated.timing(slideAnimation, {
            toValue: maxSlide,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onComplete();
            slideAnimation.setValue(0);
          });
        } else {
          Animated.timing(slideAnimation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.slideToPayContainer}>
<LinearGradient
  colors={['#25834F', '#31a263']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={styles.slideTrack}
>
  <Animated.View
    style={[styles.slideThumb, { transform: [{ translateX: slideAnimation }] }]}
    {...panResponder.panHandlers}
  >
    <View style={styles.slideArrows}>
      <Ionicons name="chevron-forward" size={18} color="#000" />
      <Ionicons name="chevron-forward" size={18} color="#000" />
    </View>
  </Animated.View>
  <Text style={styles.slideText}>{label}</Text>
</LinearGradient>

    </View>
  );
};

const CartScreen = () => {
  const [activeTab, setActiveTab] = useState<'TryandBuy' | 'Payment'>('TryandBuy');

  const handlePaymentComplete = () => {
    alert('Processing payment...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <HeaderCumAddressSection />

      <View style={styles.savingsBanner}>
        <Text style={styles.savingsText}>₹23 saved! FREE DELIVERY applied on this order</Text>
      </View>

      {/* Separated Tab Selector */}
      <View style={styles.tabSelector}>
        
<TouchableOpacity
  onPress={() => setActiveTab('TryandBuy')}
  style={styles.tabButton}
  activeOpacity={0.9}
>
  {activeTab === 'TryandBuy' && (
    <LinearGradient
      colors={['#ddc2ff', '#ffdcf1']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={[StyleSheet.absoluteFill, { borderRadius: 60 }]}
    />
  )}

  {/* Flex Row Container */}
  <View style={styles.flexRow}>
    <MaterialIcons name="auto-fix-high" size={18} color="black" style={styles.icon} />

    <Text
      style={[
        styles.tabText,
        activeTab === 'TryandBuy' && styles.activeTabText,
      ]}
    >
      Try then Buy.
    </Text>
  </View>
</TouchableOpacity>


        <TouchableOpacity
          onPress={() => setActiveTab('Payment')}
          style={[
            styles.tabButton,
            activeTab === 'Payment' && styles.activeTabBackground,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Payment' && styles.activeTabText1,
            ]}
          >
            Pay Order
          </Text>
        </TouchableOpacity>

      </View>

      <View style={styles.containerCard}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <ReviewItemCardsSection />
        </ScrollView>
      </View>
      {/* Slide Sections */}
      {activeTab === 'Payment' && (
        <>
          <View style={styles.paymentMethodContainer}>
            <View style={styles.paymentMethod}>
              <View style={styles.paymentMethodLeft}>
                <View style={styles.googlePayIcon}>
                  {/* <Image source={require('../../assets/images/1.jpg')} style={styles.googlePayImage} /> */}
                  <Image source={require('../../assets/images/paymentIcons/icons8-google-pay-700.png')} style={styles.googlePayImage} />

                </View>
                <View>
                  <Text style={styles.payUsingText}>Pay using</Text>
                  <Text style={styles.googlePayText}>Google Pay</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.changeButton}>
                <Text style={styles.changeButtonText}>Change</Text>
                <MaterialIcons name="keyboard-arrow-right" size={20} color="#FF6B00" />
              </TouchableOpacity>
            </View>
          </View>
          <SlideToPay label="Slide to Pay | ₹663" onComplete={handlePaymentComplete} />
        </>
      )}

      {activeTab === 'TryandBuy' && (
        <>
                  <View style={styles.paymentMethodContainer}>
            <View style={styles.paymentMethod}>
              <View style={styles.paymentMethodLeft}>
                <View style={styles.googlePayIcon}>
                  <Image source={require('../../assets/images/paymentIcons/icons8-google-pay-700.png')} style={styles.googlePayImage} />
                </View>
                <View>
                  <Text style={styles.payUsingText}>Pay using</Text>
                  <Text style={styles.googlePayText}>Delivery Charge |  ₹45</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.changeButton}>
                <Text style={styles.changeButtonText}>Change</Text>
                <MaterialIcons name="keyboard-arrow-right" size={20} color="#FF6B00" />
              </TouchableOpacity>
            </View>
          </View>
        <SlideToPay label="DELIVER THE ORDER" onComplete={handlePaymentComplete} />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  containerCard: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10, paddingTop: 12 },
  scrollContent: { paddingBottom: 24 },

  savingsBanner: {
    // backgroundColor: '#0D1F23',
    paddingVertical: 7,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  savingsText: { color: '#31a263', fontSize: 12, fontWeight: '500',     fontFamily:'Montserrat' },

  paymentMethodContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  paymentMethod: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentMethodLeft: { flexDirection: 'row', alignItems: 'center' },
  googlePayIcon: {
    // width: 10,
    // height: 10,
    // // borderRadius: 20,
    // // backgroundColor: '#f2f2f2',
    // alignItems: 'center',
    // justifyContent: 'center',
    marginRight: 12,
  },
  googlePayImage: { width: 40, height: 30 },
  payUsingText: { fontSize: 13, color: '#666' },
  googlePayText: { fontSize: 16, fontWeight: '600', color: '#000' },
  changeButton: { flexDirection: 'row', alignItems: 'center' },
  changeButtonText: { fontSize: 16, fontWeight: '600', color: '#000' },

  slideToPayContainer: { padding: 16, backgroundColor: '#fff' },
  slideTrack: {
    height: 70,
    // backgroundColor: '#25834F',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  slideThumb: {
    position: 'absolute',
    left: 5,
    width: 56,
    height: 56,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  slideArrows: { flexDirection: 'row', alignItems: 'center' },
  slideText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  button1: { backgroundColor: '#000', paddingVertical: 15, paddingHorizontal: 20 },
  buttonText1: { margin: 4, color: '#fff', fontWeight: 'bold' },
  buttonText2: { margin: 4, color: '#fff', fontWeight: 'bold', fontSize: 20 },

  // Tab Selector Section
  tabSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    // backgroundColor: '#fff',
    paddingVertical: 2,
    borderRadius:60,
    margin:7
  },
  tabButton: {
    width: '50%',
    paddingVertical: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:60,
    margin:3
  },
  activeTabBackground: {
    backgroundColor: '#000',
  },
  activeTabBackground1: {
    // width: '50%',
    // paddingVertical: 10,
    // justifyContent: 'center',

  },
  tabText: {
    fontSize: 16,
    color: '#000',
    fontFamily:'Montserrat' 
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',

  },
  flexRow: {
  flexDirection: 'row',
  alignItems: 'center',
},

icon: {
  marginRight: 6,
},

  activeTabText1: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CartScreen;
