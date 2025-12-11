import { joinOrderRoom, listenOrderUpdates, removeOrderListeners } from '@/app/sockets/order.socket';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import {
  CheckCircle,
  ChevronRight,
  Clock,
  MessageCircle,
  Package,
  Phone,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import RazorpayCheckout from 'react-native-razorpay';
import { finalpaymentInitiate, finalpaymetVerify, getOrderById } from '../../api/orderApis';
import { getSocket } from '../../config/socket';
import ConfirmSelectionModal from './ConfirmSelectionModal';
import OSMDeliveryMap from './OSMDeliveryMap';
import OrderCompletionScreen from './OrderCompletionScreen';


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
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
    </View>
  );
};

const STATIC_USER = {
  latitude: 12.9716,
  longitude: 77.5946,
};

const STATIC_RIDER = {
  latitude: 12.9352,
  longitude: 77.6245,
};

const ItemSelection = ({ items, onUpdateItem, disabled }) => {
  return (
    <View style={[styles.itemSelectionContainer, disabled && { opacity: 0.4 }]}>
      <Text style={styles.itemSelectionTitle}>Select Items to Keep or Return</Text>

      {items.map((item, index) => (
        <View key={item._id} style={styles.itemCard}>

          {/* IMAGE + TITLE */}
          <View style={styles.itemHeader}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemSize}>Size: {item.size}</Text>
              <Text style={styles.itemPrice}>₹{item.price} × {item.quantity}</Text>
            </View>
          </View>

          {/* ACTION BUTTONS */}
          <View style={styles.itemActions}>

            <TouchableOpacity
              disabled={disabled}
              style={[
                styles.itemButton,
                item.tryStatus === 'keep' && styles.itemButtonKeep,
                disabled && { opacity: 0.5 }
              ]}
              onPress={() => onUpdateItem(index, 'keep', null)}
            >
              <Text style={[
                styles.itemButtonText,
                item.tryStatus === 'keep' && styles.itemButtonTextActive
              ]}>✓ Keep</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={disabled}
              style={[
                styles.itemButton,
                item.tryStatus === 'return' && styles.itemButtonReturn,
                disabled && { opacity: 0.5 }
              ]}
              onPress={() => onUpdateItem(index, 'return', item.returnReason)}
            >
              <Text style={[
                styles.itemButtonText,
                item.tryStatus === 'return' && styles.itemButtonTextActive
              ]}>↩ Return</Text>
            </TouchableOpacity>

          </View>

          {/* REASON INPUT */}
          {item.tryStatus === 'return' && !disabled && (
            <TextInput
              style={styles.returnReasonInput}
              placeholder="Why are you returning this item?"
              placeholderTextColor="#6b7280"
              value={item.returnReason || 'Not Liked'}
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
const statusToSteps = (orderStatus, prevSteps) => {
  // copy previous state to avoid losing completed steps
  const steps = prevSteps
    ? prevSteps.map(s => ({ ...s }))
    : [
      { id: 'picked', label: 'Picked', completed: false },
      { id: 'in-transit', label: 'In transit', completed: false },
      { id: 'Arrived', label: 'Arrived', completed: false },
    ];

  switch (orderStatus) {
    case 'packed':
      steps[0].completed = true;
      break;

    case 'out_for_delivery':
      steps[0].completed = true;
      steps[1].completed = true;
      break;

    case 'arrived at delivery':
      steps[0].completed = true;
      steps[1].completed = true;
      steps[2].completed = true;
      break;

    default:
      // ❗Any other statuses → DO NOTHING. No resets.
      return steps;
  }

  return steps;
};


export default function OrderTrackingPage() {

  const [orderData, setOrderData] = useState(null);
  const [isDelivered, setIsDelivered] = useState(false);
  const [trialPhaseComplete, setTrialPhaseComplete] = useState(false);
  const modalRef = useRef<Modalize>(null);
  const { orderId } = useLocalSearchParams();
  const router = useRouter();
  const [selectedItemsForConfirm, setSelectedItemsForConfirm] = useState([]);
  const [isPackageOpen, setIsPackageOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [orderStatus, setOrderStatus] = useState({
    current: '',
    estimatedTime: '',
    deliveryType: 'Try and Buy',
    steps: [
      { id: 'picked', label: 'Picked', completed: false },
      { id: 'in-transit', label: 'In transit', completed: false },
      { id: 'arrived', label: 'Arrived', completed: false },
    ],
  });
  // console.log(orderStatus, 'orderStatusorderStatus');

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
    returnCharge: 0,
  });

  // ⏱ Calculate Try & Buy Fee Based on Time Difference
  const calculateTryAndBuyFee = (trialPhaseStart, ratePerMinute = 5) => {
    if (!trialPhaseStart) return { minutesUsed: 0, payableMinutes: 0, fee: 0 };

    const start = new Date(trialPhaseStart).getTime();
    const now = Date.now();

    const diffMs = now - start;
    const minutesUsed = Math.ceil(diffMs / 60000); // total minutes passed

    // First 10 minutes free
    if (minutesUsed <= 10) {
      return {
        minutesUsed,
        payableMinutes: 0,
        fee: 0
      };
    }

    const payableMinutes = minutesUsed - 10;
    const fee = payableMinutes * ratePerMinute;

    return {
      minutesUsed,
      payableMinutes,
      fee
    };
  };

  const updateBilling = useCallback((items, returnCharge, trialPhaseStart) => {
    // Base amount of kept items
    const baseAmount = items
      .filter(item => item.tryStatus === "keep")
      .reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Try & Buy Fee
    const { fee: tryAndBuyFee } = calculateTryAndBuyFee(trialPhaseStart, 5);

    // FINAL BILLING FORMULA
    // TOTAL = BASE + TRY_FEE - RETURN_CHARGE
    const totalPayable = baseAmount + tryAndBuyFee - (returnCharge || 0);

    setFinalBilling({
      baseAmount,
      tryAndBuyFee,
      returnCharge: returnCharge || 0,
      deliveryCharge: 0,
      gst: 0,
      discount: 0,
      totalPayable
    });

  }, []);

  const fetchOrderDetails = useCallback(async () => {
    try {
      const response = await getOrderById(orderId);
      const data = response?.order;

      if (!data) return;

      // 🌟 Save order data
      setOrderData(data);

      console.log(data, 'data');

      // 🌟 Check delivery status 
      if (data.customerDeliveryStatus === "completed") {
        setIsDelivered(true);
        return;  // ❗ Stop further tracking logic
      }

      // ❗ Otherwise continue tracking logic...
      setOtp(data.otp || '');
      const steps = statusToSteps(data.orderStatus);
      const estimatedTime = data.estimatedTime || 'Calculating...';

      setOrderStatus({
        current: data.orderStatus,
        estimatedTime,
        deliveryType: 'Try & Buy',
        steps,
      });

      // Rider handling...
      setDeliveryPerson({
        name: data?.deliveryRiderDetails?.name || "Assigning Delivery Partner Soon",
        phone: data?.deliveryRiderDetails?.phone || "N/A",
        avatar: data?.deliveryRiderDetails?.name?.charAt(0)?.toUpperCase() || "R",
      });

      // Items etc.
      if (data.items) {
        const formatted = data.items.map(item => ({
          ...item,
          tryStatus: item.tryStatus || 'pending',
          returnReason: item.returnReason || null,
        }));

        setItems(formatted);
      }

      if (data.trialPhaseDuration > 0 && data.trialPhaseStart) {
        setTrialPhase({
          isActive: true,
          trialPhaseStart: data.trialPhaseStart,
          trialPhaseDuration: data.trialPhaseDuration,
        });
      }
    } catch (error) {
      console.log("Error fetching order", error);
    }
  }, [orderId, updateBilling]);

  useEffect(() => {
    fetchOrderDetails(); // <-- FIRST fetch order status on page load
  }, []);



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

  // Handle item status update
  const handleUpdateItem = (index, tryStatus, returnReason) => {
    const updated = [...items];
    updated[index] = { ...updated[index], tryStatus, returnReason };

    setItems(updated);

    console.log(orderData.returnCharge, 'orderData.returnCharge'); // FIX

    // now using returnCharge instead of returnChange
    updateBilling(updated, orderData?.returnCharge, trialPhase.trialPhaseStart);
  };

  const handleSubmitPress = () => {
    if (!allItemsSelected) {
      alert("Please select Keep or Return for all items");
      return;
    }
    setSelectedItemsForConfirm(items); // 👈 pass items into modal
    modalRef.current?.open();
  };

  const handleConfirm = () => {
    console.log("CONFIRMED:", selectedItemsForConfirm);
    modalRef.current?.close();
    // Add your API call here
  };


  useEffect(() => {
    const setupSocket = async () => {
      // console.log("Joining order socket:", orderId);

      await joinOrderRoom(orderId);

      listenOrderUpdates((updateData) => {
        console.log("SOCKET UPDATE:", updateData);

        setOtp(updateData?.otp);

        const estimatedTime = updateData.estimatedTime || prev.estimatedTime || 'Calculating...';

        setOrderStatus(prev => {
          const newSteps = statusToSteps(updateData.orderStatus, prev.steps);
          // merge: once completed → always completed
          const mergedSteps = prev.steps.map((step, i) => ({
            ...step,
            completed: step.completed || newSteps[i].completed
          }));

          return {
            ...prev,
            current: updateData.orderStatus,
            estimatedTime,
            deliveryType: 'Try & Buy',
            steps: mergedSteps,
          };
        });

        //  here updated the name and phnnumber of delivery partner
        setDeliveryPerson({
          name: updateData.deliveryRiderId
            ? `Rider ${updateData.deliveryRiderId.slice(-4)}`
            : 'Assigning Delivery Partner Soon',
          id: updateData.deliveryRiderId || 'N/A',
          avatar: '👤',
        });

        if (updateData.items) {
          const updatedItems = updateData.items.map((item) => ({
            ...item,
            tryStatus: item.tryStatus || 'pending',
            returnReason: item.returnReason || null,
          }));

          setItems(updatedItems);

          updateBilling(updatedItems, updateData.returnCharge, updateData.trialPhaseStart);
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
      socket.on("trialPhaseStart", (data) => {
        if (data.orderId === orderId) {
          setTrialPhase({
            isActive: true,
            trialPhaseStart: data.trialPhaseStart,
            trialPhaseDuration: data.trialPhaseDuration,
          });
          updateBilling(
            items,
            orderData?.returnCharge || 0,
            data.trialPhaseStart
          );
        }
      });
    };

    setupSocket();

    return () => {
      console.log("Cleaning socket listeners for:", orderId);
      const socket = getSocket();
      socket.off("trialPhaseStart");
      removeOrderListeners();
    };
  }, [orderId, items, finalBilling.deliveryCharge, updateBilling]);

  const handleSubmit = async () => {
    try {
      const payload = {
        orderId,
        items, // pass accepted/returned item selection
      };

      // 1️⃣ CALL BACKEND → CREATE FINAL PAYMENT ORDER
      const res = await finalpaymentInitiate(payload);
      const data = res; // JSON from backend

      console.log("Final Payment Data →", data);

      // 2️⃣ EXTRACT VALUES FROM RESPONSE
      const {
        amount,
        breakdown,
        key_id,
        razorpayOrder,
        orderId: internalOrderId,
        name,
        email,
        contact,
        currency,
      } = data;

      const razorpayOrderId = razorpayOrder?.id;

      // 3️⃣ SETUP RAZORPAY OPTIONS
      const options = {
        description: "FlashFits Final Order Payment",
        currency: currency || "INR",
        key: key_id,
        amount: amount, // already in paise (20100)
        name: "FlashFits",
        order_id: razorpayOrderId,
        // ✅ Prefill directly from backend response
        prefill: {
          email: email || "",
          contact: contact || "",
          name: name || "Customer",
        },

        theme: { color: "#61b3f6" },
      };

      console.log("Razorpay Options →", options);

      // // 4️⃣ OPEN RAZORPAY CHECKOUT
      RazorpayCheckout.open(options)
        .then(async (paymentData) => {
          console.log("Payment Success:", paymentData);
          console.log(paymentData, internalOrderId, '6667');
          // OPTIONAL → VERIFY WITH BACKEND
          await finalpaymetVerify(paymentData, internalOrderId);
          router.replace({
            pathname: '/(stack)/OrderDetail/OrderCompletionScreen',
            params: {
              orderData
            }
          });
          alert("Payment Successful!");
        })
        .catch((error) => {
          console.log("Payment Error:", error);
          alert("Payment Failed. Please try again.");
        });

    } catch (error) {
      console.log("Final Payment Failed →", error);
    }
  };

  const callDeliveryPartner = (phone) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone}`);
  };

  const hasReturnItems = items.some((item) => item.tryStatus === 'return');
  const allItemsSelected = items.length > 0 && items.every(item => item.tryStatus === 'keep' || item.tryStatus === 'return');

  return (
    <>
      {isDelivered && orderData ? (
        <OrderCompletionScreen orderData={orderData} />
      ) : (
        <>
          {/* <SafeAreaView> */}
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
            <View style={styles.mapSection}>
              <OSMDeliveryMap userLocation={STATIC_USER} riderLocation={STATIC_RIDER} />
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
                      {orderStatus.estimatedTime === 'Calculating...'
                        ? 'Estimating arrival...'
                        : `Arriving in ${orderStatus.estimatedTime}`
                      } Minutes
                    </Text>
                    <Text style={styles.deliveryType}>{orderStatus.deliveryType}</Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Text style={styles.menuDots}>⋮</Text>
                </TouchableOpacity>
              </View>

              {['placed', 'accepted', 'packed', 'out_for_delivery', 'arrived at delivery',].includes(orderStatus.current) && (
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
              )}

              {/* TIMER — Show only if trial is active AND not completed */}
              {trialPhase.isActive && orderStatus.current !== "completed try phase" && (
                <TrialPhaseTimer
                  trialPhaseStart={trialPhase.trialPhaseStart}
                  trialPhaseDuration={trialPhase.trialPhaseDuration}
                />
              )}

              {/* FULL Try & Buy Section — Show only before trial completion */}
              {['try phase',].includes(orderStatus.current) && (
                <>
                  {/* ITEM SELECTION */}
                  <ItemSelection
                    items={items}
                    onUpdateItem={handleUpdateItem}
                    disabled={false} // no need to disable now
                  />

                  {/* RETURN OTP */}
                  {['try phase', 'completed try phase'].includes(orderStatus.current) && (
                    <View style={styles.otpBadge}>
                      <Ionicons name="key-outline" size={14} color="#1A73E8" />
                      <Text style={styles.otpBadgeText}>Return OTP: {otp}</Text>
                    </View>
                  )}

                  {/* BILLING */}

                  {
                    finalBilling?.baseAmount > 0 && (
                      <View style={styles.billingContainer}>
                        <Text style={styles.billingTitle}>Billing Summary</Text>

                        <View style={styles.billRow}>
                          <Text style={styles.billLabel}>Base Amount</Text>
                          <Text style={styles.billValue}>₹{finalBilling.baseAmount}</Text>
                        </View>

                        {finalBilling.tryAndBuyFee > 5 && (
                          <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Waiting Charge (after 10 min)</Text>
                            <Text style={styles.billValue}>₹{finalBilling.tryAndBuyFee}</Text>
                          </View>
                        )}

                        {!hasReturnItems && finalBilling.returnCharge > 0 && (
                          <View style={styles.deductionRow}>
                            <Text style={styles.deductionLabel}>Return Charge Deducted</Text>
                            <Text style={styles.deductionValue}>- ₹{finalBilling.returnCharge}</Text>
                          </View>
                        )}

                        <View style={styles.billDivider} />

                        <View style={styles.billRow}>
                          <Text style={styles.billTotal}>Total Payable</Text>
                          <Text style={styles.billTotal}>₹{finalBilling.totalPayable}</Text>
                        </View>
                      </View>
                    )
                  }
                  {/* ACTION BUTTONS */}
                  <View style={styles.actionButtonsContainer}>
                    {/* RETURN BUTTON */}
                    {hasReturnItems && (
                      <TouchableOpacity
                        style={[
                          styles.actionButtonPrimary,
                          (!allItemsSelected || trialPhaseComplete) && { opacity: 0.5 },
                        ]}
                        onPress={() => {
                          if (allItemsSelected && !trialPhaseComplete) {
                            modalRef.current?.open();
                            handleSubmitPress()
                          }
                        }}
                        disabled={!allItemsSelected || trialPhaseComplete}
                      >
                        <Text style={styles.actionButtonText}>
                          {trialPhaseComplete ? "Trial Completed" : "Return Items"}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* PAYMENT BUTTON */}
                    {!hasReturnItems && (
                      <TouchableOpacity
                        style={[
                          styles.actionButtonPrimary,
                          !allItemsSelected && { opacity: 0.5 },
                        ]}
                        onPress={() => allItemsSelected && handleSubmit()}
                        disabled={!allItemsSelected}
                      >
                        <Text style={styles.actionButtonText}>Proceed to Payment</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}

            </LinearGradient>


            {['out_for_delivery', 'arrived at delivery'].includes(orderStatus.current) && (
              <View style={styles.deliveryCard}>
                <View style={styles.deliveryRow}>
                  <View style={styles.deliveryLeft}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarIcon}>{deliveryPerson?.avatar}</Text>
                    </View>
                    <View>
                      <Text style={styles.deliveryName}>{deliveryPerson?.name}</Text>
                      {deliveryPerson?.id !== 'N/A' && (
                        <Text style={styles.deliveryId}>I am on my Way, Arriving Soon</Text>
                      )}
                    </View>
                  </View>
                  {deliveryPerson?.id !== 'N/A' && (
                    <TouchableOpacity
                      onPress={() => callDeliveryPartner(deliveryPerson?.phone)}
                      style={styles.callButton}
                    >
                      <Phone size={20} color="#fff" />
                    </TouchableOpacity>

                  )}
                </View>
              </View>
            )}



            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsPackageOpen(!isPackageOpen)}
            >
              <View style={styles.actionLeft}>
                <Package size={20} color="#444" />
                <Text style={styles.actionText}>View Package Information</Text>
              </View>
              <ChevronRight
                size={20}
                color="#9ca3af"
                style={{ transform: [{ rotate: isPackageOpen ? '90deg' : '0deg' }] }}
              />
            </TouchableOpacity>

            {isPackageOpen && (
              <View style={styles.packageContainer}>
                {items.map((item) => (
                  <View style={styles.packageItem} key={item._id}>

                    {/* IMAGE */}
                    <Image source={{ uri: item.image }} style={styles.packageImage} />

                    {/* DETAILS */}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.packageName}>{item.name}</Text>
                      <Text style={styles.packagePrice}>₹{item.price}</Text>
                      <Text style={styles.packageQty}>Qty: {item.quantity}</Text>
                    </View>

                  </View>
                ))}
              </View>
            )}

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
                  <View style={{ flex: 1 }}>
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
            ref={modalRef}
            onCancel={() => modalRef.current?.close()}
            orderId={orderId}
            otp={otp}
            items={items}
            totalPayable={finalBilling.totalPayable}
            onConfirm={handleConfirm}   // existing logic// 👈 NEW
            orderData={orderData}
          />
        </>
      )
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 44,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  returnButton: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 16,
  },
  returnButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
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
  billContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  billTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6
  },
  billLabel: {
    fontSize: 16,
    color: "#fff"
  },
  deductionLabel: {
    color: '#ff6363',
    fontSize: 14,
    fontWeight: '500',
  },

  deductionValue: {
    color: '#ff4c4c',
    fontSize: 14,
    fontWeight: '700',
  },
  billValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff"
  },
  billDivider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10
  },
  billTotal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff"
  },
  otpBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F0FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 20,
    width: '100%',
    height: 50
  },
  otpBadgeText: {
    color: "#1A73E8",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
    alignItems: 'center'
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
  deductionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
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
  riderMarker: {
    backgroundColor: "white",
    padding: 6,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  userMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#22c55e", // green
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  userInnerCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22c55e",
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

  packageContainer: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },

  packageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },

  packageImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },

  packageName: {
    fontSize: 14,
    color: '#111',
    fontWeight: '600',
    marginBottom: 4,
  },

  packagePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981', // green for price
    marginBottom: 2,
  },

  packageQty: {
    fontSize: 13,
    color: '#555',
  },

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
    color: '#ffffffff',
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
    borderColor: '#fff',
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
    color: '#fff',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
});