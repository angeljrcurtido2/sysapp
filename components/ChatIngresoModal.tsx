import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import ModalSuccess from "./ModalSuccess";
import { useTextToIncome, ParsedIncome } from "../hooks/useTextToIncome";

interface ChatIngresoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngresoRegistrado?: (ingreso: ParsedIncome) => void;
}

const ChatIngresoModal = ({
  isOpen,
  onClose,
  onIngresoRegistrado,
}: ChatIngresoModalProps) => {
  const { parseAndRegisterIncome, isProcessing, error } = useTextToIncome();
  const [parsedData, setParsedData] = useState<ParsedIncome | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [chatError, setChatError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus en el input cuando se abre el modal
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      // Limpiar cuando se cierra
      setTextInput("");
      setParsedData(null);
      setChatError(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!textInput.trim()) {
      setChatError("Por favor, escribe un comando");
      return;
    }

    try {
      setChatError(null);
      console.log("📝 Procesando y registrando:", textInput);

      // Usar parseAndRegisterIncome que parsea Y registra automáticamente
      const data = await parseAndRegisterIncome(textInput);

      if (data) {
        setParsedData(data);
        console.log("✅ Ingreso registrado en BD:", data);
        setTextInput(""); // Limpiar input después de procesar

        // Llamar al callback si existe
        onIngresoRegistrado?.(data);

        // Mostrar modal de éxito
        setShowSuccess(true);

        // Cerrar modal después de mostrar éxito
        setTimeout(() => {
          setShowSuccess(false);
          setParsedData(null);
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      console.error("❌ Error:", err);
      setChatError("Error al procesar el comando");
    }
  };

  const handleConfirm = () => {
    // Ya no necesitamos este método porque el registro se hace en handleSubmit
    // Pero lo mantenemos por compatibilidad
    if (parsedData) {
      onIngresoRegistrado?.(parsedData);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setParsedData(null);
        onClose();
      }, 2000);
    }
  };

  const handleCancel = () => {
    setParsedData(null);
    setChatError(null);
    setTextInput("");
  };

  const handleQuickCommand = (command: string) => {
    setTextInput(command);
    inputRef.current?.focus();
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.backdrop}>
            <View className="w-full max-w-2xl mx-auto" style={styles.modalContainer}>
              <ScrollView
                className="bg-white rounded-3xl overflow-hidden"
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
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
                        <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
                      </View>
                      <Text className="text-white text-xl font-bold">
                        Registrar Ingreso por Chat
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
                  {/* Input de chat */}
                  <View className="mb-4">
                    <Text className="text-gray-700 font-semibold mb-2">
                      Escribe tu comando:
                    </Text>
                    <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
                      <TextInput
                        ref={inputRef}
                        value={textInput}
                        onChangeText={setTextInput}
                        placeholder="Ej: Registrar un ingreso de 150 dólares por venta de equipos"
                        placeholderTextColor="#9ca3af"
                        className="flex-1 text-gray-800 text-base"
                        multiline
                        onSubmitEditing={handleSubmit}
                        editable={!isProcessing && !parsedData}
                      />
                    </View>

                    {/* Botón Enviar */}
                    {!parsedData && (
                      <Pressable
                        onPress={handleSubmit}
                        disabled={isProcessing || !textInput.trim()}
                        className={`mt-3 rounded-xl overflow-hidden ${
                          isProcessing || !textInput.trim() ? "opacity-50" : ""
                        }`}
                      >
                        <LinearGradient
                          colors={["#3b82f6", "#2563eb"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          className="py-3 px-6 flex-row items-center justify-center"
                        >
                          <Ionicons name="send" size={20} color="#fff" />
                          <Text className="text-white font-semibold ml-2">
                            {isProcessing ? "Procesando..." : "Enviar"}
                          </Text>
                        </LinearGradient>
                      </Pressable>
                    )}
                  </View>

                  {/* Error */}
                  {(chatError || error) && (
                    <View className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                      <View className="flex-row items-center">
                        <Ionicons name="alert-circle" size={20} color="#dc2626" />
                        <Text className="ml-2 text-red-700 font-medium">
                          {chatError || error}
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

                  {/* Comandos rápidos */}
                  {!parsedData && !isProcessing && (
                    <View className="mt-6 bg-blue-50 rounded-xl p-4">
                      <View className="flex-row items-start mb-3">
                        <Ionicons name="information-circle" size={20} color="#2563eb" />
                        <Text className="ml-2 text-blue-800 font-semibold">
                          Ejemplos de comandos:
                        </Text>
                      </View>

                      {[
                        "Registrar 150 por venta de equipos",
                        "Ingreso de 50 por servicio técnico",
                        "Anotar 75 de reparación",
                        "Venta de productos por 200"
                      ].map((command, index) => (
                        <Pressable
                          key={index}
                          onPress={() => handleQuickCommand(command)}
                          className="bg-white border border-blue-200 rounded-lg px-3 py-2 mb-2 active:bg-blue-100"
                        >
                          <Text className="text-blue-700 text-sm">
                            💬 {command}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
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

export default ChatIngresoModal;
