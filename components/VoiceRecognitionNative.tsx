import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Platform,
  ActivityIndicator,
  PermissionsAndroid,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from "@react-native-voice/voice";

interface VoiceRecognitionNativeProps {
  onResult: (text: string) => void;
  onError?: (error: string) => void;
  placeholder?: string;
  enableProcessing?: boolean;
}

/**
 * Componente de reconocimiento de voz usando @react-native-voice/voice
 * Funciona SOLO en builds nativos (APK/IPA), NO en Expo Go
 */
const VoiceRecognitionNative = ({
  onResult,
  onError,
  placeholder = "Toca el micrófono y di tu comando...",
  enableProcessing = false,
}: VoiceRecognitionNativeProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [partialResults, setPartialResults] = useState<string[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Animaciones
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const waveAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Configurar eventos de Voice
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechError = onSpeechError;

    // Verificar permisos al montar
    checkPermissions();

    return () => {
      // Limpiar eventos al desmontar
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    if (isListening) {
      startPulseAnimation();
      startWaveAnimation();
    } else {
      stopAnimations();
    }
  }, [isListening]);

  const checkPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );
        setHasPermission(granted);
        console.log('Permiso de micrófono:', granted ? 'CONCEDIDO' : 'DENEGADO');
      } catch (err) {
        console.error('Error verificando permisos:', err);
        setHasPermission(false);
      }
    } else {
      // En iOS asumimos que se pedirá automáticamente
      setHasPermission(true);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Permiso de Micrófono",
            message: "KontrolX necesita acceso al micrófono para reconocimiento de voz",
            buttonNeutral: "Preguntar después",
            buttonNegative: "Cancelar",
            buttonPositive: "Permitir",
          }
        );

        const hasPermissionNow = granted === PermissionsAndroid.RESULTS.GRANTED;
        setHasPermission(hasPermissionNow);

        if (!hasPermissionNow) {
          Alert.alert(
            'Permiso Denegado',
            'Para usar el reconocimiento de voz, necesitas habilitar el permiso de micrófono en Configuración > Apps > KontrolX > Permisos',
            [{ text: 'OK' }]
          );
        }

        return hasPermissionNow;
      } catch (err) {
        console.error('Error solicitando permiso:', err);
        return false;
      }
    }
    return true;
  };

  const onSpeechStart = (e: any) => {
    console.log("🎤 Reconocimiento de voz iniciado", e);
    setIsListening(true);
  };

  const onSpeechEnd = (e: any) => {
    console.log("🛑 Reconocimiento de voz finalizado", e);
    setIsListening(false);
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    console.log("✅ Resultados finales:", e.value);
    if (e.value && e.value.length > 0) {
      const text = e.value[0];
      setRecognizedText(text);
      onResult(text);
    }
  };

  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    console.log("📝 Resultados parciales:", e.value);
    if (e.value) {
      setPartialResults(e.value);
    }
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    console.error("❌ Error de voz:", e.error);
    setIsListening(false);

    let errorMessage = "Error en el reconocimiento de voz";

    if (e.error?.message) {
      errorMessage = e.error.message;
    } else if (e.error?.code) {
      switch (e.error.code) {
        case "7":
          errorMessage = "No se detectó voz. Intenta de nuevo.";
          break;
        case "8":
          errorMessage = "Tiempo de espera agotado. Intenta de nuevo.";
          break;
        case "9":
          errorMessage = "Permiso de micrófono denegado.";
          checkPermissions(); // Verificar permisos nuevamente
          break;
        default:
          errorMessage = `Error: ${e.error.code}`;
      }
    }

    onError?.(errorMessage);
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

  const startListening = async () => {
    try {
      // Verificar y solicitar permisos
      if (hasPermission === false) {
        const granted = await requestPermission();
        if (!granted) {
          onError?.("Permiso de micrófono denegado");
          return;
        }
      }

      setRecognizedText("");
      setPartialResults([]);
      setIsListening(true);

      Animated.spring(scaleAnim, {
        toValue: 1.1,
        tension: 40,
        friction: 3,
        useNativeDriver: true,
      }).start();

      // Iniciar reconocimiento de voz
      console.log("🎤 Iniciando Voice.start...");
      await Voice.start("es-ES"); // Español
      console.log("✅ Micrófono activado");

    } catch (error: any) {
      console.error("❌ Error al iniciar reconocimiento de voz:", error);
      setIsListening(false);

      let errorMsg = "No se pudo iniciar el reconocimiento de voz";

      if (error.message) {
        errorMsg += `: ${error.message}`;
      }

      onError?.(errorMsg);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);

      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 3,
        useNativeDriver: true,
      }).start();

      console.log("🛑 Micrófono desactivado");
    } catch (error: any) {
      console.error("Error al detener reconocimiento:", error);
      setIsListening(false);
    }
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

  // Mostrar resultados parciales mientras habla
  const displayText = partialResults.length > 0
    ? partialResults[0]
    : recognizedText;

  return (
    <View className="items-center justify-center py-6">
      {/* Estado de permisos */}
      {hasPermission === false && (
        <View className="mb-4 px-4 py-3 bg-red-50 rounded-xl border border-red-200 mx-4">
          <View className="flex-row items-center">
            <Ionicons name="warning" size={20} color="#dc2626" />
            <Text className="text-red-800 text-sm ml-2 flex-1">
              Permiso de micrófono denegado. Toca el botón para solicitarlo nuevamente.
            </Text>
          </View>
        </View>
      )}

      {/* Texto de reconocimiento */}
      {displayText ? (
        <View className="mb-6 px-4 py-3 bg-green-50 rounded-xl border border-green-200 mx-4">
          <Text className="text-green-800 text-center font-medium">
            {partialResults.length > 0 ? "📝 " : "✅ "}
            {displayText}
          </Text>
          {partialResults.length > 0 && (
            <Text className="text-green-600 text-xs text-center mt-1">
              Escuchando...
            </Text>
          )}
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
            ? "🎤 Escuchando..."
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

export default VoiceRecognitionNative;
