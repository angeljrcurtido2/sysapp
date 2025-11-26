import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { crearTipoEgreso } from '../../../../services/egreso';

interface CrearTiposEgresoProps {
  onSuccess?: () => void;
  onClose: () => void;
}

const CrearTiposEgreso = ({ onSuccess, onClose }: CrearTiposEgresoProps) => {
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCrear = async () => {
    setMensaje('');
    setError('');

    if (!descripcion.trim()) {
      setError('La descripción es obligatoria.');
      return;
    }

    try {
      setLoading(true);
      const res = await crearTipoEgreso(descripcion);

      setDescripcion('');
      setMensaje(res.data.message || 'Tipo de egreso creado correctamente.');

      // Cerrar modal después de 1 segundo
      setTimeout(() => {
        onSuccess && onSuccess();
        onClose && onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear tipo de egreso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md mx-auto">
      {/* Header con gradiente */}
      <LinearGradient
        colors={['#dc2626', '#b91c1c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 py-5"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Ionicons name="add-circle" size={24} color="#fff" />
            </View>
            <Text className="text-xl font-bold text-white">Nuevo Tipo de Egreso</Text>
          </View>
          <Pressable
            onPress={onClose}
            className="h-8 w-8 items-center justify-center rounded-full bg-white/20 active:bg-white/30"
          >
            <Ionicons name="close" size={20} color="#fff" />
          </Pressable>
        </View>
      </LinearGradient>

      {/* Contenido */}
      <View className="p-6">
        {/* Input de Descripción */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons name="document-text" size={18} color="#dc2626" />
            <Text className="text-sm font-semibold text-gray-700">
              Descripción <Text className="text-red-500">*</Text>
            </Text>
          </View>
          <View className="relative">
            <TextInput
              value={descripcion}
              onChangeText={(text) => {
                setDescripcion(text);
                setError(''); // Limpiar error al escribir
              }}
              placeholder="Ej: Compra al contado, Pago de servicios..."
              placeholderTextColor="#9CA3AF"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 bg-gray-50 focus:border-red-500"
              editable={!loading}
            />
            {descripcion.length > 0 && (
              <Pressable
                onPress={() => setDescripcion('')}
                className="absolute right-3 top-3"
              >
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </Pressable>
            )}
          </View>
          {descripcion.length > 0 && (
            <Text className="text-xs text-gray-500 mt-1">
              {descripcion.length} caracteres
            </Text>
          )}
        </View>

        {/* Mensajes de feedback */}
        {mensaje && (
          <View className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex-row items-center gap-2">
            <Ionicons name="checkmark-circle" size={20} color="#059669" />
            <Text className="text-green-700 text-sm font-medium flex-1">{mensaje}</Text>
          </View>
        )}

        {error && (
          <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex-row items-center gap-2">
            <Ionicons name="alert-circle" size={20} color="#DC2626" />
            <Text className="text-red-700 text-sm font-medium flex-1">{error}</Text>
          </View>
        )}

        {/* Botones de acción */}
        <View className="flex-row gap-3">
          <Pressable
            onPress={onClose}
            className="flex-1 active:opacity-70"
            disabled={loading}
          >
            <View className="bg-gray-100 py-3 rounded-xl border border-gray-200">
              <Text className="text-gray-700 font-semibold text-center">Cancelar</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleCrear}
            className="flex-1 active:opacity-80"
            disabled={loading || !descripcion.trim()}
          >
            <LinearGradient
              colors={loading || !descripcion.trim() ? ['#9CA3AF', '#6B7280'] : ['#dc2626', '#b91c1c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-3 rounded-xl shadow-lg"
            >
              <View className="flex-row items-center justify-center gap-2">
                {loading ? (
                  <>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text className="text-white font-bold">Creando...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={18} color="#fff" />
                    <Text className="text-white font-bold">Crear</Text>
                  </>
                )}
              </View>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default CrearTiposEgreso;