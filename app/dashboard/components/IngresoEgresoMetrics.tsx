import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getTotalIngresos } from "../../../services/ingreso";
import { getTotalEgresos } from "../../../services/egreso";

interface TotalesData {
  ingresos: {
    total_registros: number;
    total_monto: number;
  };
  egresos: {
    total_registros: number;
    total_monto: number;
  };
}

const fmtMoney = (v: number | string) =>
  new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    minimumFractionDigits: 0,
  }).format(+v);

// Card mejorado para móvil con gradiente y icono
function MetricCard({
  title,
  value,
  subtitle,
  icon,
  colors,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: string[];
}) {
  return (
    <View className="flex-1 min-w-[45%]">
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-2xl p-4 shadow-lg"
      >
        <View className="flex-row items-center justify-between mb-2">
          <Ionicons name={icon} size={24} color="rgba(255,255,255,0.9)" />
        </View>
        <Text className="text-white/80 text-xs mb-1">{title}</Text>
        <Text className="text-white text-lg font-bold">{value}</Text>
        <Text className="text-white/70 text-xs mt-1">{subtitle}</Text>
      </LinearGradient>
    </View>
  );
}

export default function IngresoEgresoMetrics() {
  const [totales, setTotales] = useState<TotalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Llamadas en paralelo
      const [ingresosRes, egresosRes] = await Promise.all([
        getTotalIngresos(),
        getTotalEgresos(),
      ]);

      setTotales({
        ingresos: ingresosRes.data,
        egresos: egresosRes.data,
      });
    } catch (e) {
      console.error("Error al cargar totales:", e);
      setErr("No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View className="bg-white rounded-2xl p-6 shadow-sm">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (err) {
    return (
      <View className="bg-red-50 rounded-2xl p-4 border border-red-200">
        <Text className="text-red-600 text-sm">{err}</Text>
      </View>
    );
  }

  if (!totales) return null;

  return (
    <View className="gap-4">
      {/* Cards de métricas */}
      <View className="flex-row flex-wrap gap-3">
        <MetricCard
          title="Total Ingresos"
          value={fmtMoney(totales.ingresos.total_monto)}
          subtitle={`${totales.ingresos.total_registros} registros`}
          icon="trending-up"
          colors={["#10B981", "#14B8A6"]}
        />
        <MetricCard
          title="Total Egresos"
          value={fmtMoney(totales.egresos.total_monto)}
          subtitle={`${totales.egresos.total_registros} registros`}
          icon="trending-down"
          colors={["#F59E0B", "#F97316"]}
        />
      </View>
    </View>
  );
}
