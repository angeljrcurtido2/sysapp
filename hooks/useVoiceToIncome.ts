import { useState } from "react";
import api from "../lib/axiosConfig";

export interface ParsedIncome {
  monto: number;
  concepto: string;
  tipo_movimiento: string;
  fecha?: string;
  observaciones?: string;
  confidence: number;
}

export interface UseVoiceToIncomeResult {
  parseVoiceToIncome: (text: string) => Promise<ParsedIncome | null>;
  isProcessing: boolean;
  error: string | null;
  lastParsedData: ParsedIncome | null;
}

export const useVoiceToIncome = (): UseVoiceToIncomeResult => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastParsedData, setLastParsedData] = useState<ParsedIncome | null>(null);

  const parseVoiceToIncome = async (text: string): Promise<ParsedIncome | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      // Llamada al backend que usa Ollama
      // Usa la instancia de axios configurada con autenticación
      const response = await api.post("/voice/parse-income", { text });

      const data: ParsedIncome = response.data;
      setLastParsedData(data);
      setIsProcessing(false);

      return data;
    } catch (err: any) {
      console.error("Error parsing voice to income:", err);
      const errorMessage = err.response?.data?.error || err.message || "Error desconocido";
      setError(errorMessage);
      setIsProcessing(false);
      return null;
    }
  };

  return {
    parseVoiceToIncome,
    isProcessing,
    error,
    lastParsedData,
  };
};
