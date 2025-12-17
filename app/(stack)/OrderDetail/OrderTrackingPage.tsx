import React, { useCallback, useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  MessageCircle,
  Package,
  Phone,
} from "lucide-react-native";
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
  View,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { calculateFinalBilling } from "../../utilities/ItemSelectionCalculation";
import RazorpayCheckout from "react-native-razorpay";

import {
  finalpaymentInitiate,
  finalpaymetVerify,
  getOrderById,
} from "../../api/orderApis";
import { getSocket } from "../../config/socket";
import ConfirmSelectionModal from "./ConfirmSelectionModal";
import OSMDeliveryMap from "./OSMDeliveryMap";
import OrderCompletionScreen from "./OrderCompletionScreen";
import {
  joinOrderRoom,
  listenOrderUpdates,
  removeOrderListeners,
} from "@/app/sockets/order.socket";

/* ============================
   Types
   ============================ */

type OrderStep = {
  id: string;
  label: string;
  completed: boolean;
};

type Item = {
  _id: string;
  name: string;
  image?: string;
  size?: string;
  price: number;
  quantity: number;
  tryStatus?: "pending" | "keep" | "returned";
  returnReason?: string | null;
  [k: string]: any; // catch-all for extra props from API
};

type OrderData = {
  _id?: string;
  orderStatus?: string;
  estimatedTime?: string | number;
  customerDeliveryStatus?: string;
  otp?: string;
  items?: Item[];
  trialPhaseStart?: string | number | null;
  trialPhaseDuration?: number;
  deliveryRiderDetails?: {
    name?: string;
    phone?: string;
  };
  returnCharge?: number;
  [k: string]: any;
};

type DeliveryPerson = {
  name: string;
  phone?: string;
  avatar?: string;
  id?: string;
};

type TrialPhase = {
  isActive: boolean;
  trialPhaseStart: string | number | null;
  trialPhaseDuration: number;
};

type SocketUpdateData = {
  orderId?: string;
  orderStatus?: string;
  estimatedTime?: string | number;
  otp?: string;
  deliveryRiderId?: string;
  deliveryRiderDetails?: any;
  items?: Item[];
  returnCharge?: number;
  trialPhaseStart?: string | number | null;
  trialPhaseDuration?: number;
  [k: string]: any;
};

type LatLng = { latitude: number; longitude: number } | null;

/* ============================
   Helpers & small components
   ============================ */

// Helper function to format time (MM:SS)
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

type TrialPhaseTimerProps = {
  trialPhaseStart: string | number | null;
  trialPhaseDuration: number;
};

const TrialPhaseTimer: React.FC<TrialPhaseTimerProps> = ({
  trialPhaseStart,
  trialPhaseDuration,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trialPhaseStart) return;

    const startTime = new Date(trialPhaseStart).getTime();
    const durationSeconds = trialPhaseDuration * 60; // minutes -> seconds
    const endTime = startTime + durationSeconds * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const secondsLeft = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeLeft(secondsLeft);
      if (secondsLeft <= 0 && intervalRef.current !== null) {
        clearInterval(intervalRef.current as unknown as number);
        intervalRef.current = null;
      }
    };

    updateTimer();
    intervalRef.current = setInterval(updateTimer, 1000) as unknown as number;

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current as unknown as number);
        intervalRef.current = null;
      }
    };
  }, [trialPhaseStart, trialPhaseDuration]);

  if (timeLeft <= 0) return null;

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
    </View>
  );
};


type ItemSelectionProps = {
  items: Item[];
  onUpdateItem: (index: number, tryStatus: "keep" | "returned", returnReason: string | null) => void;
  disabled?: boolean;
};

