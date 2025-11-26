import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from 'expo-speech';

interface VoiceRecognitionExpoProps {
  onResult: (text: string) => void;
  onError?: (error: string) => void;
  placeholder?: string;
  enableProcessing?: boolean;
}

/**
 * NOTA: Este componente usa entrada de texto simulada para demostración
 * El reconocimiento de voz real requiere expo-speech o build nativo
 *
 * Para reconocimiento de voz real en Expo, necesitas:
 * 1. expo install expo-speech (para síntesis)
 * 2. O hacer build nativo con expo-dev-client
 */
const VoiceRecognitionExpo = ({
  onResult,
  onError,
  placeholder = "Toca el micrófono y di tu comando...",
  enableProcessing = false,
}: VoiceRecognitionExpoProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");

  // Animaciones
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const waveAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isListening) {
      startPulseAnimation();
      startWaveAnimation();

      // Simular escucha por 3 segundos y luego pedir input
      const timer = setTimeout(() => {
        setIsListening(false);
        stopAnimations();
        showInputDialog();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      stopAnimations();
    }
  }, [isListening]);

  const showInputDialog = () => {
    // En Expo Go, mostramos un Alert para simular el reconocimiento de voz
    // En producción con build nativo, esto usaría el micrófono real
    Alert.prompt(
      "Comando de Voz",
      "Escribe tu comando (en producción esto sería reconocimiento de voz):",
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => setRecognizedText("")
        },
        {
          text: "OK",
          onPress: (text) => {
            if (text) {
              setRecognizedText(text);
              onResult(text);

              // Feedback de voz (opcional)
              Speech.speak("Comando recibido", {
                language: "es-ES",
                pitch: 1,
                rate: 1
              });
            }
          }
        }
      ],
      "plain-text",
      "",
      "default"
    );
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startWaveAnimation = () => {
    const createWaveAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    };

    Animated.parallel([
      createWaveAnimation(waveAnim1, 0),
      createWaveAnimation(waveAnim2, 500),
      createWaveAnimation(waveAnim3, 1000),
    ]).start();
  };

  const stopAnimations = () => {
    pulseAnim.stopAnimation();
    waveAnim1.stopAnimation();
    waveAnim2.stopAnimation();
    waveAnim3.stopAnimation();

    pulseAnim.setValue(1);
    waveAnim1.setValue(0);
    waveAnim2.setValue(0);
    waveAnim3.setValue(0);
  };

  const startListening = () => {
    try {
      setRecognizedText("");
      setIsListening(true);

      Animated.spring(scaleAnim, {
        toValue: 1.1,
        tension: 40,
        friction: 3,
        useNativeDriver: true,
      }).start();

      // Feedback de audio
      Speech.speak("Escuchando", {
        language: "es-ES",
        pitch: 1.2,
        rate: 1.2
      });

    } catch (error: any) {
      console.error("Error starting voice recognition:", error);
      setIsListening(false);
      onError?.("No se pudo iniciar el reconocimiento de voz");
    }
  };

  const stopListening = () => {
    setIsListening(false);

    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 40,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getWaveOpacity = (animValue: Animated.Value) => {
    return animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.7, 0],
    });
  };

  const getWaveScale = (animValue: Animated.Value) => {
    return animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 2.5],
    });
  };

  return (
    <View className="items-center justify-center py-6">
      {/* Banner informativo */}
      <View className="mb-4 px-4 py-3 bg-blue-50 rounded-xl border border-blue-200 mx-4">
        <Text className="text-blue-800 text-center text-sm">
          💡 En Expo Go: Se simula el reconocimiento de voz{"\n"}
          Para usar el micrófono real, necesitas hacer un build nativo
        </Text>
      </View>

      {/* Texto de reconocimiento */}
      {recognizedText ? (
        <View className="mb-6 px-4 py-3 bg-green-50 rounded-xl border border-green-200 mx-4">
          <Text className="text-green-800 text-center font-medium">
            ✅ {recognizedText}
          </Text>
        </View>
      ) : (
        <Text className="mb-6 text-gray-500 text-center px-4">
          {placeholder}
        </Text>
      )}

      {/* Botón de micrófono con ondas */}
      <View className="items-center justify-center">
        {/* Ondas expansivas */}
        {isListening && (
          <>
            <Animated.View
              style={[
                styles.wave,
                {
                  opacity: getWaveOpacity(waveAnim1),
                  transform: [{ scale: getWaveScale(waveAnim1) }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.wave,
                {
                  opacity: getWaveOpacity(waveAnim2),
                  transform: [{ scale: getWaveScale(waveAnim2) }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.wave,
                {
                  opacity: getWaveOpacity(waveAnim3),
                  transform: [{ scale: getWaveScale(waveAnim3) }],
                },
              ]}
            />
          </>
        )}

        {/* Botón principal */}
        <Pressable
          onPress={toggleListening}
          disabled={enableProcessing}
          className="active:opacity-90"
        >
          <Animated.View
            style={{
              transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }],
            }}
          >
            <LinearGradient
              colors={
                isListening
                  ? ["#ef4444", "#dc2626", "#b91c1c"]
                  : ["#3b82f6", "#2563eb", "#1d4ed8"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.micButton}
            >
              {enableProcessing ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <Ionicons
                  name={isListening ? "stop" : "mic"}
                  size={48}
                  color="#fff"
                />
              )}
            </LinearGradient>
          </Animated.View>
        </Pressable>

        {/* Estado */}
        <Text
          className={`mt-4 font-semibold ${
            enableProcessing
              ? "text-orange-600"
              : isListening
              ? "text-red-600"
              : "text-blue-600"
          }`}
        >
          {enableProcessing
            ? "Procesando con IA..."
            : isListening
            ? "Escuchando..."
            : "Presiona para hablar"}
        </Text>
      </View>

      {/* Ejemplos rápidos */}
      <View className="mt-6 px-4 w-full">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Ejemplos rápidos:
        </Text>
        {[
          "Registrar 150 dólares por venta",
          "Ingreso de 50 pesos por servicio",
          "Anotar 75 dólares de reparación"
        ].map((example, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setRecognizedText(example);
              onResult(example);
            }}
            className="mb-2 px-4 py-3 bg-gray-100 rounded-lg active:bg-gray-200"
          >
            <Text className="text-gray-700 text-sm">💬 {example}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  wave: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#3b82f6",
    borderWidth: 2,
    borderColor: "#3b82f6",
  },
});

export default VoiceRecognitionExpo;
