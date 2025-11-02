import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
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
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { joinOrderRoom, listenOrderUpdates, removeOrderListeners } from '@/app/sockets/order.socket';

// Helper function to format time (MM:SS)
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Timer Component
const TrialPhaseTimer = ({ trialPhaseStart, trialPhaseDuration }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // Calculate initial time left
    const startTime = new Date(trialPhaseStart).getTime();
    const durationSeconds = trialPhaseDuration * 60; // Convert minutes to seconds
    const endTime = startTime + durationSeconds * 1000;
    
    const updateTimer = () => {
      const now = Date.now();
      const secondsLeft = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeLeft(secondsLeft);
      if (secondsLeft <= 0) {
        clearInterval(interval);
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval
  }, [trialPhaseStart, trialPhaseDuration]);

  if (timeLeft <= 0) return null; // Hide timer when time is up

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>Trial Phase: {formatTime(timeLeft)}</Text>
    </View>
  );
};

// Define mapping for order statuses to steps
const statusToSteps = (orderStatus) => {
  const steps = [
    { id: 'picked', label: 'Picked', completed: false },
    { id: 'in-transit', label: 'In transit', completed: false },
    { id: 'delivered', label: 'Delivered', completed: false },
  ];

  // Update step completion based on orderStatus
  switch (orderStatus) {
    case 'delivered':
      steps[2].completed = true;
    // Fall through to set previous steps
    case 'in-transit':
    case 'try phase':
      steps[1].completed = true;
    // Fall through to set previous steps
    case 'picked':
      steps[0].completed = true;
      break;
    default:
      break;
  }

  return steps;
};

export default function OrderTrackingPage() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [orderStatus, setOrderStatus] = useState({
    current: '',
    estimatedTime: '',
    deliveryType: 'Express Delivery',
    steps: [
      { id: 'picked', label: 'Picked', completed: false },
      { id: 'in-transit', label: 'In transit', completed: false },
      { id: 'delivered', label: 'Delivered', completed: false },
    ],
  });
  const [deliveryPerson, setDeliveryPerson] = useState(null);
  const [trialPhase, setTrialPhase] = useState({
    isActive: false,
    trialPhaseStart: null,
    trialPhaseDuration: 0,
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000); // Simulate remount or reload delay
  }, []);

  useEffect(() => {
    console.log('Joining order room for orderId:', orderId);

    // Join order room and listen for updates
    joinOrderRoom(orderId).then(() => {
      // Listen for order updates
      listenOrderUpdates((updateData) => {
        console.log('Received order update:', updateData);

        // Map backend order status to steps
        const steps = statusToSteps(updateData.orderStatus);

        // Estimate time
        const estimatedTime = updateData.deliveryDistance
          ? `${Math.round(updateData.deliveryDistance * 2)} Mins`
          : 'N/A';

        // Update order status state
        setOrderStatus({
          current: updateData.orderStatus || 'pending',
          estimatedTime,
          deliveryType: updateData.trialPhaseDuration > 0 ? 'Try & Buy' : 'Express Delivery',
          steps,
        });

        // Update delivery person
        setDeliveryPerson({
          name: updateData.deliveryRiderId
            ? `Rider ${updateData.deliveryRiderId.slice(-4)}`
            : 'Assigning Delivery Partner Soon',
          id: updateData.deliveryRiderId || 'N/A',
          avatar: '👤',
        });

        // Update trial phase if duration is provided
        if (updateData.trialPhaseDuration > 0 && updateData.trialPhaseStart) {
          setTrialPhase({
            isActive: true,
            trialPhaseStart: updateData.trialPhaseStart,
            trialPhaseDuration: updateData.trialPhaseDuration,
          });
        }
      });

      // Listen for trialPhaseStart event
      const socket = getSocket();
      socket.on('trialPhaseStart', (data) => {
        console.log('Received trialPhaseStart:', data);
        if (data.orderId === orderId) {
          setTrialPhase({
            isActive: true,
            trialPhaseStart: data.trialPhaseStart,
            trialPhaseDuration: data.trialPhaseDuration,
          });
        }
      });
    });

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up order listeners for orderId:', orderId);
      const socket = getSocket();
      socket.off('trialPhaseStart');
      removeOrderListeners();
    };
  }, [orderId]);

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Track OrderId_{orderId.slice(-5).toUpperCase()}
          </Text>
        </View>
      </View>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
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

          {/* Status Card */}
          <LinearGradient
            colors={['#000', '#000', '#000']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.statusCard}
          >
            <View style={styles.statusHeader}>
              <View style={styles.statusLeft}>
                <View style={styles.packageIcon}>
                  <Package size={24} color="#fff" />
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
                        <Clock size={18} color="#fff" />
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

            {/* Trial Phase Timer */}
            {trialPhase.isActive && (
              <TrialPhaseTimer
                trialPhaseStart={trialPhase.trialPhaseStart}
                trialPhaseDuration={trialPhase.trialPhaseDuration}
              />
            )}
          </LinearGradient>
        </View>

        {/* Delivery Person */}
        {deliveryPerson ? (
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryRow}>
              <View style={styles.deliveryLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarIcon}>{deliveryPerson.avatar}</Text>
                </View>
                <View>
                  <Text style={styles.deliveryName}>{deliveryPerson.name}</Text>
                  <Text style={styles.deliveryId}>{deliveryPerson.id}</Text>
                </View>
              </View>
              {deliveryPerson.id !== 'N/A' && (
                <TouchableOpacity style={styles.callButton}>
                  <Phone size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryRow}>
              <View style={styles.deliveryLeft}>
                <Text style={styles.deliveryName}>Assigning Delivery Partner Soon</Text>
              </View>
            </View>
          </View>
        )}

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
        {orderStatus.deliveryType === 'Try & Buy' && (
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
        )}
      </ScrollView>
    </>
  );
}

// Your provided styles with timer styles added
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
    height: 480,
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 20,
    padding: 18,
    paddingBottom: 26,
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    margin: 8,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  packageIcon: {
    backgroundColor: '#333',
    borderRadius: 24,
    padding: 8,
  },
  arrivalText: { fontSize: 16, fontWeight: '700', color: '#3D3D3D' },
  deliveryType: { fontSize: 13, fontWeight: '500', color: '#3D3D3D' },
  menuDots: { fontSize: 20, color: '#d1d5db' },
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
  stepLine: {
    flex: 1,
    height: 3,
    marginHorizontal: 4,
    borderRadius: 2,
    alignSelf: 'center',
  },
  stepCompleted: { backgroundColor: '#50C878' },
  stepIncomplete: { backgroundColor: '#333' },
  stepLabelActive: { color: '#50C878' },
  stepLabelInactive: { color: '#9ca3af' },
  lineActive: { backgroundColor: '#50C878' },
  lineInactive: { backgroundColor: '#3f3f46' },
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
  // Timer styles
  timerContainer: {
    marginTop: 16,
    backgroundColor: '#333',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#50C878',
  },
});