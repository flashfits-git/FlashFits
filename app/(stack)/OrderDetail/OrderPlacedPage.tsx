import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl 
} from 'react-native';
import {
  MapPin,
  Package,
  CheckCircle,
  Clock,
  Phone,
  MessageCircle,
  ChevronRight,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';


export default function OrderTrackingPage() {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
  setRefreshing(true);
  setTimeout(() => {
    setRefreshing(false);
  }, 1000); // Simulate remount or reload delay
}, []);
    
    
    const [orderStatus] = useState({
      current: 'in-transit',
      estimatedTime: '8 Mins',
      deliveryType: 'Express Delivery',
      steps: [
        { id: 'picked', label: 'Picked', completed: true },
        { id: 'in-transit', label: 'In transit', completed: true },
        { id: 'delivered', label: 'Delivered', completed: false },
      ],
    });

    const [deliveryPerson] = useState({
      name: 'Kylo Ren',
      id: 'BF 70126',
      avatar: '👤',
    });

  return (


    <>      
      <View style={styles.header}>
        <View style={styles.headerInner} >
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backArrow} >←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Track Order</Text>
        </View>
      </View>
    <ScrollView style={styles.container} 
    showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#3b82f6']} // Android loader color
          tintColor="#3b82f6" // iOS loader color
        />
      } 
    >


      {/* Map Section */}
      <View style={styles.mapSection}>
        <View style={styles.mapOverlay} />

        <View style={[styles.marker, styles.startMarker]}>
          <MapPin size={20} color="#fff" />
        </View>

        <View style={[styles.marker, styles.packageMarker]}>
          <Package size={24} color="#111" />
        </View>

        <View style={[styles.marker, styles.endMarker]}>
          <MapPin size={20} color="#fff" />
        </View>

        <Text style={styles.storeLabel}>Store</Text>
        <Text style={styles.locationLabel}>Your Location</Text>
      </View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View style={styles.statusLeft}>
            <View style={styles.packageIcon}>
              <Package size={24} color="#b45309" />
            </View>
            <View>
              <Text style={styles.arrivalText}>
                Arriving in {orderStatus.estimatedTime}
              </Text>
              <Text style={styles.deliveryType}>{orderStatus.deliveryType}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text style={styles.menuDots}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Steps */}
        <View style={styles.stepsRow}>
          {orderStatus.steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <View style={styles.stepContainer}>
                <View
                  style={[
                    styles.stepCircle,
                    step.completed
                      ? styles.stepCompleted
                      : styles.stepIncomplete,
                  ]}
                >
                  {step.completed ? (
                    <CheckCircle size={18} color="#fff" />
                  ) : (
                    <Clock size={18} color="#9ca3af" />
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    step.completed
                      ? styles.stepLabelActive
                      : styles.stepLabelInactive,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
              {index < orderStatus.steps.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    step.completed ? styles.lineActive : styles.lineInactive,
                  ]}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Delivery Person */}
      <View style={styles.deliveryCard}>
        <View style={styles.deliveryRow}>
          <View style={styles.deliveryLeft}>
            <View style={styles.avatar}>{<Text style={styles.avatarIcon}>{deliveryPerson.avatar}</Text>}</View>
            <View>
              <Text style={styles.deliveryName}>{deliveryPerson.name}</Text>
              <Text style={styles.deliveryId}>{deliveryPerson.id}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <Phone size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.actionButton}>
        <View style={styles.actionLeft}>
          <Package size={20} color="#444" />
          <Text style={styles.actionText}>View Package Information</Text>
        </View>
        <ChevronRight size={20} color="#9ca3af" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <View style={styles.actionLeft}>
          <MessageCircle size={20} color="#444" />
          <Text style={styles.actionText}>Facing issue? Chat with Senz Staff</Text>
        </View>
        <ChevronRight size={20} color="#9ca3af" />
      </TouchableOpacity>

      {/* Try & Buy */}
      <View style={styles.tryBuy}>
        <View style={styles.tryBuyRow}>
          <View style={styles.tryBuyIcon}>
            <CheckCircle size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.tryBuyTitle}>Try & Buy Available</Text>
            <Text style={styles.tryBuyDesc}>
              Try your items at home before making the final decision. Return
              unwanted items with the delivery partner.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },

  header: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: { marginRight: 12 },
  backArrow: { fontSize: 22, color: '#374151' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },

  mapSection: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 20,
    height: 250,
    backgroundColor: '#f3f4f6',
    overflow: 'hidden',
    position: 'relative',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#dbeafe',
    opacity: 0.5,
  },
  marker: {
    position: 'absolute',
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  startMarker: {
    top: 40,
    left: 60,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#22c55e',
  },
  packageMarker: {
    top: 110,
    left: 120,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#facc15',
  },
  endMarker: {
    bottom: 50,
    right: 40,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#22c55e',
  },
  storeLabel: {
    position: 'absolute',
    top: 90,
    left: 40,
    backgroundColor: '#fff',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    fontWeight: '500',
  },
  locationLabel: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#fff',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    fontWeight: '500',
  },

  statusCard: {
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#fde68a',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  packageIcon: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  arrivalText: { fontSize: 16, fontWeight: '700', color: '#111' },
  deliveryType: { fontSize: 13, fontWeight: '500', color: '#444' },
  menuDots: { fontSize: 20, color: '#444' },

  stepsRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepContainer: { alignItems: 'center' },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCompleted: { backgroundColor: '#3b82f6' },
  stepIncomplete: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db' },
  stepLabel: { marginTop: 6, fontSize: 11, fontWeight: '500' },
  stepLabelActive: { color: '#111' },
  stepLabelInactive: { color: '#6b7280' },
  stepLine: { flex: 1, height: 2, marginHorizontal: 6, borderRadius: 2 },
  lineActive: { backgroundColor: '#3b82f6' },
  lineInactive: { backgroundColor: '#e5e7eb' },

  deliveryCard: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  deliveryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deliveryLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#facc15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: { fontSize: 22 },
  deliveryName: { fontSize: 16, fontWeight: '700', color: '#111' },
  deliveryId: { fontSize: 13, color: '#6b7280' },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionButton: {
    marginTop: 12,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  actionLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  actionText: { fontWeight: '600', color: '#111' },

  tryBuy: {
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e9d5ff',
    backgroundColor: '#faf5ff',
  },
  tryBuyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  tryBuyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#a855f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tryBuyTitle: { fontWeight: '700', color: '#6b21a8', marginBottom: 4 },
  tryBuyDesc: { fontSize: 13, color: '#7e22ce' },
});
