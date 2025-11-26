// components/modals/ModalSeleccionarProveedor.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import ListarProveedores from "../../../proveedor/components/ListarProveedores";

interface ModalSeleccionarProveedorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (proveedor: any) => void;
}

export default function ModalSeleccionarProveedor({
  isOpen,
  onClose,
  onSelect,
}: ModalSeleccionarProveedorProps) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose} // back en Android
      presentationStyle={Platform.OS === "ios" ? "overFullScreen" : undefined}
    >
      <View className="flex-1 items-center justify-center bg-black/30 p-4">
        {/* Backdrop - solo toca el fondo */}

        {/* Panel: evita que el tap interno cierre el modal */}
        <KeyboardAvoidingView

          className="w-auto h-[90%]"
        >
       
          <View
            className="self-center w-full max-w-md rounded-2xl bg-white p-6"
          >
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <ListarProveedores onSelect={onSelect} onClose={onClose}/>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
