import { joinOrderRoom, listenOrderUpdates, removeOrderListeners } from '@/app/sockets/order.socket';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import {
  CheckCircle,
  ChevronRight,
  Clock,
  MapPin,
  MessageCircle,
  Package,
  Phone,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { getSocket } from '../../config/socket';
import ConfirmSelectionModal from './ConfirmSelectionModal';


// Helper function to format time (MM:SS)
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Timer Component
const TrialPhaseTimer = ({ trialPhaseStart, trialPhaseDuration }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
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

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [trialPhaseStart, trialPhaseDuration]);

  if (timeLeft <= 0) return null;

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>Trial Phase: {formatTime(timeLeft)}</Text>
    </View>
  );
};

// Item Selection Component
const ItemSelection = ({ items, onUpdateItem }) => {
  return (
    <View style={styles.itemSelectionContainer}>
      <Text style={styles.itemSelectionTitle}>Select Items to Keep or Return</Text>
      {items.map((item, index) => (
        <View key={item._id} style={styles.itemCard}>
          {/* Image and Title Section */}
          <View style={styles.itemHeader}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemSize}>Size: {item.size}</Text>
              <Text style={styles.itemPrice}>₹{item.price} × {item.quantity}</Text>
            </View>
          </View>

          {/* Action Buttons Section */}
          <View style={styles.itemActions}>
            <TouchableOpacity
              style={[
                styles.itemButton,
                item.tryStatus === 'keep' && styles.itemButtonKeep,
              ]}
              onPress={() => onUpdateItem(index, 'keep', null)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.itemButtonText,
                item.tryStatus === 'keep' && styles.itemButtonTextActive
              ]}>✓ Keep</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.itemButton,
                item.tryStatus === 'return' && styles.itemButtonReturn,
              ]}
              onPress={() => onUpdateItem(index, 'return', item.returnReason)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.itemButtonText,
                item.tryStatus === 'return' && styles.itemButtonTextActive
              ]}>↩ Return</Text>
            </TouchableOpacity>
          </View>

          {/* Return Reason Input */}
          {item.tryStatus === 'return' && (
            <TextInput
              style={styles.returnReasonInput}
              placeholder="Why are you returning this item?"
              placeholderTextColor="#6b7280"
              value={item.returnReason || ''}
              onChangeText={(text) => onUpdateItem(index, 'return', text)}
              multiline
              numberOfLines={2}
            />
          )}
        </View>
      ))}
    </View>
  );
};
// Define mapping for order statuses to steps
const statusToSteps = (orderStatus) => {
  const steps = [
    { id: 'picked', label: 'Picked', completed: false },
    { id: 'in-transit', label: 'In transit', completed: false },
    { id: 'Arrived', label: 'Arrived', completed: false },
  ];

  switch (orderStatus) {
    case 'arrived at delivery':
      steps[2].completed = true;
    case 'out_for_delivery':
      steps[1].completed = true;
    case 'packed':
      steps[0].completed = true;
      break;
    default:
      break;
  }

  return steps;
};

