import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Modalize } from 'react-native-modalize';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HowFlashFitsWorks = () => {


  return (
    <View style={styles.container}>
      <TouchableOpacity  style={styles.button}>
        <Text style={styles.buttonText}>How FlashFits Works?</Text>
      </TouchableOpacity>

      <Modalize ref={modalRef} snapPoint={450} modalHeight={450}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalTitle}>How FlashFits Works?</Text>

          <View style={styles.step}>
            <Ionicons name="pricetag-outline" size={38} color="#0E8C7F" style={styles.icon} />
            <View style={styles.textWrap}>
              <Text style={styles.stepTitle}>Try at ₹0</Text>
              <Text style={styles.stepDesc}>Order multiple styles/sizes with no upfront cost.</Text>
            </View>
          </View>

          <View style={styles.step}>
            <Ionicons name="rocket-outline" size={38} color="#0E8C7F" style={styles.icon} />
            <View style={styles.textWrap}>
              <Text style={styles.stepTitle}>Get in 60-min or Schedule</Text>
              <Text style={styles.stepDesc}>
                Get your selection delivered in 60 minutes or at your chosen time.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <Ionicons name="card-outline" size={38} color="#0E8C7F" style={styles.icon} />
            <View style={styles.textWrap}>
              <Text style={styles.stepTitle}>Try First, Pay Later</Text>
              <Text style={styles.stepDesc}>
                Only pay for what you keep—discounts auto-applied.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <Ionicons name="refresh-circle-outline" size={38} color="#0E8C7F" style={styles.icon} />
            <View style={styles.textWrap}>
              <Text style={styles.stepTitle}>Instant Returns</Text>
              <Text style={styles.stepDesc}>
                Return what you don’t want instantly, no questions asked.
              </Text>
            </View>
          </View>
        </ScrollView>
      </Modalize>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: { backgroundColor: '#0E8C7F', borderRadius: 10, padding: 15 },
  buttonText: { color: 'white', fontSize: 18 },
  modalContent: { padding: 24 },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 22, color: '#131313' },
  step: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 18 },
  icon: { marginRight: 16 },
  textWrap: { flex: 1 },
  stepTitle: { fontSize: 17, fontWeight: '600', color: '#0E8C7F' },
  stepDesc: { fontSize: 15, color: '#555' },
});

export default HowFlashFitsWorks;
