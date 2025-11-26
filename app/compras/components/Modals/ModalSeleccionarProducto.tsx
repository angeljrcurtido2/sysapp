import React from 'react';
import {
  Modal,
  View,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import ListarProductos from '@/app/producto/components/ListarProductos';

interface ModalSeleccionarProductoProps {
  isOpen: boolean;
  isBuy: boolean;
  onClose: () => void;
  setCantidadMaximo?: (cantidad: number) => void;
  setCantidadProducto: (cantidad: number) => void;
  configVentaPorLote?: boolean;
  cantidadProducto?: number;
  detalles?: any[];
  onSelect: (producto: any) => void;
  stockVerify?: boolean;
}

const ModalSeleccionarProducto: React.FC<ModalSeleccionarProductoProps> = ({
  isOpen,
  isBuy,
  onClose,
  setCantidadMaximo,
  setCantidadProducto,
  configVentaPorLote = false,
  cantidadProducto,
  detalles,
  onSelect,
  stockVerify = false,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
      presentationStyle={Platform.OS === "ios" ? "overFullScreen" : undefined}
    >
      <View className="flex-1 items-center justify-center bg-black/50 p-4">
        {/* Backdrop - solo toca el fondo */}
        <Pressable
          onPress={onClose}
          className="absolute inset-0"
        />

        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          className="h-[85%]"
        >
          <View
            className="self-center rounded-2xl bg-white p-6"
   
          >
            <ListarProductos
              isBuy={isBuy}
              configVentaPorLote={configVentaPorLote}
              onSelect={onSelect}
              detalles={detalles}
              setCantidadProducto={setCantidadProducto}
              cantidadProducto={cantidadProducto}
              stockVerify={stockVerify}
              setCantidadMaximo={setCantidadMaximo}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default ModalSeleccionarProducto;