export default function OrderTrackingPage() {
  const [trialPhaseComplete, setTrialPhaseComplete] = useState(false);
  const modalRef = useRef<Modalize>(null);
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
  const [otp, setOtp] = useState('');
  const [items, setItems] = useState([]);
  const [finalBilling, setFinalBilling] = useState({
    baseAmount: 0,
    deliveryCharge: 0,
    tryAndBuyFee: 0,
    gst: 0,
    discount: 0,
    totalPayable: 0,
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const checkTrialPhase = async () => {
      const isComplete = await SecureStore.getItemAsync(`trialPhaseComplete_${orderId}`);
      setTrialPhaseComplete(isComplete === "true");
    };

    checkTrialPhase();
  }, [orderId]);

  // Update billing based on selected items and trial phase duration
  const updateBilling = useCallback((items, deliveryCharge, trialPhaseStart, trialPhaseDuration) => {
    const baseAmount = items
      .filter((item) => item.tryStatus === 'keep')
      .reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Calculate waiting charge (e.g., ₹10 per minute of trial phase)
    let tryAndBuyFee = 0;
    if (trialPhaseStart && trialPhaseDuration > 0) {
      const startTime = new Date(trialPhaseStart).getTime();
      const currentTime = Date.now();
      const elapsedMinutes = Math.floor((currentTime - startTime) / 1000 / 60);
      tryAndBuyFee = Math.min(elapsedMinutes, trialPhaseDuration) * 10; // ₹10 per minute
    }

    const totalPayable = baseAmount + deliveryCharge + tryAndBuyFee;

    setFinalBilling({
      baseAmount,
      deliveryCharge,
      tryAndBuyFee,
      gst: 0, // Add GST logic if needed
      discount: 0, // Add discount logic if needed
      totalPayable,
    });
  }, []);

  // Handle item status update
  const handleUpdateItem = (index, tryStatus, returnReason) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], tryStatus, returnReason };
    setItems(updatedItems);
    updateBilling(updatedItems, finalBilling.deliveryCharge, trialPhase.trialPhaseStart, trialPhase.trialPhaseDuration);
  };

  // Handle submission (Return or Payment)
  const handleSubmit = (action) => {
    const socket = getSocket();
    socket.emit('submitTrialSelection', {
      orderId,
      items,
      finalBilling,
      action, // 'return' or 'payment'
    });
  };

  useEffect(() => {
    console.log('Joining order room for orderId:', orderId);

    joinOrderRoom(orderId).then(() => {
      listenOrderUpdates((updateData: any) => {
        // console.log('Received order update:', updateData);
        setOtp(updateData?.otp);
        console.log('Otp is:', updateData?.otp);
        const steps = statusToSteps(updateData.orderStatus);
        const estimatedTime = updateData.deliveryDistance
          ? `${Math.round(updateData.deliveryDistance * 2)} Mins`
          : 'N/A';

        setOrderStatus({
          current: updateData.orderStatus || 'pending',
          estimatedTime,
          deliveryType: updateData.trialPhaseDuration > 0 ? 'Try & Buy' : 'Express Delivery',
          steps,
        });

        setDeliveryPerson({
          name: updateData.deliveryRiderId
            ? `Rider ${updateData.deliveryRiderId.slice(-4)}`
            : 'Assigning Delivery Partner Soon',
          id: updateData.deliveryRiderId || 'N/A',
          avatar: '👤',
        });

        if (updateData.items) {
          setItems(updateData.items.map((item) => ({
            ...item,
            tryStatus: item.tryStatus || 'pending',
            returnReason: item.returnReason || null,
          })));
          updateBilling(updateData.items, updateData.deliveryCharge, updateData.trialPhaseStart, updateData.trialPhaseDuration);
        }

        if (updateData.trialPhaseDuration > 0 && updateData.trialPhaseStart) {
          setTrialPhase({
            isActive: true,
            trialPhaseStart: updateData.trialPhaseStart,
            trialPhaseDuration: updateData.trialPhaseDuration,
          });
        }
      });

      const socket = getSocket();
      socket.on('trialPhaseStart', (data) => {
        console.log('Received trialPhaseStartdsfdss:', data);
        // console.log('Order id is:', orderId);
        if (data.orderId === orderId) {
          setTrialPhase({
            isActive: true,
            trialPhaseStart: data.trialPhaseStart,
            trialPhaseDuration: data.trialPhaseDuration,
          });
          updateBilling(items, finalBilling.deliveryCharge, data.trialPhaseStart, data.trialPhaseDuration);
        }
      });
    });

    return () => {
      console.log('Cleaning up order listeners for orderId:', orderId);
      const socket = getSocket();
      socket.off('trialPhaseStart');
      removeOrderListeners();
    };
  }, [orderId, items, finalBilling.deliveryCharge, updateBilling]);

  const hasReturnItems = items.some((item) => item.tryStatus === 'return');
  const allItemsSelected = items.length > 0 && items.every(item => item.tryStatus === 'keep' || item.tryStatus === 'return');

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
        {/* Map Section - Now separate from status card */}
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

        {/* Status Card - Now independent with auto height */}
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

          {trialPhase.isActive && (
            <TrialPhaseTimer
              trialPhaseStart={trialPhase.trialPhaseStart}
              trialPhaseDuration={trialPhase.trialPhaseDuration}
            />
          )}

          {trialPhase.isActive && items.length > 0 && (
            <>
              <ItemSelection items={items} onUpdateItem={handleUpdateItem} />
              <View style={styles.billingContainer}>
                <Text style={styles.billingTitle}>Billing Summary</Text>
                <View style={styles.billingRow}>
                  <Text style={styles.billingLabel}>Base Amount:</Text>
                  <Text style={styles.billingValue}>₹{finalBilling.baseAmount}</Text>
                </View>
                <View style={styles.billingRow}>
                  <Text style={styles.billingLabel}>Delivery Charge:</Text>
                  <Text style={styles.billingValue}>₹{finalBilling.deliveryCharge}</Text>
                </View>
                <View style={styles.billingRow}>
                  <Text style={styles.billingLabel}>Try & Buy Fee:</Text>
                  <Text style={styles.billingValue}>₹{finalBilling.tryAndBuyFee}</Text>
                </View>
                <View style={styles.billingRow}>
                  <Text style={styles.billingLabel}>Total Payable:</Text>
                  <Text style={styles.billingValue}>₹{finalBilling.totalPayable}</Text>
                </View>
              </View>
              {/* //show otp only if return is there*/}
              {hasReturnItems && (
                <View style={styles.billingContainer}>
                  <Text style={styles.billingTitle}>Return OTP:  {otp}</Text>
                </View>
              )}
              <View style={styles.actionButtonsContainer}>
                {/* Show Return button if there are return items */}
                {hasReturnItems && (
                  <TouchableOpacity
                    style={[
                      styles.actionButtonPrimary,
                      (!allItemsSelected || trialPhaseComplete) && { opacity: 0.5 },
                    ]}
                    onPress={() => {
                      if (allItemsSelected && !trialPhaseComplete) {
                        modalRef.current?.open();
                        handleSubmit("return");
                      }
                    }}
                    disabled={!allItemsSelected || trialPhaseComplete}
                  >
                    <Text style={styles.actionButtonText}>
                      {trialPhaseComplete ? "Trial Completed" : "Return Items"}
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Show Payment button only if there are no return items */}
                {!hasReturnItems && (
                  <TouchableOpacity
                    style={[
                      styles.actionButtonPrimary,
                      !allItemsSelected && { opacity: 0.5 },
                    ]}
                    onPress={() => allItemsSelected && handleSubmit('payment')}
                    disabled={!allItemsSelected}
                  >
                    <Text style={styles.actionButtonText}>Proceed to Payment</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </LinearGradient>

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
      <ConfirmSelectionModal
        order={orderId}
        ref={modalRef}
        otp={otp}
        onConfirm={() => {
          handleSubmit("return");
          modalRef.current?.close();
        }}
      />
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
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 18,
    paddingBottom: 26,
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
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
  arrivalText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  deliveryType: { fontSize: 13, fontWeight: '500', color: '#9ca3af' },
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
  stepLabel: { fontSize: 12, marginTop: 6, fontWeight: '600' },
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
    marginBottom: 20,
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
  // Item selection styles - UPDATED
  itemSelectionContainer: {
    marginTop: 16,
  },
  itemSelectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#50C878',
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#3f3f46',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  itemSize: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
    marginTop: 4,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  itemButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#3f3f46',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  itemButtonKeep: {
    backgroundColor: '#1a3a2a',
    borderColor: '#50C878',
  },
  itemButtonReturn: {
    backgroundColor: '#3a1a1a',
    borderColor: '#ef4444',
  },
  itemButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
  },
  itemButtonTextActive: {
    color: '#fff',
  },
  returnReasonInput: {
    backgroundColor: '#3f3f46',
    borderRadius: 10,
    padding: 10,
    color: '#fff',
    fontSize: 13,
    minHeight: 60,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  // Billing styles
  billingContainer: {
    marginTop: 16,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 12,
  },
  billingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#50C878',
    marginBottom: 12,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billingLabel: {
    fontSize: 14,
    color: '#9ca3af',
  },
  billingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  // Action buttons
  actionButtonsContainer: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  actionButtonPrimary: {
    flex: 1,
    backgroundColor: '#50C878',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});