import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import ChatEgresoModal from "./ChatEgresoModal";
import { ParsedExpense } from "../hooks/useTextToExpense";

/**
 * Componente de ejemplo para demostrar el uso del ChatEgresoModal
 */
const EjemploChatEgreso: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [historial, setHistorial] = useState<ParsedExpense[]>([]);

  const handleEgresoRegistrado = (data: ParsedExpense) => {
    console.log("✅ Egreso registrado desde ejemplo:", data);
    setHistorial((prev) => [data, ...prev]);
  };

  const comandosRapidos = [
    "Egreso de 30000 por pago de servicios",
    "Compra de insumos por 50000 guaraníes",
    "Gastos varios 20000 gs",
    "Pago de alquiler 150000",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💬 Chat de Egresos - Ejemplo</Text>

      <TouchableOpacity
        style={styles.openButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.openButtonText}>Abrir Chat de Egresos</Text>
      </TouchableOpacity>

      {/* Comandos rápidos */}
      <View style={styles.quickCommandsContainer}>
        <Text style={styles.sectionTitle}>📝 Comandos de ejemplo:</Text>
        {comandosRapidos.map((comando, index) => (
          <View key={index} style={styles.commandItem}>
            <Text style={styles.commandText}>• {comando}</Text>
          </View>
        ))}
      </View>

      {/* Historial */}
      {historial.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>📋 Historial de egresos:</Text>
          <ScrollView style={styles.historyScroll}>
            {historial.map((egreso, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyMonto}>💰 {egreso.monto} Gs</Text>
                <Text style={styles.historyConcepto}>{egreso.concepto}</Text>
                {egreso.observaciones && (
                  <Text style={styles.historyObs}>
                    📌 {egreso.observaciones}
                  </Text>
                )}
                <Text style={styles.historyDate}>
                  🕐 {egreso.fecha} {egreso.hora}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <ChatEgresoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onEgresoRegistrado={handleEgresoRegistrado}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  openButton: {
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  openButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  quickCommandsContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  commandItem: {
    paddingVertical: 5,
  },
  commandText: {
    fontSize: 14,
    color: "#555",
  },
  historyContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    flex: 1,
  },
  historyScroll: {
    maxHeight: 300,
  },
  historyItem: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#dc3545",
  },
  historyMonto: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#dc3545",
    marginBottom: 4,
  },
  historyConcepto: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  historyObs: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 11,
    color: "#999",
  },
});

export default EjemploChatEgreso;
