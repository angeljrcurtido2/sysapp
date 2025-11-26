import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  Platform,
  Animated,
  StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface ModalSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const ModalSuccess = ({
  isOpen,
  onClose,
  message,
  title = "¡Éxito!",
  autoClose = false,
  autoCloseDelay = 2500
}: ModalSuccessProps) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(0)).current;
  const iconRotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isOpen) {
      // Animación de entrada del modal
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Animación del icono con rebote y rotación
      Animated.sequence([
        Animated.delay(100),
        Animated.parallel([
          Animated.spring(iconScaleAnim, {
            toValue: 1,
            tension: 40,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.timing(iconRotateAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Animación de pulso continuo
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Auto cerrar si está habilitado
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
        return () => clearTimeout(timer);
      }
    } else {
      // Reset animaciones cuando se cierra
      scaleAnim.setValue(0);
      iconScaleAnim.setValue(0);
      iconRotateAnim.setValue(0);
      pulseAnim.setValue(1);
    }
  }, [isOpen]);

  const handleClose = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const iconRotate = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
      presentationStyle={Platform.OS === "ios" ? "overFullScreen" : undefined}
    >
      <Pressable
        onPress={handleClose}
        className="flex-1 items-center justify-center"
        style={styles.backdrop}
      >
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
          onStartShouldSetResponder={() => true}
        >
          <View className="w-11/12 max-w-sm rounded-3xl bg-white overflow-hidden shadow-2xl">
            {/* Header con gradiente */}
            <LinearGradient
              colors={['#10b981', '#059669', '#047857']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="pt-8 pb-6 px-6"
            >
              {/* Círculo de fondo decorativo */}
              <View className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10" />
              <View className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/10" />

              {/* Icono animado */}
              <View className="items-center">
                <Animated.View
                  style={{
                    transform: [
                      { scale: iconScaleAnim },
                      { rotate: iconRotate },
                    ],
                  }}
                >
                  <View className="bg-white rounded-full p-4 shadow-lg">
                    <Animated.View
                      style={{
                        transform: [{ scale: pulseAnim }],
                      }}
                    >
                      <Ionicons name="checkmark-circle" size={64} color="#10b981" />
                    </Animated.View>
                  </View>
                </Animated.View>
              </View>
            </LinearGradient>

            {/* Contenido */}
            <View className="px-6 py-6">
              <Text className="text-2xl font-bold text-gray-800 text-center mb-3">
                {title}
              </Text>

              <Text className="text-base text-gray-600 text-center leading-6">
                {message}
              </Text>

              {/* Botón moderno */}
              <Pressable
                onPress={handleClose}
                className="mt-6 rounded-xl overflow-hidden active:opacity-90"
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                ]}
              >
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="px-6 py-4 flex-row items-center justify-center"
                >
                  <Text className="text-center text-white font-semibold text-base mr-2">
                    Entendido
                  </Text>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
});

export default ModalSuccess;
