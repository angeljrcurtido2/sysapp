// components/modals/ModalCrearIngresosVarios.tsx
import React from "react";
import {
  Modal,
  View,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import CrearIngresosVarios from "../CrearIngresosVarios";

interface ModalCrearIngresosVariosProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ModalCrearIngresosVarios({
  isOpen,
  onClose,
  onSuccess,
}: ModalCrearIngresosVariosProps) {
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
          className="w-full"
        >
          <View
            className="w-full  h-[85%] max-w-[980px] self-center "

          >
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <CrearIngresosVarios onSuccess={onSuccess} onClose={onClose} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
