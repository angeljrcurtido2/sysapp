// components/modals/ModalCrearVenta.tsx
import React from "react";
import {
  Modal,
  View,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import CrearVenta from "../CrearVenta";

interface ModalCrearVentaProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ModalCrearVenta({
  isOpen,
  onClose,
  onSuccess,
}: ModalCrearVentaProps) {
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
          className="w-full "
        >
          <View
            className="w-full h-[90%] self-center rounded-2xl bg-white p-6"
            
          >
   
              {/* Mantengo la misma API que tu componente original */}
              <CrearVenta onSuccess={onSuccess} />
  
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
