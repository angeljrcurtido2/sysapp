import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput
} from 'react-native';
import { BanknoteIcon } from 'lucide-react-native';

import type { ForwardedRef } from 'react';
import type { ArqueoCaja } from '../CierreCaja/CajaResumen';

interface CrearArqueoProps {
    idmovimiento: number;
    arqueoCerrado?: ArqueoCaja;  
    estadoMovimiento?: boolean;   
}

const denominaciones = [
    50, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000,
];

const CrearArqueoCaja = forwardRef(
    (
        { idmovimiento, arqueoCerrado, estadoMovimiento = false }: CrearArqueoProps,
        ref: ForwardedRef<any>
    ) => {

        const [cantidades, setCantidades] = useState<{ [k: string]: number }>({});
        const [detalles, setDetalles] = useState<
            { detalle: string; monto: number }[]
        >(Array(5).fill({ detalle: '', monto: 0 }));
        const [total, setTotal] = useState(0);

        useEffect(() => {
            if (estadoMovimiento && arqueoCerrado) {
                const newCantidades: Record<string, number> = {};
                denominaciones.forEach((den) => {
                    const raw = arqueoCerrado?.[`a${den}` as keyof ArqueoCaja] ?? 0;
                    newCantidades[`a${den}`] = Number(raw);   
                });

                setCantidades(newCantidades);

                const newDetalles = Array(5).fill({ detalle: '', monto: 0 });
                for (let i = 0; i < 5; i++) {
                    newDetalles[i] = {
                        detalle: arqueoCerrado[`detalle${i + 1}` as keyof ArqueoCaja] as string,
                        monto: Number(arqueoCerrado[`monto${i + 1}` as keyof ArqueoCaja] ?? 0),
                    };
                }
                setDetalles(newDetalles);

                setTotal(Number(arqueoCerrado.total));
            }
        }, [estadoMovimiento, arqueoCerrado]);

        useEffect(() => {
            if (estadoMovimiento) return; 
            let suma = 0;
            denominaciones.forEach((den) => (suma += den * (cantidades[`a${den}`] || 0)));
            detalles.forEach((d) => (suma += d.monto || 0));
            setTotal(suma);
        }, [cantidades, detalles, estadoMovimiento]);

        useImperativeHandle(ref, () => ({
            getArqueoData: () => ({
                total,
                payload: {
                    idmovimiento,
                    total,
                    ...Object.fromEntries(
                        denominaciones.map((den) => [`a${den}`, cantidades[`a${den}`] || 0])
                    ),
                    ...Object.fromEntries(
                        detalles.flatMap((d, i) => [
                            [`detalle${i + 1}`, d.detalle],
                            [`monto${i + 1}`, d.monto || 0],
                        ])
                    ),
                },
            }),
        }));

        const disabled = estadoMovimiento;

        const DenominationInput = ({ denomination }: { denomination: number }) => (
            <View className="mb-2">
                <Text className="text-xs font-medium text-gray-600 mb-1">
                    {denomination.toLocaleString()} Gs
                </Text>
                <TextInput
                    value={cantidades[`a${denomination}`]?.toString() || ''}
                    onChangeText={(text) => {
                        const value = parseInt(text) || 0;
                        setCantidades((prev) => ({
                            ...prev,
                            [`a${denomination}`]: value,
                        }));
                    }}
                    keyboardType="numeric"
                    editable={!disabled}
                    placeholder="0"
                    className={`w-full px-2 py-2 border rounded-lg text-xs ${disabled ? 'bg-gray-100' : 'bg-white'}`}
                />
            </View>
        );

        const DetailInput = ({ index }: { index: number }) => (
            <View className="mb-3">
                <View className="flex-row gap-2">
                    <View className="flex-1">
                        <Text className="text-xs font-medium text-gray-600 mb-1">
                            Detalle {index + 1}
                        </Text>
                        <TextInput
                            value={detalles[index].detalle}
                            onChangeText={(text) =>
                                setDetalles((prev) =>
                                    prev.map((d, i) =>
                                        i === index ? { ...d, detalle: text } : d
                                    )
                                )
                            }
                            editable={!disabled}
                            placeholder="Descripción"
                            className={`w-full px-2 py-2 border rounded-lg text-xs ${disabled ? 'bg-gray-100' : 'bg-white'}`}
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-xs font-medium text-gray-600 mb-1">
                            Monto
                        </Text>
                        <TextInput
                            value={detalles[index].monto?.toString() || ''}
                            onChangeText={(text) => {
                                const value = parseInt(text) || 0;
                                setDetalles((prev) =>
                                    prev.map((d, i) =>
                                        i === index ? { ...d, monto: value } : d
                                    )
                                );
                            }}
                            keyboardType="numeric"
                            editable={!disabled}
                            placeholder="0"
                            className={`w-full px-2 py-2 border rounded-lg text-xs ${disabled ? 'bg-gray-100' : 'bg-white'}`}
                        />
                    </View>
                </View>
            </View>
        );

        return (
            <View className="p-4">
                {/* Header */}
                <View className="flex-row items-center gap-2 mb-4">
                    <BanknoteIcon size={20} color="#4F46E5" />
                    <Text className="text-lg font-bold text-gray-800 flex-1" numberOfLines={2}>
                        {disabled ? 'Arqueo de Caja (cerrado)' : 'Registrar Arqueo de Caja'}
                    </Text>
                </View>

                {/* Cantidad de Billetes */}
                <View className="mb-4">
                    <View className="flex-row items-center gap-2 mb-3 bg-green-50 px-3 py-2 rounded-lg">
                        <BanknoteIcon size={16} color="#059669" />
                        <Text className="text-sm font-semibold text-gray-700">
                            Cantidad de Billetes
                        </Text>
                    </View>
                    <View className="flex-row flex-wrap -mx-1">
                        {denominaciones.map((den) => (
                            <View key={den} className="w-1/2 px-1">
                                <DenominationInput denomination={den} />
                            </View>
                        ))}
                    </View>
                </View>

                {/* Otros Detalles */}
                <View className="mb-4">
                    <View className="flex-row items-center gap-2 mb-3 bg-red-50 px-3 py-2 rounded-lg">
                        <BanknoteIcon size={16} color="#DC2626" />
                        <Text className="text-sm font-semibold text-gray-700">
                            Otros Detalles
                        </Text>
                    </View>
                    <View>
                        {detalles.map((_, index) => (
                            <DetailInput key={index} index={index} />
                        ))}
                    </View>
                </View>

                {/* Total Calculado */}
                <View className="bg-indigo-50 rounded-xl p-3 border border-indigo-200">
                    <Text className="text-indigo-800 text-base font-bold text-center">
                        Total Calculado: {total.toLocaleString()} Gs
                    </Text>
                </View>
            </View>
        );
    }
);

export default CrearArqueoCaja;