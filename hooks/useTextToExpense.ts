import { useState } from "react";
import api from "../lib/axiosConfig";

export interface ParsedExpense {
  monto: number;
  concepto: string;
  tipo_movimiento: string;
  fecha?: string;
  observaciones?: string;
  confidence: number;
  idegreso?: number;
  idtipo_egreso?: number;
  idmovimiento?: number;
  hora?: string;
  message?: string;
}

export interface UseTextToExpenseResult {
  parseTextToExpense: (text: string) => Promise<ParsedExpense | null>;
  parseAndRegisterExpense: (text: string) => Promise<ParsedExpense | null>;
  isProcessing: boolean;
  error: string | null;
  lastParsedData: ParsedExpense | null;
}

export const useTextToExpense = (): UseTextToExpenseResult => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastParsedData, setLastParsedData] = useState<ParsedExpense | null>(null);

  /**
   * Parsea el texto pero NO registra en la BD
   * (Útil para mostrar preview antes de confirmar)
   */
  const parseTextToExpense = async (text: string): Promise<ParsedExpense | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      // Llamada al backend que usa Ollama para procesar texto
      const response = await api.post("/voice/parse-expense", { text });

      const data: ParsedExpense = response.data;
      setLastParsedData(data);
      setIsProcessing(false);

      return data;
    } catch (err: any) {
      console.error("Error parsing text to expense:", err);
      const errorMessage = err.response?.data?.error || err.message || "Error desconocido";
      setError(errorMessage);
      setIsProcessing(false);
      return null;
    }
  };

  /**
   * Parsea Y REGISTRA directamente en la BD
   * (Automático, no requiere confirmación adicional)
   */
  const parseAndRegisterExpense = async (text: string): Promise<ParsedExpense | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log("📝 Procesando y registrando egreso:", text);

      // Llamada al nuevo endpoint que parsea Y registra
      const response = await api.post("/voice/register-expense", { text });

      const data: ParsedExpense = response.data;
      setLastParsedData(data);
      setIsProcessing(false);

      console.log("✅ Egreso registrado exitosamente:", data);

      return data;
    } catch (err: any) {
      console.error("Error al registrar egreso:", err);
      const errorMessage = err.response?.data?.error || err.message || "Error desconocido";
      setError(errorMessage);
      setIsProcessing(false);
      return null;
    }
  };

  return {
    parseTextToExpense,
    parseAndRegisterExpense,
    isProcessing,
    error,
    lastParsedData,
  };
};
