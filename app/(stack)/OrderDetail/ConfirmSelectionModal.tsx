import React, { forwardRef, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Modalize } from "react-native-modalize";
import RazorpayCheckout from "react-native-razorpay";
import { router } from "expo-router";

import HandovrModal from "./HandoverModal";
import { finalpaymentInitiate, finalpaymetVerify } from "../../api/orderApis";

interface ConfirmSelectionModalProps {
  onCancel: () => void;
  orderId: string;
  otp?: string;
  totalPayable?: number;
  items: any[];
}

const ConfirmSelectionModal = forwardRef<Modalize, ConfirmSelectionModalProps>(
  ({ onCancel, orderId, otp, items = [], totalPayable }, ref) => {
    const handoverModalRef = useRef<Modalize>(null);

    const handleCancel = () => onCancel?.();

    const isAllReturned = items.every(
      item => item.tryStatus === "returned"
    );

    const buildPayload = () => ({
      orderId,
      items: items.map(item => ({
        itemId: item._id,
        tryStatus: item.tryStatus,
        returnReason: item.returnReason || null,
      })),
    });

    // 🔹 CASE 1: ALL ITEMS RETURNED
    const handleReturnAll = async () => {
      try {
        ref?.current?.close();

        const payload = buildPayload();
        const res = await finalpaymentInitiate(payload);

        if (!res) return;

        router.replace({
          pathname: "/(stack)/OrderDetail/ReturnItemsPage",
          params: {
            orderId,
            otp,
            items: JSON.stringify(items),
          },
        });
      } catch (e) {
        console.log("Return all failed:", e);
      }
    };

    // 🔹 CASE 2: KEEP + PAY FLOW
    const handlePaySelected = async () => {
      try {
        ref?.current?.close();

        const payload = buildPayload();
        const res = await finalpaymentInitiate(payload);

        if (!res) return;

        const {
          amount,
          key_id,
          razorpayOrder,
          orderId: internalOrderId,
          name,
          email,
          contact,
          currency,
        } = res;

        const options = {
          description: "FlashFits Final Payment",
          currency: currency || "INR",
          key: key_id,
          amount,
          name: "FlashFits",
          order_id: razorpayOrder?.id,
          prefill: {
            name: name || "Customer",
            email: email || "",
            contact: contact || "",
          },
          theme: { color: "#61b3f6" },
        };

        RazorpayCheckout.open(options)
          .then(async paymentData => {
            await finalpaymetVerify(paymentData, internalOrderId);

            const returnedItems = items.filter(
              item => item.tryStatus === "returned"
            );

            router.replace({
              pathname: "/(stack)/OrderDetail/ReturnItemsPage",
              params: {
                orderId: internalOrderId,
                otp,
                items: JSON.stringify(returnedItems),
              },
            });
          })
          .catch(err => {
            console.log("Payment Failed:", err);
            alert("Payment failed. Please try again.");
          });
      } catch (e) {
        console.log("Payment flow error:", e);
      }
    };

    const totalKeep = items.filter(i => i.tryStatus === "keep").length;
    const totalReturn = items.filter(i => i.tryStatus === "returned").length;

    return (
      <>
        <Modalize
          ref={ref}
          adjustToContentHeight
          modalStyle={styles.modal}
          handleStyle={styles.handle}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Confirm Selection</Text>
            <Text style={styles.subtitle}>
              Handover return items & share OTP
            </Text>

            {otp && <Text style={styles.otpText}>OTP: {otp}</Text>}

            <View style={styles.countContainer}>
              <Text style={styles.countText}>
                Keep: <Text style={styles.bold}>{totalKeep}</Text>
              </Text>
              <Text style={styles.countText}>
                Return: <Text style={styles.bold}>{totalReturn}</Text>
              </Text>
              {!isAllReturned && (
                <Text style={styles.totalPay}>
                  Payable: <Text style={styles.bold}>{totalPayable}</Text>
                </Text>
              )}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.confirmButton]}
                onPress={isAllReturned ? handleReturnAll : handlePaySelected}
              >
                <Text style={styles.confirmText}>
                  {isAllReturned ? "Return All" : "Pay Selected"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modalize>

        <HandovrModal ref={handoverModalRef} onConfirm={() => {}} />
      </>
    );
  }
);

export default ConfirmSelectionModal;

const styles = StyleSheet.create({
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  handle: {
    backgroundColor: "#e5e7eb",
    width: 60,
  },
  container: {
    alignItems: "center",
    paddingVertical: 25,
    marginBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  otpText: {
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 10,
  },
  countContainer: {
    width: "100%",
    marginVertical: 20,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  countText: {
    fontSize: 15,
    marginBottom: 4,
  },
  totalPay: {
    fontSize: 15,
    fontWeight: "700",
  },
  bold: {
    fontWeight: "700",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
  },
  confirmButton: {
    backgroundColor: "#111827",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
