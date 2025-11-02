import React, { forwardRef, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Modalize } from "react-native-modalize";
import HandovrModal from "./HandoverModal";
import * as SecureStore from 'expo-secure-store';
import { ConfirmClothSelection } from "../../api/orderApis";

interface ConfirmSelectionModalProps {
  onCancel: () => void;
  order: any;
  onConfirm: (method?: string) => void;
}

const ConfirmSelectionModal = forwardRef<Modalize, ConfirmSelectionModalProps>(
  ({ onCancel, order, onConfirm }, ref) => {
    const handoverModalRef = useRef<Modalize>(null);

    const handleCancel = () => onCancel?.();

    const confirmClothSelection = async () => {
      try {
        const res = await ConfirmClothSelection(order);
        console.log("✅ API Response:", res);

        // Close current modal
        (ref as any)?.current?.close();

        // Open handover modal only if API call succeeded
        if (res?.status === 200 || res?.success) {
          handoverModalRef.current?.open();

          // ✅ Set trial phase complete flag in SecureStore
          await SecureStore.setItemAsync(`trialPhaseComplete_${order}`, "true");
        } else {
          console.warn("API did not return success:", res);
        }
      } catch (error) {
        console.error("❌ Error confirming cloth selection:", error);
      }
    };

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
              Do you confirm your outfits selection?
            </Text>

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
        <HandovrModal ref={handoverModalRef} onConfirm={onConfirm} />
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
