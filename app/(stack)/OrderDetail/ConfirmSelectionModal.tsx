import React, { forwardRef, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Modalize } from "react-native-modalize";
import HandovrModal from "./HandoverModal";

interface ConfirmSelectionModalProps {
  onCancel: () => void;
}

const ConfirmSelectionModal = forwardRef<Modalize, ConfirmSelectionModalProps>(
  ({ onCancel }, ref) => {
    // Ref for the handover modal
    const handoverModalRef = useRef<Modalize>(null);

    const handleCancel = () => {
      onCancel?.();
    };

    const handleFinalConfirm = () => {
      // Close current modal
      (ref as any)?.current?.close();
      // Open handover modal
      handoverModalRef.current?.open();
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
                onPress={handleFinalConfirm}
              >
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modalize>

        {/* Handover Modal */}
        <HandovrModal ref={handoverModalRef} otp="1234" onConfirm={() => {}} />
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
