// components/modals/ModalCrearCliente.tsx
import {
  Modal,
  View,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import CrearCliente from "../CrearCliente";
import { Ionicons } from "@expo/vector-icons";

interface ModalCrearClienteProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalCrearCliente({
  isOpen,
  onClose,
  onSuccess,
}: ModalCrearClienteProps) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
      presentationStyle={Platform.OS === "ios" ? "overFullScreen" : undefined}
    >
      {/* Fondo presionable que cierra el modal */}
      <Pressable 
        className="flex-1 bg-black/50 justify-center items-center p-4"
        onPress={onClose}
      >
        {/* Contenido del modal que NO cierra cuando se presiona */}
        <Pressable 
          className="bg-white rounded-2xl w-full max-w-2xl max-h-[90%] overflow-hidden"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Botón de cerrar */}
          <View className="absolute top-4 right-4 z-10">
            <Pressable
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full bg-gray-200 active:bg-gray-300"
            >
              <Ionicons name="close" size={20} color="#374151" />
            </Pressable>
          </View>

          {/* Panel del modal */}
          <View className="w-full bg-white rounded-2xl" style={{ maxHeight: '90%' }}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              className="px-6 pt-6 pb-4"
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <CrearCliente onSuccess={onSuccess} onClose={onClose} />
            </ScrollView>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