const ItemSelection: React.FC<ItemSelectionProps> = ({ items, onUpdateItem, disabled }) => {
  return (
    <View style={[styles.itemSelectionContainer, disabled && { opacity: 0.4 }]}>
      <Text style={styles.itemSelectionTitle}>Select Items to Keep or Return</Text>

      {items.map((item, index) => (
        <View key={item._id} style={styles.itemCard}>
          {/* IMAGE + TITLE */}
          <View style={styles.itemHeader}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.itemSize}>Size: {item.size}</Text>
              <Text style={styles.itemPrice}>
                ₹{item.price} × {item.quantity}
              </Text>
            </View>
          </View>

          {/* ACTION BUTTONS */}
          <View style={styles.itemActions}>
            <TouchableOpacity
              disabled={disabled}
              style={[
                styles.itemButton,
                item.tryStatus === "keep" && styles.itemButtonKeep,
                disabled && { opacity: 0.5 },
              ]}
              onPress={() => onUpdateItem(index, "keep", null)}
            >
              <Text
                style={[
                  styles.itemButtonText,
                  item.tryStatus === "keep" && styles.itemButtonTextActive,
                ]}
              >
                ✓ Keep
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={disabled}
              style={[
                styles.itemButton,
                item.tryStatus === "returned" && styles.itemButtonReturn,
                disabled && { opacity: 0.5 },
              ]}
              onPress={() => onUpdateItem(index, "returned", item.returnReason || null)}
            >
              <Text
                style={[
                  styles.itemButtonText,
                  item.tryStatus === "returned" && styles.itemButtonTextActive,
                ]}
              >
                ↩ Return
              </Text>
            </TouchableOpacity>
          </View>

          {/* REASON INPUT */}
          {item.tryStatus === "returned" && !disabled && (
            <TextInput
              style={styles.returnReasonInput}
              placeholder="Why are you returning this item?"
              placeholderTextColor="#6b7280"
              value={item.returnReason ?? "Not Liked"}
              onChangeText={(text) => onUpdateItem(index, "returned", text)}
              multiline
              numberOfLines={2}
            />
          )}
        </View>
      ))}
    </View>
  );
};

/* Map order status to steps */
const statusToSteps = (orderStatus?: string, prevSteps?: OrderStep[]): OrderStep[] => {
  const steps: OrderStep[] = prevSteps
    ? prevSteps.map((s) => ({ ...s }))
    : [
      { id: "picked", label: "Picked", completed: false },
      { id: "in-transit", label: "In transit", completed: false },
      { id: "Arrived", label: "Arrived", completed: false },
    ];

  switch (orderStatus) {
    case "packed":
      steps[0].completed = true;
      break;
    case "out_for_delivery":
      steps[0].completed = true;
      steps[1].completed = true;
      break;
    case "arrived at delivery":
      steps[0].completed = true;
      steps[1].completed = true;
      steps[2].completed = true;
      break;
    default:
      return steps;
  }

  return steps;
};

/* ============================
   Main Component
   ============================ */

