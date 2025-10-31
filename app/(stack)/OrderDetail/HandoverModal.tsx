import React, { forwardRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Modalize } from "react-native-modalize";
import { CheckCircle } from "lucide-react-native";

interface PaymentConfirmationModalProps {
  onConfirm: (method: string) => void;
}

const PaymentConfirmationModal = forwardRef<Modalize, PaymentConfirmationModalProps>(
  ({ onConfirm }, ref) => {
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

    const paymentMethods = [
      { id: "upi", label: "UPI (Google Pay, PhonePe, Paytm)" },
      { id: "card", label: "Credit / Debit Card" },
      { id: "cod", label: "Cash on Delivery" },
    ];

    const handleConfirmPayment = () => {
      if (!selectedMethod) return;
      onConfirm(selectedMethod);
    };

    return (
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
});
