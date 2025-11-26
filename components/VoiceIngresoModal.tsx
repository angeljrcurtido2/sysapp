import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import VoiceRecognition from "./VoiceRecognitionNative";
import ModalSuccess from "./ModalSuccess";
import { useVoiceToIncome, ParsedIncome } from "../hooks/useVoiceToIncome";

interface VoiceIngresoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngresoRegistrado?: (ingreso: ParsedIncome) => void;
}

const VoiceIngresoModal = ({
  isOpen,
  onClose,
  onIngresoRegistrado,
}: VoiceIngresoModalProps) => {
  const { parseVoiceToIncome, isProcessing, error } = useVoiceToIncome();
  const [parsedData, setParsedData] = useState<ParsedIncome | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const handleVoiceResult = async (text: string) => {
    try {
      setVoiceError(null);
      console.log("📝 Procesando texto:", text);

      const data = await parseVoiceToIncome(text);

      if (data) {
        setParsedData(data);
        console.log("✅ Datos extraídos:", data);
      }
    } catch (err: any) {
      console.error("❌ Error:", err);
      setVoiceError("Error al procesar el comando");
    }
  };

  const handleVoiceError = (errorMsg: string) => {
    setVoiceError(errorMsg);
  };

  const handleConfirm = () => {
    if (parsedData) {
      onIngresoRegistrado?.(parsedData);
      setShowSuccess(true);

      // Cerrar modal después de mostrar éxito
      setTimeout(() => {
        setShowSuccess(false);
        setParsedData(null);
        onClose();
      }, 2000);
    }
  };

  const handleCancel = () => {
    setParsedData(null);
    setVoiceError(null);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <>
      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={onClose}
        presentationStyle={Platform.OS === "ios" ? "overFullScreen" : undefined}
      >
        <View style={styles.backdrop}>
          <View className="w-full max-w-2xl mx-auto" style={styles.modalContainer}>
            <ScrollView
              className="bg-white rounded-3xl overflow-hidden"
              contentContainerStyle={styles.scrollContent}
            >
              {/* Header */}
              <LinearGradient
                colors={["#3b82f6", "#2563eb", "#1d4ed8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-6 py-6"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="bg-white/20 rounded-full p-3 mr-3">
                      <Ionicons name="mic" size={24} color="#fff" />
                    </View>
                    <Text className="text-white text-xl font-bold">
                      Registrar Ingreso por Voz
                    </Text>
                  </View>
                  <Pressable
                    onPress={onClose}
                    className="bg-white/20 rounded-full p-2"
                  >
                    <Ionicons name="close" size={24} color="#fff" />
                  </Pressable>
                </View>
              </LinearGradient>

              {/* Contenido */}
              <View className="px-6 py-6">
                {/* Componente de reconocimiento de voz */}
                <VoiceRecognition
                  onResult={handleVoiceResult}
                  onError={handleVoiceError}
                  placeholder="Di algo como: 'Registrar un ingreso de 150 dólares por venta de equipos'"
                  enableProcessing={isProcessing}
                />

                {/* Error de voz */}
                {(voiceError || error) && (
                  <View className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                    <View className="flex-row items-center">
                      <Ionicons name="alert-circle" size={20} color="#dc2626" />
                      <Text className="ml-2 text-red-700 font-medium">
                        {voiceError || error}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Datos parseados */}
                {parsedData && (
                  <View className="mt-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4">
                      📊 Datos Extraídos:
                    </Text>

                    <View className="bg-gray-50 rounded-xl p-4 space-y-3">
                      {/* Monto */}
                      <View className="flex-row items-center justify-between py-2 border-b border-gray-200">
                        <Text className="text-gray-600 font-medium">Monto:</Text>
                        <Text className="text-xl font-bold text-green-600">
                          ${parsedData.monto.toFixed(2)}
                        </Text>
                      </View>

                      {/* Concepto */}
                      <View className="flex-row items-center justify-between py-2 border-b border-gray-200">
                        <Text className="text-gray-600 font-medium">Concepto:</Text>
                        <Text className="text-gray-800 font-semibold">
                          {parsedData.concepto}
                        </Text>
                      </View>

                      {/* Tipo */}
                      <View className="flex-row items-center justify-between py-2 border-b border-gray-200">
                        <Text className="text-gray-600 font-medium">Tipo:</Text>
                        <View className="bg-blue-100 px-3 py-1 rounded-full">
                          <Text className="text-blue-700 font-semibold text-xs">
                            {parsedData.tipo_movimiento}
                          </Text>
                        </View>
                      </View>

                      {/* Observaciones */}
                      {parsedData.observaciones && (
                        <View className="py-2 border-b border-gray-200">
                          <Text className="text-gray-600 font-medium mb-1">
                            Observaciones:
                          </Text>
                          <Text className="text-gray-700">
                            {parsedData.observaciones}
                          </Text>
                        </View>
                      )}

                      {/* Confianza */}
                      <View className="flex-row items-center justify-between py-2">
                        <Text className="text-gray-600 font-medium">
                          Confianza:
                        </Text>
                        <View className="flex-row items-center">
                          <View className="bg-gray-200 rounded-full h-2 w-24 mr-2">
                            <View
                              className={`h-2 rounded-full ${
                                parsedData.confidence >= 80
                                  ? "bg-green-500"
                                  : parsedData.confidence >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${parsedData.confidence}%` }}
                            />
                          </View>
                          <Text
                            className={`font-bold ${getConfidenceColor(
                              parsedData.confidence
                            )}`}
                          >
                            {parsedData.confidence}%
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Botones de acción */}
                    <View className="flex-row mt-6 space-x-3">
                      <Pressable
                        onPress={handleCancel}
                        className="flex-1 bg-gray-200 rounded-xl py-4 mr-2 active:opacity-80"
                      >
                        <Text className="text-center text-gray-700 font-semibold">
                          Cancelar
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={handleConfirm}
                        className="flex-1 rounded-xl overflow-hidden active:opacity-90"
                      >
                        <LinearGradient
                          colors={["#10b981", "#059669"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          className="py-4"
                        >
                          <Text className="text-center text-white font-semibold">
                            Confirmar y Registrar
                          </Text>
                        </LinearGradient>
                      </Pressable>
                    </View>
                  </View>
                )}

                {/* Instrucciones */}
                {!parsedData && !isProcessing && (
                  <View className="mt-6 bg-blue-50 rounded-xl p-4">
                    <View className="flex-row items-start">
                      <Ionicons name="information-circle" size={20} color="#2563eb" />
                      <View className="ml-2 flex-1">
                        <Text className="text-blue-800 font-semibold mb-2">
                          Ejemplos de comandos:
                        </Text>
                        <Text className="text-blue-700 text-sm leading-5">
                          • "Registrar 150 dólares por venta de equipos"{"\n"}
                          • "Ingreso de 50 pesos por servicio técnico"{"\n"}
                          • "Anotar 75 dólares de reparación"{"\n"}
                          • "Venta de productos por 200 dólares"
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de éxito */}
      <ModalSuccess
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message={`Ingreso de $${parsedData?.monto || 0} registrado exitosamente`}
        title="¡Ingreso Registrado!"
        autoClose
        autoCloseDelay={2000}
      />
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
    padding: 16,
  },
  modalContainer: {
    maxHeight: "90%",
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default VoiceIngresoModal;