const OrderTrackingPage: React.FC = () => {


  const STATIC_USER = {
    latitude: 12.9716,
    longitude: 77.5946,
  };

  const STATIC_RIDER = {
    latitude: 12.9352,
    longitude: 77.6245,
  };

  const [mapUserLocation, setMapUserLocation] = useState<LatLng>(null);
  const [mapRiderLocation, setMapRiderLocation] = useState<LatLng>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderData | null>(null);

  const coordsArrayToLatLng = (coords?: any[]): LatLng => {
    if (!coords || !Array.isArray(coords) || coords.length < 2) return null;
    const [lon, lat] = coords;
    const latNum = Number(lat);
    const lonNum = Number(lon);
    if (Number.isFinite(latNum) && Number.isFinite(lonNum)) return { latitude: latNum, longitude: lonNum };
    return null;
  };

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  console.log(orderData, '56677');
  const [isDelivered, setIsDelivered] = useState<boolean>(false);
  const [trialPhaseComplete, setTrialPhaseComplete] = useState<boolean>(false);
  const modalRef = useRef<Modalize>(null);

  // useLocalSearchParams returns record — guard and coerce to string
  const params = useLocalSearchParams() as { orderId?: string };
  const orderId = String(params?.orderId ?? "");
  const router = useRouter();

  const [selectedItemsForConfirm, setSelectedItemsForConfirm] = useState<Item[]>([]);
  const [isPackageOpen, setIsPackageOpen] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [orderStatus, setOrderStatus] = useState<{
    current: string;
    estimatedTime: string | number;
    deliveryType: string;
    steps: OrderStep[];
  }>({
    current: "",
    estimatedTime: "",
    deliveryType: "Try and Buy",
    steps: [
      { id: "picked", label: "Picked", completed: false },
      { id: "in-transit", label: "In transit", completed: false },
      { id: "arrived", label: "Arrived", completed: false },
    ],
  });

  const [deliveryPerson, setDeliveryPerson] = useState<DeliveryPerson | null>(null);
  const [trialPhase, setTrialPhase] = useState<TrialPhase>({
    isActive: false,
    trialPhaseStart: null,
    trialPhaseDuration: 0,
  });
  const [otp, setOtp] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  const [billingSummary, setBillingSummary] = useState({
    baseAmount: 0,
    gst: 0,
    overtimePenalty: 0,
    returnCharge: 0,
    returnChargeDeduction: 0,
    totalPayable: 0,
    itemsAccepted: 0,
    itemsReturned: 0,
    allItemsKept: true,
  });
  /* Calculate Try & Buy Fee Based on Time Difference */
  // const calculateTryAndBuyFee = (trialPhaseStart: string | number | null, ratePerMinute = 5) => {
  //   if (!trialPhaseStart) return { minutesUsed: 0, payableMinutes: 0, fee: 0 };

  //   const start = new Date(trialPhaseStart).getTime();
  //   const now = Date.now();

  //   const diffMs = now - start;
  //   const minutesUsed = Math.ceil(diffMs / 60000); // total minutes passed

  //   // First 10 minutes free
  //   if (minutesUsed <= 10) {
  //     return {
  //       minutesUsed,
  //       payableMinutes: 0,
  //       fee: 0,
  //     };
  //   }

  //   const payableMinutes = minutesUsed - 10;
  //   const fee = payableMinutes * ratePerMinute;

  //   return {
  //     minutesUsed,
  //     payableMinutes,
  //     fee,
  //   };
  // };

  const updateBillingSummary = useCallback(() => {
    const returnCharge = orderData?.returnCharge ?? 0;

    // ⛔ Always reset previous billing state before recalculating
    const summary = calculateFinalBilling({
      orderItems: [...items],   // fresh data
      returnCharge,             // fresh deduction
    });

    setBillingSummary(summary);
  }, [items, orderData?.returnCharge]);

  useEffect(() => {
    const setupSocket = async () => {
      if (!orderId) return;

      await joinOrderRoom(orderId);

      listenOrderUpdates((updateData: SocketUpdateData) => {
        console.log("SOCKET UPDATE:", updateData);

        setOtp(updateData?.otp ?? "");

        // Move estimatedTime logic inside setOrderStatus so prev is available
        setOrderStatus((prev) => {
          const estimatedTime = updateData.estimatedTime ?? prev.estimatedTime ?? "Calculating...";
          const newSteps = statusToSteps(updateData.orderStatus, prev.steps);

          const mergedSteps = prev.steps.map((step, i) => ({
            ...step,
            completed: step.completed || (newSteps[i]?.completed ?? false),
          }));


          return {
            ...prev,
            current: updateData.orderStatus ?? prev.current,
            estimatedTime,
            deliveryType: "Try & Buy",
            steps: mergedSteps,
          };
        });

        setDeliveryPerson({
          name: updateData?.deliveryRiderDetails?.name,
          phone: updateData?.deliveryRiderDetails?.phone ?? "N/A",
          avatar: updateData?.deliveryRiderDetails?.name?.charAt(0)?.toUpperCase() ?? "R",
        });

        if (updateData.items) {
          const updatedItems = updateData.items.map((item) => ({
            ...item,
            tryStatus: item.tryStatus ?? "pending",
            returnReason: item.returnReason ?? null,
          }));

          setItems(updatedItems);
          updateBillingSummary();
        }

        if (updateData.trialPhaseDuration && updateData.trialPhaseStart) {
          setTrialPhase({
            isActive: true,
            trialPhaseStart: updateData.trialPhaseStart ?? null,
            trialPhaseDuration: updateData.trialPhaseDuration,
          });
        }
      });

      const socket = getSocket();
      if (socket) {
        socket.on("trialPhaseStart", (data: any) => {
          if (data.orderId === orderId) {
            setTrialPhase({
              isActive: true,
              trialPhaseStart: data.trialPhaseStart,
              trialPhaseDuration: data.trialPhaseDuration,
            });
            updateBillingSummary();
          }
        });
      }
    };

    setupSocket();

    return () => {
      console.log("Cleaning socket listeners for:", orderId);
      const socket = getSocket();
      if (socket) {
        socket.off("trialPhaseStart");
      }
      removeOrderListeners();
    };
  }, [orderId, items, billingSummary.totalPayable, orderData]);

  const fetchOrderDetails = useCallback(async () => {
    try {
      const response = await getOrderById(orderId);
      const data: OrderData | undefined = response?.order ?? response;

      if (!data) return;

      if (data.orderStatus === "otp-verified-return") {
        console.log("✅ Return completed");
        setCompletedOrder(data);
        setShowCompletion(true);
        return;
      }


      if (data.orderStatus === "completed try phase") {
        console.log('66767677');

        router.replace({
          pathname: "/(stack)/OrderDetail/ReturnItemsPage", // 👈 adjust exact route path
          params: {
            orderId: data._id,
            otp: data.otp,
            items: JSON.stringify(data.items),
          },
        });
        return;
      }

      const userFromOrder = coordsArrayToLatLng(data?.deliveryLocation?.coordinates);
      const riderFromPickup = coordsArrayToLatLng(data?.pickupLocation?.coordinates);

      setMapUserLocation(userFromOrder ?? STATIC_USER);

      const latestTracking =
        Array.isArray(data?.deliveryTracking) && data.deliveryTracking.length > 0
          ? // assume each tracking entry has coordinates: [lon, lat]
          coordsArrayToLatLng(data.deliveryTracking[data.deliveryTracking.length - 1]?.coordinates)
          : null;

      setMapRiderLocation(latestTracking ?? riderFromPickup ?? STATIC_RIDER);

      setOrderData(data);

      if (data.customerDeliveryStatus === "completed") {
        setIsDelivered(true);
        return;
      }



      setOtp(data.otp || "");
      const steps = statusToSteps(data.orderStatus);
      const estimatedTime = data.estimatedTime ?? "Calculating...";

      setOrderStatus({
        current: data.orderStatus ?? "",
        estimatedTime,
        deliveryType: "Try & Buy",
        steps,
      });

      setDeliveryPerson({
        name: data?.deliveryRiderDetails?.name ?? "Assigning Delivery Partner Soon",
        phone: data?.deliveryRiderDetails?.phone ?? "N/A",
        avatar: data?.deliveryRiderDetails?.name?.charAt(0)?.toUpperCase() ?? "R",
      });

      if (data.items) {
        const formatted = (data.items as Item[]).map((item) => ({
          ...item,
          tryStatus: item.tryStatus ?? "pending",
          returnReason: item.returnReason ?? null,
        }));
        setItems(formatted);
      }

      if (data.trialPhaseDuration && data.trialPhaseStart) {
        setTrialPhase({
          isActive: true,
          trialPhaseStart: data.trialPhaseStart ?? null,
          trialPhaseDuration: data.trialPhaseDuration,
        });
      }
    } catch (error) {
      console.log("Error fetching order", error);
    }
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    if (items.length > 0) {
      updateBillingSummary();
    }
  }, [items, orderData?.returnCharge, updateBillingSummary]);

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
    if (orderId) checkTrialPhase();
  }, [orderId]);

  const handleUpdateItem = (index: number, tryStatus: "keep" | "returned", returnReason: string | null) => {
    const updated = [...items];
    updated[index] = { ...updated[index], tryStatus, returnReason };
    setItems(updated);
    // updateBillingSummary();
  };

  const handleSubmitPress = () => {
    const allItemsSelected = items.length > 0 && items.every((it) => it.tryStatus === "keep" || it.tryStatus === "returned");
    if (!allItemsSelected) {
      alert("Please select Keep or Return for all items");
      return;
    }
    setSelectedItemsForConfirm(items);
    modalRef.current?.open();
  };

  const handleConfirm = () => {
    console.log("CONFIRMED:", selectedItemsForConfirm);
    modalRef.current?.close();
    // Add API call here
  };


  const handleSubmit = async () => {
    try {
      const payload = {
        orderId,
        items: items.map(item => ({
          itemId: item._id,              // ✅ map _id → itemId
          tryStatus: item.tryStatus,     // keep / returned
          returnReason: item.returnReason ?? null,
        })),
      };

      const res = await finalpaymentInitiate(payload);
      const data: any = res;

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

      const options = {
        description: "FlashFits Final Order Payment",
        currency: currency || "INR",
        key: key_id,
        amount: amount, // already in paise
        name: "FlashFits",
        order_id: razorpayOrderId,
        prefill: {
          email: email,
          contact: contact,
          name: name
        },
        theme: { color: "#61b3f6" },
      };
      console.log(options, 'optionsoptions');

      RazorpayCheckout.open(options)
        .then(async (paymentData: any) => {
          await finalpaymetVerify(paymentData, internalOrderId);
          setCompletedOrder(orderData);
          setShowCompletion(true);
          // router.replace({
          //   pathname: "/(stack)/OrderDetail/OrderCompletionScreen",
          //   params: {
          //     orderData,
          //   },
          // });
          // console.log(orderData,'888orderDataorderData');

          alert("Payment Successful!");
        })
        .catch((error: any) => {
          console.log("Payment Error:", error);
          alert("Payment Failed. Please try again.");
        });
    } catch (error) {
      console.log("Final Payment Failed →", error);
    }
  };

  const callDeliveryPartner = (phone?: string) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone}`);
  };

  const hasReturnItems = items.some((item) => item.tryStatus === "returned");
  const allItemsSelected = items.length > 0 && items.every((item) => item.tryStatus === "keep" || item.tryStatus === "returned");

  if (showCompletion && completedOrder) {
    return <OrderCompletionScreen orderData={completedOrder} />;
  }


  return (
    <>
      {isDelivered && orderData ? (
        <OrderCompletionScreen orderData={orderData} />
      ) : (
        <>
          <View style={styles.header}>
            <View style={styles.headerInner}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backArrow}>←</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Track OrderId_{orderId.slice(-5).toUpperCase()}</Text>
            </View>
          </View>

          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#3b82f6"]} tintColor="#3b82f6" />}
          >
            {/* {
              showMap ??
            } */}
            <View style={styles.mapSection}>
              <OSMDeliveryMap
                userLocation={mapUserLocation ?? STATIC_USER}
                riderLocation={mapRiderLocation ?? STATIC_RIDER}
              />
            </View>

            <LinearGradient colors={["#eee", "#eee", "#fffefeff"]} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <View style={styles.statusLeft}>
                  <View style={styles.packageIcon}>
                    <Package size={24} color="#fff" />
                  </View>
                  {["placed", "accepted", "packed", "out_for_delivery"].includes(orderStatus.current) && (

                    <View>
                      <Text style={styles.arrivalText}>
                        {orderStatus.estimatedTime === "Calculating..." ? "Estimating arrival..." : `Arriving in ${orderStatus.estimatedTime}`} Minutes
                      </Text>
                      <Text style={styles.deliveryType}>{orderStatus.deliveryType}</Text>
                    </View>
                  )}
                  {["arrived at delivery", "try phase"].includes(orderStatus.current) && (
                    <View>
                      <Text style={styles.arrivalText}>Try your Fits</Text>
                    </View>
                  )}
                  {/* <TrialPhaseTimer trialPhaseStart={trialPhase.trialPhaseStart} trialPhaseDuration={trialPhase.trialPhaseDuration} /> */}
                  {/* {trialPhase.isActive && orderStatus.current !== "completed try phase" && (
                    <TrialPhaseTimer trialPhaseStart={trialPhase.trialPhaseStart} trialPhaseDuration={trialPhase.trialPhaseDuration} />
                  )} */}
                </View>
                <TouchableOpacity>
                  <Text style={styles.menuDots}>⋮</Text>
                </TouchableOpacity>
              </View>

              {["placed", "accepted", "packed", "out_for_delivery", "arrived at delivery"].includes(orderStatus.current) && (
                <View style={styles.stepsRow}>
                  {orderStatus.steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <View style={styles.stepContainer}>
                        <View style={[styles.stepCircle, step.completed ? styles.stepCompleted : styles.stepIncomplete]}>
                          {step.completed ? <CheckCircle size={18} color="#fff" /> : <Clock size={18} color="#fff" />}
                        </View>
                        <Text style={[styles.stepLabel, step.completed ? styles.stepLabelActive : styles.stepLabelInactive]}>{step.label}</Text>
                      </View>
                      {index < orderStatus.steps.length - 1 && <View style={[styles.stepLine, step.completed ? styles.lineActive : styles.lineInactive]} />}
                    </React.Fragment>
                  ))}
                </View>
              )}

              {trialPhase.isActive && orderStatus.current !== "completed try phase" && (
                <TrialPhaseTimer trialPhaseStart={trialPhase.trialPhaseStart} trialPhaseDuration={trialPhase.trialPhaseDuration} />
              )}

              {["try phase"].includes(orderStatus.current) && (
                <>
                  <ItemSelection items={items} onUpdateItem={handleUpdateItem} disabled={false} />

                  {["try phase", "completed try phase"].includes(orderStatus.current) && (
                    <View style={styles.otpBadge}>
                      <Ionicons name="key-outline" size={14} color="#1A73E8" />
                      <Text style={styles.otpBadgeText}>Return OTP: {otp}</Text>
                    </View>
                  )}

                  <View style={styles.billingContainer}>
                    <Text style={styles.billingTitle}>Billing Summary</Text>

                    <View style={styles.billRow}>
                      <Text style={styles.billLabel}>Base Amount</Text>
                      <Text style={styles.billValue}>₹{billingSummary.baseAmount}</Text>
                    </View>

                    {billingSummary.returnChargeDeduction > 0 && (
                      <View style={styles.deductionRow}>
                        <Text style={styles.deductionLabel}>
                          Return Charge Deduction
                        </Text>
                        <Text style={styles.deductionValue}>
                          - ₹{billingSummary.returnChargeDeduction}
                        </Text>
                      </View>
                    )}

                    {billingSummary.itemsReturned > 0 && billingSummary.returnCharge > 0 && (
                      <View style={styles.billRow}>
                        <Text style={styles.billLabelSmall}>
                          Return Charge Applied when all items kept ({billingSummary.itemsReturned} item
                          {billingSummary.itemsReturned > 1 ? "s" : ""} returned)
                        </Text>
                        <Text style={styles.billValueSmall}>₹{billingSummary.returnCharge}</Text>
                      </View>
                    )}

                    <View style={styles.billDivider} />

                    <View style={styles.billRow}>
                      <Text style={styles.billTotal}>Total Payable</Text>
                      <Text style={styles.billTotal}>₹{billingSummary.totalPayable}</Text>
                    </View>
                  </View>

                  <View style={styles.actionButtonsContainer}>
                    {hasReturnItems && (
                      <TouchableOpacity
                        style={[styles.actionButtonPrimary, (!allItemsSelected || trialPhaseComplete) && { opacity: 0.5 }]}
                        onPress={() => {
                          if (allItemsSelected && !trialPhaseComplete) {
                            modalRef.current?.open();
                            handleSubmitPress();
                          }
                        }}
                        disabled={!allItemsSelected || trialPhaseComplete}
                      >
                        <Text style={styles.actionButtonText}>Return Items</Text>
                      </TouchableOpacity>
                    )}

                    {!hasReturnItems && (
                      <TouchableOpacity
                        style={[styles.actionButtonPrimary, !allItemsSelected && { opacity: 0.5 }]}
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

            {["out_for_delivery", "arrived at delivery"].includes(orderStatus.current) && (
              <View style={styles.deliveryCard}>
                <View style={styles.deliveryRow}>
                  <View style={styles.deliveryLeft}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarIcon}>{deliveryPerson?.avatar}</Text>
                    </View>
                    <View>
                      <Text style={styles.deliveryName}>{deliveryPerson?.name}</Text>
                      {deliveryPerson?.id !== "N/A" && <Text style={styles.deliveryId}>I am on my Way, Arriving Soon</Text>}
                    </View>
                  </View>

                  {deliveryPerson?.id !== "N/A" && (
                    <TouchableOpacity onPress={() => callDeliveryPartner(deliveryPerson?.phone)} style={styles.callButton}>
                      <Phone size={20} color="#fff" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.actionButton} onPress={() => setIsPackageOpen(!isPackageOpen)}>
              <View style={styles.actionLeft}>
                <Package size={20} color="#444" />
                <Text style={styles.actionText}>View Package Information</Text>
              </View>
              <ChevronRight size={20} color="#9ca3af" style={{ transform: [{ rotate: isPackageOpen ? "90deg" : "0deg" }] }} />
            </TouchableOpacity>

            {isPackageOpen && (
              <View style={styles.packageContainer}>
                {items.map((item) => (
                  <View style={styles.packageItem} key={item._id}>
                    <Image source={{ uri: item.image }} style={styles.packageImage} />
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

            {orderStatus.deliveryType === "Try & Buy" && (
              <View style={styles.tryBuy}>
                <View style={styles.tryBuyRow}>
                  <View style={styles.tryBuyIcon}>
                    <CheckCircle size={20} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.tryBuyTitle}>Try & Buy Available</Text>
                    <Text style={styles.tryBuyDesc}>Try your items at home before making the final decision. Return unwanted items with the delivery partner.</Text>
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
            totalPayable={billingSummary.totalPayable}
            onConfirm={handleConfirm}
            orderData={orderData}
          />
        </>
      )}
    </>
  );
};

export default OrderTrackingPage;

/* ============================
   Styles (unchanged)
   ============================ */

const styles = StyleSheet.create({
  // Container & Layout
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },

  // Header
  header: {
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 44,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backArrow: {
    fontSize: 24,
    color: "#1a1a1a",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: -0.3,
  },

  // Map Section
  mapSection: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    height: 250,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  // Status Card
  statusCard: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    paddingBottom: 24,
    backgroundColor: "#1a1a1a",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  packageIcon: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  arrivalText: {
    fontSize: 25,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.2,
  },
  deliveryType: {
    fontSize: 13,
    fontWeight: "500",
    color: "#a3a3a3",
    marginTop: 2,
  },
  menuDots: {
    fontSize: 24,
    color: "#737373",
    padding: 4,
  },

  // Steps Row
  stepsRow: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepContainer: {
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  stepLine: {
    flex: 1,
    height: 3,
    marginHorizontal: 6,
    borderRadius: 2,
  },
  stepCompleted: {
    backgroundColor: "#1a1a1a",
    borderColor: "#ffffff",
  },
  stepIncomplete: {
    backgroundColor: "#2a2a2a",
    borderColor: "#404040",
  },
  stepLabel: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: "600",
  },
  stepLabelActive: {
    color: "#ffffff",
  },
  stepLabelInactive: {
    color: "#737373",
  },
  lineActive: {
    backgroundColor: "#ffffff",
  },
  lineInactive: {
    backgroundColor: "#404040",
  },

  // Timer
  timerContainer: {
    marginTop: 20,
    backgroundColor: "#616060ff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#616060ff",
  },
  timerText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 1,
  },

  // Item Selection
  itemSelectionContainer: {
    marginTop: 20,
  },
  itemSelectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#616060ff",
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  itemCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#404040",
  },
  itemHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#404040",
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
    lineHeight: 18,
  },
  itemSize: {
    fontSize: 12,
    color: "#a3a3a3",
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
    marginTop: 6,
  },
  itemActions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  itemButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#404040",
  },
  itemButtonKeep: {
    backgroundColor: "#606160ff",
    borderColor: "#ffffff",
  },
  itemButtonReturn: {
    backgroundColor: "#616060ff",
    borderColor: "#ffffff",
  },
  itemButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#737373",
  },
  itemButtonTextActive: {
    color: "#ffffff",
  },
  returnReasonInput: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 12,
    color: "#ffffff",
    fontSize: 13,
    minHeight: 70,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#404040",
  },

  // OTP Badge
  otpBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 20,
    minWidth: 180,
    borderWidth: 1,
    borderColor: "#404040",
  },
  otpBadgeText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },

  // Billing
  billingContainer: {
    marginTop: 20,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#404040",
  },
  billingTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  billLabel: {
    fontSize: 14,
    color: "#d4d4d4",
    fontWeight: "500",
    maxWidth: "70%",
  },
  billLabelSmall: {
    fontSize: 12,
    color: "#a3a3a3",
    fontWeight: "500",
    maxWidth: "70%",
    lineHeight: 16,
  },
  billValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  billValueSmall: {
    fontSize: 14,
    fontWeight: "600",
    color: "#a3a3a3",
  },
  deductionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  deductionLabel: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    maxWidth: "70%",
  },
  deductionValue: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  billDivider: {
    height: 1,
    backgroundColor: "#404040",
    marginVertical: 12,
  },
  billTotal: {
    fontSize: 17,
    fontWeight: "700",
    color: "#ffffff",
  },

  // Action Buttons
  actionButtonsContainer: {
    marginTop: 20,
    flexDirection: "row",
    gap: 12,
  },
  actionButtonPrimary: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: -0.2,
  },
  returnButton: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "#404040",
  },
  returnButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  // Delivery Card
  deliveryCard: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  deliveryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deliveryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#e5e5e5",
  },
  avatarIcon: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  deliveryName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: -0.2,
  },
  deliveryId: {
    fontSize: 13,
    color: "#737373",
    marginTop: 2,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Map Markers
  riderMarker: {
    backgroundColor: "#ffffff",
    padding: 8,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    borderWidth: 2,
    borderColor: "#1a1a1a",
  },
  userMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#1a1a1a",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  userInnerCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
  },

  // Action Buttons
  actionButton: {
    marginTop: 12,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionText: {
    fontWeight: "600",
    color: "#1a1a1a",
    fontSize: 14,
  },

  // Package Container
  packageContainer: {
    marginHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginTop: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  packageItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  packageImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  packageName: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "600",
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  packageQty: {
    fontSize: 13,
    color: "#737373",
  },

  // Try & Buy
  tryBuy: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    backgroundColor: "#ffffff",
  },
  tryBuyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  tryBuyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  tryBuyTitle: {
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 6,
    fontSize: 15,
  },
  tryBuyDesc: {
    fontSize: 13,
    color: "#737373",
    lineHeight: 18,
  },

  // Map Overlays & Markers
  mapOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#f5f5f5",
    opacity: 0.3,
  },
  marker: {
    position: "absolute",
    borderWidth: 3,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  startMarker: {
    top: 40,
    left: 60,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
  },
  packageMarker: {
    top: 110,
    left: 120,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#737373",
  },
  endMarker: {
    bottom: 50,
    right: 40,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
  },
  storeLabel: {
    position: "absolute",
    top: 90,
    left: 40,
    backgroundColor: "#ffffff",
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  locationLabel: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#ffffff",
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
});
