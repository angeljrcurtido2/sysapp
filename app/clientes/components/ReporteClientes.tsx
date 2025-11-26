import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getReportClientesPDF } from '../../../services/cliente';
import { formatPY } from '../../../utils/utils';

interface Cliente {
    idcliente: number;
    nombre: string;
    apellido: string;
    tipo: string;
    numDocumento: string;
    telefono: string;
    direccion: string;
    genero: string;
    estado: string;
    tipo_cliente: string;
    total_compras?: number;
}

interface ReporteData {
    clientes: Cliente[];
    estadisticas: {
        totalClientes: number;
        activos: number;
        inactivos: number;
        totalCompras: number;
    };
}

interface ReporteClientesProps {
    reporte: ReporteData;
    onClose: () => void;
}

type VistaType = "tabla" | "tarjetas";
type OrdenType = "nombre" | "compras";
type DireccionOrden = "asc" | "desc";

export default function ReporteClientes({ reporte, onClose }: ReporteClientesProps) {
    const [busqueda, setBusqueda] = useState('');
    const [filterEstado, setFilterEstado] = useState('todos');
    const [filterTipo, setFilterTipo] = useState('todos');
    const [filterTipoCliente, setFilterTipoCliente] = useState('todos');
    const [vista, setVista] = useState<VistaType>('tarjetas');
    const [orden, setOrden] = useState<OrdenType>('nombre');
    const [direccionOrden, setDireccionOrden] = useState<DireccionOrden>('asc');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [loadingPDF, setLoadingPDF] = useState(false);

    // Asegurar que reporte.clientes existe y es un array
    const clientes = Array.isArray(reporte?.clientes) ? reporte.clientes : [];
    const estadisticas = reporte?.estadisticas || {
        totalClientes: 0,
        activos: 0,
        inactivos: 0,
        totalCompras: 0,
    };

    // Filtrar y ordenar clientes
    const clientesFiltrados = useMemo(() => {
        let clientesProcesados = [...clientes];

        // Búsqueda
        if (busqueda) {
            const busquedaLower = busqueda.toLowerCase();
            clientesProcesados = clientesProcesados.filter(
                cliente =>
                    cliente.nombre.toLowerCase().includes(busquedaLower) ||
                    cliente.apellido.toLowerCase().includes(busquedaLower) ||
                    cliente.numDocumento.includes(busqueda)
            );
        }

        // Filtros
        if (filterEstado !== 'todos') {
            clientesProcesados = clientesProcesados.filter(c => c.estado === filterEstado);
        }
        if (filterTipo !== 'todos') {
            clientesProcesados = clientesProcesados.filter(c => c.tipo === filterTipo);
        }
        if (filterTipoCliente !== 'todos') {
            clientesProcesados = clientesProcesados.filter(c => c.tipo_cliente === filterTipoCliente);
        }

        // Ordenamiento
        clientesProcesados.sort((a, b) => {
            let valorA: any, valorB: any;
            
            if (orden === 'nombre') {
                valorA = `${a.nombre} ${a.apellido}`.toLowerCase();
                valorB = `${b.nombre} ${b.apellido}`.toLowerCase();
            } else {
                valorA = a.total_compras || 0;
                valorB = b.total_compras || 0;
            }

            if (valorA < valorB) return direccionOrden === 'asc' ? -1 : 1;
            if (valorA > valorB) return direccionOrden === 'asc' ? 1 : -1;
            return 0;
        });

        return clientesProcesados;
    }, [clientes, busqueda, filterEstado, filterTipo, filterTipoCliente, orden, direccionOrden]);

    const estadisticasFiltradas = useMemo(() => {
        const totalClientes = clientesFiltrados.length;
        const activos = clientesFiltrados.filter(c => c.estado === 'activo').length;
        const inactivos = clientesFiltrados.filter(c => c.estado === 'inactivo').length;
        const totalCompras = clientesFiltrados.reduce((acc, c) => acc + (c.total_compras || 0), 0);
        
        return {
            totalClientes,
            activos,
            inactivos,
            totalCompras: formatPY(totalCompras)
        };
    }, [clientesFiltrados]);

    const cambiarOrden = (nuevoOrden: OrdenType) => {
        if (orden === nuevoOrden) {
            setDireccionOrden(direccionOrden === 'asc' ? 'desc' : 'asc');
        } else {
            setOrden(nuevoOrden);
            setDireccionOrden('asc');
        }
    };

    const limpiarFiltros = () => {
        setBusqueda('');
        setFilterEstado('todos');
        setFilterTipo('todos');
        setFilterTipoCliente('todos');
    };

    const handleDownloadPDF = async () => {
        try {
            setLoadingPDF(true);
            const response = await getReportClientesPDF(
                busqueda || undefined,
                filterTipoCliente !== 'todos' ? filterTipoCliente : undefined
            );

            const base64Data = response.data?.reportePDFBase64;

            if (!base64Data || typeof base64Data !== 'string') {
                Alert.alert('Error', 'No se recibió el PDF del servidor');
                return;
            }

            const fecha = new Date().toISOString().split('T')[0];
            const filename = FileSystem.documentDirectory + `Reporte-Clientes-${fecha}.pdf`;

            await FileSystem.writeAsStringAsync(filename, base64Data, {
                encoding: FileSystem.EncodingType.Base64,
            });

            if (Platform.OS === "ios") {
                await Sharing.shareAsync(filename);
            } else {
                const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
                if (permissions.granted) {
                    await FileSystem.StorageAccessFramework.createFileAsync(
                        permissions.directoryUri,
                        `Reporte-Clientes-${fecha}.pdf`,
                        'application/pdf'
                    )
                        .then(async (uri) => {
                            await FileSystem.writeAsStringAsync(uri, base64Data, {
                                encoding: FileSystem.EncodingType.Base64
                            });
                            Alert.alert('Descarga Completa', 'El reporte se ha guardado en tus descargas.');
                        })
                        .catch((e) => {
                            console.log(e);
                            Alert.alert('Error', 'No se pudo guardar el archivo.');
                        });
                } else {
                    Alert.alert('Permiso denegado', 'No se puede guardar el archivo sin permiso.');
                }
            }
        } catch (error: any) {
            console.error('Error al descargar PDF:', error);
            Alert.alert('Error', error.message || 'No se pudo generar el PDF');
        } finally {
            setLoadingPDF(false);
        }
    };

    const FilterButton = ({ active, onPress, label }: { active: boolean; onPress: () => void; label: string }) => (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={`px-4 py-2 rounded-lg ${active ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
            <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-600'}`}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const SortButton = ({ field, label }: { field: OrdenType; label: string }) => (
        <TouchableOpacity
            onPress={() => cambiarOrden(field)}
            activeOpacity={0.7}
            className={`px-3 py-2 rounded-lg flex-row items-center gap-1 ${orden === field ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
            <Text className={`text-sm font-semibold ${orden === field ? 'text-white' : 'text-gray-600'}`}>
                {label}
            </Text>
            {orden === field && (
                <Ionicons
                    name={direccionOrden === 'asc' ? 'arrow-up' : 'arrow-down'}
                    size={14}
                    color="#fff"
                />
            )}
        </TouchableOpacity>
    );

    return (
     
        <Modal animationType="slide" transparent={true} visible={true} onRequestClose={onClose}>
            <View className="flex-1 justify-center items-center bg-black/40">
                <View className="w-[95%] max-h-[90%] bg-white rounded-xl overflow-hidden">
                    {/* Header */}
                    <View className="bg-purple-600 px-6 pb-6 pt-9 rounded-t-xl">
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center gap-3">
                            <View className="h-10 w-10 items-center justify-center rounded-xl bg-purple-500">
                                <Ionicons name="people" size={22} color="#fff" />
                            </View>
                            <Text className="text-2xl font-bold text-white">Reporte de Clientes</Text>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            activeOpacity={0.7}
                            className="h-10 w-10 items-center justify-center rounded-xl bg-purple-500"
                        >
                            <Ionicons name="close" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-purple-100 text-sm mb-4">
                        {clientesFiltrados.length} de {clientes.length} clientes
                    </Text>

                    {/* Estadísticas */}
                    <View className="flex-row flex-wrap gap-3">
                        <View className="flex-1 min-w-[45%] bg-purple-500/20 rounded-xl p-3">
                            <View className="flex-row items-center gap-2 mb-1">
                                <Ionicons name="people" size={16} color="#e9d5ff" />
                                <Text className="text-sm text-purple-100">Total Clientes</Text>
                            </View>
                            <Text className="text-xl font-bold text-white">
                                {estadisticasFiltradas.totalClientes}
                            </Text>
                            <Text className="text-xs text-purple-200">
                                de {estadisticas.totalClientes} totales
                            </Text>
                        </View>

                        <View className="flex-1 min-w-[45%] bg-purple-500/20 rounded-xl p-3">
                            <View className="flex-row items-center gap-2 mb-1">
                                <Ionicons name="checkmark-circle" size={16} color="#e9d5ff" />
                                <Text className="text-sm text-purple-100">Activos</Text>
                            </View>
                            <Text className="text-xl font-bold text-white">
                                {estadisticasFiltradas.activos}
                            </Text>
                            <Text className="text-xs text-purple-200">
                                de {estadisticas.activos} totales
                            </Text>
                        </View>

                        <View className="flex-1 min-w-[45%] bg-purple-500/20 rounded-xl p-3">
                            <View className="flex-row items-center gap-2 mb-1">
                                <Ionicons name="close-circle" size={16} color="#e9d5ff" />
                                <Text className="text-sm text-purple-100">Inactivos</Text>
                            </View>
                            <Text className="text-xl font-bold text-white">
                                {estadisticasFiltradas.inactivos}
                            </Text>
                            <Text className="text-xs text-purple-200">
                                de {estadisticas.inactivos} totales
                            </Text>
                        </View>

                        <View className="flex-1 min-w-[45%] bg-purple-500/20 rounded-xl p-3">
                            <View className="flex-row items-center gap-2 mb-1">
                                <Ionicons name="cash" size={16} color="#e9d5ff" />
                                <Text className="text-sm text-purple-100">Total Compras</Text>
                            </View>
                            <Text className="text-xl font-bold text-white">
                                {estadisticasFiltradas.totalCompras}
                            </Text>
                            <Text className="text-xs text-purple-200">
                                de {formatPY(estadisticas.totalCompras)} totales
                            </Text>
                        </View>
                    </View>
                    </View>

                    <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
                    {/* Búsqueda */}
                    <View className="my-4">
                        <View className="relative">
                            <View className="absolute left-4 top-3.5 z-10">
                                <Ionicons name="search" size={20} color="#64748b" />
                            </View>
                            <TextInput
                                placeholder="Buscar por nombre, apellido o documento..."
                                placeholderTextColor="#94a3b8"
                                value={busqueda}
                                onChangeText={setBusqueda}
                                className="bg-white border border-gray-200 rounded-xl px-12 py-3.5 text-gray-800"
                            />
                        </View>
                    </View>

                    {/* Filtros */}
                    <View className="mb-4 gap-4">
                        <View className="flex-row items-center justify-between">
                            <TouchableOpacity
                                onPress={() => setMostrarFiltros(!mostrarFiltros)}
                                activeOpacity={0.7}
                                className={`flex-row items-center gap-2 px-4 py-2 rounded-lg ${mostrarFiltros ? 'bg-purple-600' : 'bg-gray-200'}`}
                            >
                                <Ionicons name="filter" size={16} color={mostrarFiltros ? "#fff" : "#64748b"} />
                                <Text className={`text-sm font-semibold ${mostrarFiltros ? 'text-white' : 'text-gray-600'}`}>
                                    Filtros
                                </Text>
                            </TouchableOpacity>

                            <View className="flex-row gap-2">
                                <TouchableOpacity
                                    onPress={() => setVista('tarjetas')}
                                    activeOpacity={0.7}
                                    className={`p-2 rounded-lg ${vista === 'tarjetas' ? 'bg-purple-600' : 'bg-gray-200'}`}
                                >
                                    <Ionicons name="grid" size={16} color={vista === 'tarjetas' ? "#fff" : "#64748b"} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setVista('tabla')}
                                    activeOpacity={0.7}
                                    className={`p-2 rounded-lg ${vista === 'tabla' ? 'bg-purple-600' : 'bg-gray-200'}`}
                                >
                                    <Ionicons name="list" size={16} color={vista === 'tabla' ? "#fff" : "#64748b"} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {mostrarFiltros && (
                            <View className="bg-gray-50 rounded-xl p-4 gap-4">
                                <View>
                                    <Text className="text-sm font-semibold text-gray-700 mb-2">Estado</Text>
                                    <View className="flex-row gap-3">
                                        <FilterButton active={filterEstado === 'todos'} onPress={() => setFilterEstado('todos')} label="Todos" />
                                        <FilterButton active={filterEstado === 'activo'} onPress={() => setFilterEstado('activo')} label="Activos" />
                                        <FilterButton active={filterEstado === 'inactivo'} onPress={() => setFilterEstado('inactivo')} label="Inactivos" />
                                    </View>
                                </View>

                                <View>
                                    <Text className="text-sm font-semibold text-gray-700 mb-2">Tipo de Persona</Text>
                                    <View className="flex-row gap-3">
                                        <FilterButton active={filterTipo === 'todos'} onPress={() => setFilterTipo('todos')} label="Todos" />
                                        <FilterButton active={filterTipo === 'FISICA'} onPress={() => setFilterTipo('FISICA')} label="Física" />
                                        <FilterButton active={filterTipo === 'JURIDICA'} onPress={() => setFilterTipo('JURIDICA')} label="Jurídica" />
                                    </View>
                                </View>

                                <View>
                                    <Text className="text-sm font-semibold text-gray-700 mb-2">Tipo de Cliente</Text>
                                    <View className="flex-row gap-3">
                                        <FilterButton active={filterTipoCliente === 'todos'} onPress={() => setFilterTipoCliente('todos')} label="Todos" />
                                        <FilterButton active={filterTipoCliente === 'MAYORISTA'} onPress={() => setFilterTipoCliente('MAYORISTA')} label="Mayorista" />
                                        <FilterButton active={filterTipoCliente === 'MINORISTA'} onPress={() => setFilterTipoCliente('MINORISTA')} label="Minorista" />
                                    </View>
                                </View>

                                <TouchableOpacity
                                    onPress={limpiarFiltros}
                                    activeOpacity={0.7}
                                    className="self-start px-4 py-2 bg-gray-300 rounded-lg"
                                >
                                    <Text className="text-sm font-semibold text-gray-600">Limpiar filtros</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Ordenamiento */}
                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-700 mb-2">Ordenar por</Text>
                        <View className="flex-row gap-2">
                            <SortButton field="nombre" label="Nombre" />
                            <SortButton field="compras" label="Compras" />
                        </View>
                    </View>

                    {/* Lista de clientes */}
                    {clientesFiltrados.length === 0 ? (
                        <View className="py-8 items-center">
                            <Ionicons name="search-outline" size={48} color="#94a3b8" />
                            <Text className="text-gray-500 mt-2">No se encontraron clientes</Text>
                        </View>
                    ) : vista === 'tarjetas' ? (
                        <View className="gap-3 mb-4 ">
                            {clientesFiltrados.map((cliente) => (
                                <View key={cliente.idcliente} className="bg-white border border-gray-200 rounded-xl p-4">
                                    <View className="flex-row justify-between items-start mb-3">
                                        <View className="flex-1">
                                            <Text className="text-lg font-bold text-gray-800">
                                                {cliente.nombre} {cliente.apellido}
                                            </Text>
                                            <Text className="text-sm text-gray-500">{cliente.numDocumento}</Text>
                                        </View>
                                        <View className={`px-3 py-1 rounded-full ${
                                            cliente.estado === 'activo' ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                            <Text className={`text-xs font-semibold ${
                                                cliente.estado === 'activo' ? 'text-green-700' : 'text-red-700'
                                            }`}>
                                                {cliente.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="gap-2">
                                        <View className="flex-row items-center gap-2">
                                            <Ionicons name="call-outline" size={16} color="#64748b" />
                                            <Text className="text-sm text-gray-600">{cliente.telefono || '--'}</Text>
                                        </View>
                                        <View className="flex-row items-center gap-2">
                                            <Ionicons name="location-outline" size={16} color="#64748b" />
                                            <Text className="text-sm text-gray-600">{cliente.direccion || '--'}</Text>
                                        </View>
                                        <View className="flex-row items-center gap-2">
                                            <Ionicons name="pricetag-outline" size={16} color="#64748b" />
                                            <Text className="text-sm text-gray-600">{cliente.tipo_cliente}</Text>
                                        </View>
                                        <View className="flex-row items-center gap-2">
                                            <Ionicons name="cash-outline" size={16} color="#64748b" />
                                            <Text className="text-sm font-semibold text-gray-700">
                                                Total compras: {formatPY(cliente.total_compras || 0)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View className="mb-4 bg-white rounded-xl overflow-hidden">
                            {clientesFiltrados.map((cliente, idx) => (
                                <View
                                    key={cliente.idcliente}
                                    className={`border-b border-gray-200 p-4 ${idx === 0 ? 'border-t' : ''} ${idx === clientesFiltrados.length - 1 ? 'border-b-0' : ''}`}
                                >
                                    <View className="flex-row justify-between items-start">
                                        <View className="flex-1">
                                            <Text className="font-semibold text-gray-800">{cliente.nombre} {cliente.apellido}</Text>
                                            <Text className="text-sm text-gray-500">{cliente.numDocumento}</Text>
                                        </View>
                                        <View className={`px-2 py-1 rounded ${
                                            cliente.estado === 'activo' ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                            <Text className={`text-xs font-semibold ${
                                                cliente.estado === 'activo' ? 'text-green-700' : 'text-red-700'
                                            }`}>
                                                {cliente.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="flex-row justify-between mt-2">
                                        <Text className="text-sm text-gray-600">{cliente.tipo_cliente}</Text>
                                        <Text className="text-sm font-semibold text-purple-600">{formatPY(cliente.total_compras || 0)}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Botón de descarga PDF */}
                    <View className="pt-4 pb-8">
                        <TouchableOpacity
                            onPress={handleDownloadPDF}
                            disabled={loadingPDF}
                            activeOpacity={0.7}
                            className="bg-purple-600 py-3.5 flex-row items-center justify-center gap-2 rounded-xl"
                        >
                            {loadingPDF ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Ionicons name="download" size={20} color="#fff" />
                            )}
                            <Text className="text-white font-bold">
                                {loadingPDF ? 'Generando PDF...' : 'Descargar PDF'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>

    );
}