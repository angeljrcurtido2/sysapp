import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useTextToExpense, ParsedExpense } from "../hooks/useTextToExpense";

interface ChatEgresoModalProps {
  visible: boolean;
  onClose: () => void;
  onEgresoRegistrado?: (data: ParsedExpense) => void;
}

/**
 * Modal para registrar egresos mediante texto/chat
 * Reemplaza la funcionalidad de voz con entrada de texto
 */
const ChatEgresoModal: React.FC<ChatEgresoModalProps> = ({
  visible,
  onClose,
  onEgresoRegistrado,
}) => {
  const [textInput, setTextInput] = useState("");
  const [parsedData, setParsedData] = useState<ParsedExpense | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { parseAndRegisterExpense, isProcessing, error } = useTextToExpense();

  const handleSubmit = async () => {
    if (!textInput.trim()) {
      return;
    }

    console.log("📝 Procesando texto:", textInput);

    // Parsear Y registrar directamente en la BD
    const data = await parseAndRegisterExpense(textInput);

    if (data) {
      console.log("📊 Egreso registrado:", data);
      setParsedData(data);
      onEgresoRegistrado?.(data);
      setShowSuccess(true);

      // Limpiar después de 2 segundos
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    setTextInput("");
    setParsedData(null);
    setShowSuccess(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>💬 Registrar Egreso por Chat</Text>

            <ScrollView style={styles.scrollView}>
              {/* Input de texto */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Describe el egreso:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ej: Registrar egreso de 50000 gs por compra de insumos"
                  placeholderTextColor="#999"
                  value={textInput}
                  onChangeText={setTextInput}
                  multiline
                  numberOfLines={3}
                  editable={!isProcessing}
                />
              </View>

              {/* Ejemplos */}
              <View style={styles.examplesContainer}>
                <Text style={styles.examplesTitle}>Ejemplos:</Text>
                <Text style={styles.exampleText}>
                  • "Egreso de 30000 por pago de servicios"
                </Text>
                <Text style={styles.exampleText}>
                  • "Compra de insumos por 50000 guaraníes"
                </Text>
                <Text style={styles.exampleText}>• "Gastos varios 20000 gs"</Text>
              </View>

              {/* Datos parseados */}
              {parsedData && !showSuccess && (
                <View style={styles.parsedDataContainer}>
                  <Text style={styles.parsedTitle}>📋 Datos extraídos:</Text>
                  <Text style={styles.parsedText}>💰 Monto: {parsedData.monto}</Text>
                  <Text style={styles.parsedText}>📝 Concepto: {parsedData.concepto}</Text>
                  {parsedData.observaciones && (
                    <Text style={styles.parsedText}>
                      📌 Observaciones: {parsedData.observaciones}
                    </Text>
                  )}
                  <Text style={styles.parsedText}>
                    🎯 Confianza: {parsedData.confidence}%
                  </Text>
                </View>
              )}

              {/* Mensaje de éxito */}
              {showSuccess && (
                <View style={styles.successContainer}>
                  <Text style={styles.successText}>✅ Egreso registrado exitosamente</Text>
                  {parsedData && (
                    <>
                      <Text style={styles.successDetail}>
                        Monto: {parsedData.monto} Gs
                      </Text>
                      <Text style={styles.successDetail}>
                        Concepto: {parsedData.concepto}
                      </Text>
                    </>
                  )}
                </View>
              )}

              {/* Error */}
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>❌ {error}</Text>
                </View>
              )}
            </ScrollView>

            {/* Botones */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
                disabled={isProcessing || !textInput.trim()}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>🚀 Registrar Egreso</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={handleClose}
                disabled={isProcessing}
              >
                <Text style={styles.buttonTextClose}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  scrollView: {
    maxHeight: 400,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    minHeight: 80,
    textAlignVertical: "top",
  },
  examplesContainer: {
    backgroundColor: "#f0f8ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  examplesTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    color: "#0066cc",
  },
  exampleText: {
    fontSize: 12,
    color: "#555",
    marginBottom: 4,
  },
  parsedDataContainer: {
    backgroundColor: "#e8f5e9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  parsedTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#2e7d32",
  },
  parsedText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
  },
  successContainer: {
    backgroundColor: "#d4edda",
    padding: 15,
    borderRadius: 8,
    borderColor: "#c3e6cb",
    borderWidth: 1,
    marginBottom: 15,
  },
  successText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#155724",
    marginBottom: 8,
    textAlign: "center",
  },
  successDetail: {
    fontSize: 14,
    color: "#155724",
    textAlign: "center",
    marginTop: 4,
  },
  errorContainer: {
    backgroundColor: "#f8d7da",
    padding: 12,
    borderRadius: 8,
    borderColor: "#f5c6cb",
    borderWidth: 1,
    marginBottom: 15,
  },
  errorText: {
    fontSize: 13,
    color: "#721c24",
  },
  buttonContainer: {
    marginTop: 15,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#dc3545",
  },
  closeButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextClose: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ChatEgresoModal;
