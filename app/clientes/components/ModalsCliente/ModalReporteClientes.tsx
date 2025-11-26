import {
  Modal,
  View,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import ReporteClientes from "../ReporteClientes";
import { Ionicons } from "@expo/vector-icons";

interface Cliente {
  idcliente: number;
  nombre: string;
  apellido: string;
  tipo: string;
  numDocumento: string;
  telefono: string;
  direccion: string;
  genero: string;
  estado: string;
  tipo_cliente: string;
  total_compras?: number;
}

interface ReporteData {
  clientes: Cliente[];
  estadisticas: {
    totalClientes: number;
    activos: number;
    inactivos: number;
    totalCompras: number;
  };
}

interface ModalReporteClientesProps {
  isOpen: boolean;
  onClose: () => void;
  reporte: ReporteData;
}

export default function ModalReporteClientes({
  isOpen,
  onClose,
  reporte,
}: ModalReporteClientesProps) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
      presentationStyle={Platform.OS === "ios" ? "overFullScreen" : undefined}
    >


          {/* Panel del modal */}
          <View className="w-full bg-white rounded-2xl" style={{ maxHeight: '80%' }}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              className="px-6 pt-6 pb-4"
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <ReporteClientes reporte={reporte} onClose={onClose} />
            </ScrollView>
          </View>

  
    </Modal>
  );
}
