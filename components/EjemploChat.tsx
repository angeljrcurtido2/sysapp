/**
 * EJEMPLO DE USO DEL SISTEMA DE CHAT PARA REGISTRO DE INGRESOS
 *
 * Este componente demuestra cómo usar el módulo de chat en tu aplicación
 */

import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ChatIngresoModal from './ChatIngresoModal';
import ModalSuccess from './ModalSuccess';
import type { ParsedIncome } from '../hooks/useTextToIncome';

export default function EjemploChat() {
  const [showChatModal, setShowChatModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [ultimoIngreso, setUltimoIngreso] = useState<ParsedIncome | null>(null);
  const [historial, setHistorial] = useState<ParsedIncome[]>([]);

  const handleIngresoRegistrado = (ingreso: ParsedIncome) => {
    console.log('📊 Ingreso registrado:', ingreso);

    // Guardar en el historial
    setHistorial(prev => [ingreso, ...prev]);
    setUltimoIngreso(ingreso);

    // Aquí normalmente harías la llamada a tu API para guardar en BD
    // await registrarIngreso(ingreso);

    // Mostrar mensaje de éxito
    setShowSuccess(true);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="chatbubble-ellipses" size={40} color="#3b82f6" />
        <Text style={styles.title}>Sistema de Chat con IA</Text>
        <Text style={styles.subtitle}>
          Registra ingresos escribiendo comandos de texto con IA
        </Text>
      </View>

      {/* Botón principal */}
      <Pressable
        style={styles.mainButton}
        onPress={() => setShowChatModal(true)}
      >
        <View style={styles.buttonContent}>
          <Ionicons name="chatbox-ellipses" size={48} color="#fff" />
          <Text style={styles.buttonText}>Registrar por Chat</Text>
          <Text style={styles.buttonSubtext}>
            Toca para escribir
          </Text>
        </View>
      </Pressable>

      {/* Instrucciones */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>
          💡 Ejemplos de comandos:
        </Text>
        <Text style={styles.instructionItem}>
          • "Registrar un ingreso de 150 por venta de equipos"
        </Text>
        <Text style={styles.instructionItem}>
          • "Ingreso de 50 por servicio técnico"
        </Text>
        <Text style={styles.instructionItem}>
          • "Anotar 75 de reparación"
        </Text>
      </View>

      {/* Último ingreso */}
      {ultimoIngreso && (
        <View style={styles.lastIncomeCard}>
          <Text style={styles.cardTitle}>✅ Último Ingreso Registrado</Text>
          <View style={styles.incomeDetails}>
            <View style={styles.incomeRow}>
              <Text style={styles.incomeLabel}>Monto:</Text>
              <Text style={styles.incomeValue}>${ultimoIngreso.monto}</Text>
            </View>
            <View style={styles.incomeRow}>
              <Text style={styles.incomeLabel}>Concepto:</Text>
              <Text style={styles.incomeValue}>{ultimoIngreso.concepto}</Text>
            </View>
            <View style={styles.incomeRow}>
              <Text style={styles.incomeLabel}>Tipo:</Text>
              <Text style={styles.incomeTag}>{ultimoIngreso.tipo_movimiento}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Historial */}
      {historial.length > 0 && (
        <View style={styles.historyCard}>
          <Text style={styles.cardTitle}>📋 Historial ({historial.length})</Text>
          {historial.slice(0, 5).map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyAmount}>${item.monto}</Text>
              <Text style={styles.historyConcept}>{item.concepto}</Text>
              <Text style={styles.historyConfidence}>{item.confidence}%</Text>
            </View>
          ))}
        </View>
      )}

      {/* Modal de chat */}
      <ChatIngresoModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        onIngresoRegistrado={handleIngresoRegistrado}
      />

      {/* Modal de éxito */}
      <ModalSuccess
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message={`Ingreso de $${ultimoIngreso?.monto || 0} registrado exitosamente`}
        title="¡Ingreso Registrado!"
        autoClose
        autoCloseDelay={2000}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  mainButton: {
    margin: 20,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonContent: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  buttonSubtext: {
    fontSize: 14,
    color: '#dbeafe',
    marginTop: 4,
  },
  instructionsCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 12,
  },
  instructionItem: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 8,
    lineHeight: 20,
  },
  lastIncomeCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  historyCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  incomeDetails: {
    gap: 12,
  },
  incomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incomeLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  incomeValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  incomeTag: {
    fontSize: 12,
    color: '#059669',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '600',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
    width: 80,
  },
  historyConcept: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
  },
  historyConfidence: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
  },
});
