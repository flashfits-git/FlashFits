import React, { forwardRef, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Modalize } from "react-native-modalize";
import HandovrModal from "./HandoverModal";
import * as SecureStore from 'expo-secure-store';
import { ConfirmClothSelection, someSelectedOtherReturn } from "../../api/orderApis";
import { router } from "expo-router";

interface ConfirmSelectionModalProps {
  onCancel: () => void;
  orderId: any;
  otp?: string;
  totalPayable?: any
  onConfirm: (method?: string) => void;
  onAllReturn?: () => void;
}

const ConfirmSelectionModal = forwardRef<Modalize, ConfirmSelectionModalProps>(
  ({ onCancel, orderId, onConfirm, otp, items, totalPayable }, ref) => {
    const handoverModalRef = useRef<Modalize>(null);
    console.log(orderId, 'ORDER');

    const handleCancel = () => onCancel?.();

    const confirmClothSelection = async () => {
      try {
        const payload = {
          orderId,
          items: items.map(item => ({
            itemId: item._id,
            tryStatus: item.tryStatus,
            returnReason: item.returnReason,
          })),
        };

        const anyKeep = items.some(item => item.tryStatus === "keep");

        // Close confirmation modal
        ref?.current?.close();

        // CASE 1: If any item is kept → open handover modal
        if (anyKeep) {
          console.log("KEEP detected → Opening Handover modal");
          setTimeout(() => {
            handoverModalRef.current?.open();
          }, 300);
          return; // ⛔ STOP here — no API call
        }

        // CASE 2: All items returned → call API
        console.log(payload.orderId, '8686868');
        const res = await ConfirmClothSelection(payload);
        if (res) {
          console.log('56756776');

          router.replace('/(stack)/OrderDetail/SuccessReturnPage');
        }

      } catch (e) {
        console.log("Confirm selection failed:", e);
      }
    };


    const totalKeep = items?.filter(i => i.tryStatus === "keep").length || 0;
    const totalReturn = items?.filter(i => i.tryStatus === "return").length || 0;

    return (
      <>
        {/* Confirm Selection Modal */}
        <Modalize
          ref={ref}
          adjustToContentHeight
          modalStyle={styles.modal}
          handleStyle={styles.handle}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Confirm Selection</Text>
            <Text style={styles.subtitle}>
              Haandover Return Items & Share OTP 
            </Text>
            {/* 🔥 Show OTP here */}
            {otp && (
              <Text style={styles.otpText}>
                OTP: {otp}
              </Text>
            )}
            <View style={styles.countContainer}>
              <Text style={styles.countText}>
                Total Selected: <Text style={styles.bold}>{totalKeep}</Text>
              </Text>
              <Text style={styles.countText}>
                Total Return: <Text style={styles.bold}>{totalReturn}</Text>
              </Text>
              <Text style={styles.totalPay}>
                Total Payable : <Text style={styles.bold}>{totalPayable}</Text>
              </Text>
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
                onPress={confirmClothSelection}
              >
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modalize>

        {/* Handover Modal */}
        <HandovrModal ref={handoverModalRef} onConfirm={() => { }} />
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
    marginBottom:40
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  otpText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 15,
  },
  countContainer: {
    width: "100%",
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb"
  },
  countText: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 4,
  },
    totalPay: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6b7280",
    // marginBottom: 20,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
  },
  confirmButton: {
    backgroundColor: "#111827",
  },
  cancelText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
