import React, { forwardRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Modalize } from "react-native-modalize";
import { useRouter } from "expo-router";
import { CheckCircle, XCircle } from "lucide-react-native";

interface PaymentConfirmationModalProps {
  onConfirm: (method: string, status: "success" | "failed") => void;
}

const PaymentConfirmationModal = forwardRef<Modalize, PaymentConfirmationModalProps>(
  ({ onConfirm }, ref) => {
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

    // Popup State
    const [popupVisible, setPopupVisible] = useState(false);

    const paymentMethods = [
      { id: "upi", label: "UPI (Google Pay, PhonePe, Paytm)" },
      { id: "card", label: "Credit / Debit Card" },
      { id: "cod", label: "Cash on Delivery" },
    ];

    const handleConfirmPayment = () => {
      if (!selectedMethod) return;
      setPopupVisible(true); // open popup
    };

    const router = useRouter();

    const handlePaymentResult = (result: "success" | "failed") => {
      setPopupVisible(false);

      if (result === "success") {
        router.replace("/(stack)/OrderDetail/OrderCompleteSucess");
      } else {
        router.replace("/(stack)/OrderDetail/FailureReturnPage");
      }

      onConfirm(selectedMethod!, result);
    };

    return (
      <>
        {/* Main Payment Modal */}
        <Modalize
          ref={ref}
          adjustToContentHeight
          modalStyle={styles.modal}
          handleStyle={styles.handle}
        >
          <View style={styles.container}>
            <View style={styles.iconWrapper}>
              <CheckCircle size={38} color="#10b981" />
            </View>

            <Text style={styles.title}>Confirm Payment</Text>
            <Text style={styles.subtitle}>
              Please choose your payment method to complete your purchase.
            </Text>

            {/* Payment method selection */}
            <View style={styles.methodList}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodRow,
                    selectedMethod === method.id && styles.methodRowSelected,
                  ]}
                  onPress={() => setSelectedMethod(method.id)}
                >
                  <Text
                    style={[
                      styles.methodText,
                      selectedMethod === method.id && styles.methodTextSelected,
                    ]}
                  >
                    {method.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                !selectedMethod && { opacity: 0.5 },
              ]}
              disabled={!selectedMethod}
              onPress={handleConfirmPayment}
            >
              <Text style={styles.confirmText}>
                {selectedMethod ? "Pay Now" : "Select a Method"}
              </Text>
            </TouchableOpacity>
          </View>
        </Modalize>

        {/* Success/Fail Selection Popup */}
        <Modal transparent visible={popupVisible} animationType="fade">
          <View style={styles.popupOverlay}>
            <View style={styles.popupBox}>

              <Text style={styles.popupTitle}>Select Result</Text>
              <Text style={styles.popupMessage}>
                Choose payment result for testing flow.
              </Text>

              <TouchableOpacity
                style={[styles.resultButton, { backgroundColor: "#10b981" }]}
                onPress={() => handlePaymentResult("success")}
              >
                <Text style={styles.resultText}>Success</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.resultButton, { backgroundColor: "#ef4444" }]}
                onPress={() => handlePaymentResult("failed")}
              >
                <Text style={styles.resultText}>Failure</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
      </>
    );
  }
);

export default PaymentConfirmationModal;

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
  },
  iconWrapper: {
    marginBottom: 15,
    backgroundColor: "#ecfdf5",
    borderRadius: 50,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 20,
    lineHeight: 20,
  },
  methodList: {
    width: "100%",
    marginBottom: 25,
  },
  methodRow: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "#f9fafb",
  },
  methodRowSelected: {
    backgroundColor: "#11182710",
    borderColor: "#111827",
  },
  methodText: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },
  methodTextSelected: {
    color: "#111827",
    fontWeight: "700",
  },
  confirmButton: {
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Popup Styles
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupBox: {
    backgroundColor: "#fff",
    width: "75%",
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  popupMessage: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 15,
  },

  resultButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  resultText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
