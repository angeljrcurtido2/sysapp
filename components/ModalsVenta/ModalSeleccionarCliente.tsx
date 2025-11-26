// components/modals/ModalSeleccionarCliente.tsx
import React from "react";
import {
  Modal,
  View,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import ListarCliente from "app/clientes/components/ListarCliente";

interface ModalSeleccionarClienteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (producto: any) => void;
}

export default function ModalSeleccionarCliente({
  isOpen,
  onClose,
  onSelect,
}: ModalSeleccionarClienteProps) {
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
              {/* Listado en modo selección */}
              <ListarCliente onSelect={onSelect} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
