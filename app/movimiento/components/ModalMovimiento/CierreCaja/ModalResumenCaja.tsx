// components/modals/ModalResumenCaja.tsx
import React from "react";
import {
  Modal,
  View,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import CajaResumen from "../../CierreCaja/CajaResumen";

interface ModalResumenCajaProps {
  isOpen: boolean;
  idmovimiento: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ModalResumenCaja({
  isOpen,
  onClose,
  onSuccess,
  idmovimiento,
}: ModalResumenCajaProps) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose} // back en Android
      presentationStyle={Platform.OS === "ios" ? "overFullScreen" : undefined}
    >
      <View className="flex-1 items-center justify-center bg-black/50 p-4">
        {/* Backdrop - solo toca el fondo */}
        <Pressable
          onPress={onClose}
          className="absolute inset-0"
        />

        {/* Panel: evita que el tap interno cierre el modal */}
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          className="w-full max-w-[95%]"
        >
          <View
            className="w-full max-h-[90%] self-center rounded-2xl bg-white overflow-hidden"
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <CajaResumen
                idmovimiento={idmovimiento}
                onClose={onClose}
                onSuccess={onSuccess}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
