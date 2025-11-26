// components/modals/ModalListarClienteDVenta.tsx
import React from "react";
import {
  Modal,
  View,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import ListarClienteDVenta from "../CobroDeudaVenta/ListarClienteDVenta";

interface ModalListarClienteDVentaProps {
  isOpen: boolean;
  onClose: () => void;
  nombreCliente: string;

  disableSearch?: boolean;
  setEstadoCliente?: (estado: string) => void;
  generateReport?: () => void;
}

export default function ModalListarClienteDVenta({
  isOpen,
  onClose,
  nombreCliente,
  disableSearch = false,
  setEstadoCliente,
  generateReport,
}: ModalListarClienteDVentaProps) {

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
            className="w-full max-w-[1200px] max-h-[85%] rounded-2xl bg-white overflow-hidden"
        
          >
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            <ListarClienteDVenta
                nombreCliente={nombreCliente}
                disableSearch={disableSearch}
                setEstadoCliente={setEstadoCliente}
                generateReport={generateReport}
              />

            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
