import { useState } from "react";
import api from "../lib/axiosConfig";

export interface ParsedIncome {
  monto: number;
  concepto: string;
  tipo_movimiento: string;
  fecha?: string;
  observaciones?: string;
  confidence: number;
  idingreso?: number;
  idtipo_ingreso?: number;
  idmovimiento?: number;
  hora?: string;
  message?: string;
}

export interface UseTextToIncomeResult {
  parseTextToIncome: (text: string) => Promise<ParsedIncome | null>;
  parseAndRegisterIncome: (text: string) => Promise<ParsedIncome | null>;
  isProcessing: boolean;
  error: string | null;
  lastParsedData: ParsedIncome | null;
}

export const useTextToIncome = (): UseTextToIncomeResult => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastParsedData, setLastParsedData] = useState<ParsedIncome | null>(null);

  /**
   * Parsea el texto pero NO registra en la BD
   * (Útil para mostrar preview antes de confirmar)
   */
  const parseTextToIncome = async (text: string): Promise<ParsedIncome | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      // Llamada al backend que usa Ollama para procesar texto
      const response = await api.post("/voice/parse-income", { text });

      const data: ParsedIncome = response.data;
      setLastParsedData(data);
      setIsProcessing(false);

      return data;
    } catch (err: any) {
      console.error("Error parsing text to income:", err);
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
  const parseAndRegisterIncome = async (text: string): Promise<ParsedIncome | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log("📝 Procesando y registrando:", text);

      // Llamada al nuevo endpoint que parsea Y registra
      const response = await api.post("/voice/register-income", { text });

      const data: ParsedIncome = response.data;
      setLastParsedData(data);
      setIsProcessing(false);

      console.log("✅ Ingreso registrado exitosamente:", data);

      return data;
    } catch (err: any) {
      console.error("Error al registrar ingreso:", err);
      const errorMessage = err.response?.data?.error || err.message || "Error desconocido";
      setError(errorMessage);
      setIsProcessing(false);
      return null;
    }
  };

  return {
    parseTextToIncome,
    parseAndRegisterIncome,
    isProcessing,
    error,
    lastParsedData,
  };
};
