import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, TouchableOpacity, RefreshControl
} from 'react-native';

const BACKEND_URL = 'https://columellate-supplementally-rachel.ngrok-free.dev';

// ── Componente principal del historial ────────────────────────────
export default function HistorialScreen({ route }) {
  
  // Obtener el username que viene desde MainScreen
  const username = route?.params?.username || null;
  
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState(null);

  // Cargar el historial cuando la pantalla abre
  useEffect(() => {
    cargarHistorial();
  }, []);

  // ── Función para traer el historial del backend ────────────────
  const cargarHistorial = async () => {
    if (!username) {
      setError('No hay usuario logueado');
      setCargando(false);
      return;
    }
    try {
      const respuesta = await fetch(
        `${BACKEND_URL}/historial/${encodeURIComponent(username)}`,
        {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        }
      );
      const datos = await respuesta.json();
      setHistorial(datos.historial || []);
      setError(null);
    } catch (e) {
      setError('Error al cargar el historial');
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  };

  // ── Función para refrescar jalando hacia abajo ─────────────────
  const onRefresh = () => {
    setRefrescando(true);
    cargarHistorial();
  };

  // ── Formatear la fecha a formato legible ──────────────────────
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ── Cada tarjeta del historial ─────────────────────────────────
  const renderItem = ({ item }) => (
    <View style={styles.tarjeta}>
      {/* Nombre del alimento y calorías */}
      <View style={styles.tarjetaHeader}>
        <Text style={styles.nombreAlimento}>
          🍽 {item.nombre}
        </Text>
        <View style={styles.badgeCalorias}>
          <Text style={styles.badgeTexto}>
            {item.calorias} kcal
          </Text>
        </View>
      </View>

      {/* Macros en fila */}
      <View style={styles.macrosRow}>
        <Text style={styles.macro}>💪 {item.proteinas}g prot</Text>
        <Text style={styles.macro}>🍞 {item.carbohidratos}g carbs</Text>
        <Text style={styles.macro}>🥑 {item.grasas}g grasas</Text>
      </View>

      {/* Fecha del escaneo */}
      <Text style={styles.fecha}>
        🕐 {formatearFecha(item.fecha)}
      </Text>
    </View>
  );

  // ── Pantalla de carga ──────────────────────────────────────────
  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.textoCargando}>Cargando historial...</Text>
      </View>
    );
  }

  // ── Pantalla de error ──────────────────────────────────────────
  if (error) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.textoError}>{error}</Text>
        <TouchableOpacity style={styles.botonReintentar} onPress={cargarHistorial}>
          <Text style={styles.botonReintentarTexto}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>

      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.titulo}>📋 Historial</Text>
        <Text style={styles.subtitulo}>
          {historial.length} alimentos escaneados
        </Text>
      </View>

      {/* Lista vacía */}
      {historial.length === 0 ? (
        <View style={styles.centrado}>
          <Text style={styles.textoVacio}>🍽</Text>
          <Text style={styles.textoVacioMensaje}>
            Aún no has escaneado ningún alimento
          </Text>
          <Text style={styles.textoVacioSub}>
            Escanea tu primer plato desde la pantalla principal
          </Text>
        </View>
      ) : (
        // Lista de alimentos escaneados
        <FlatList
          data={historial}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.lista}
          // Permite refrescar jalando hacia abajo
          refreshControl={
            <RefreshControl
              refreshing={refrescando}
              onRefresh={onRefresh}
              colors={['#4CAF50']}
            />
          }
        />
      )}
    </View>
  );
}

// ── Estilos ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1B3A1E',
  },
  subtitulo: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  lista: {
    padding: 20,
    paddingBottom: 40,
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  tarjetaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nombreAlimento: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b5e20',
    textTransform: 'capitalize',
    flex: 1,
  },
  badgeCalorias: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  badgeTexto: {
    color: '#E65100',
    fontWeight: 'bold',
    fontSize: 13,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  macro: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  fecha: {
    fontSize: 12,
    color: '#AAA',
    marginTop: 4,
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  textoCargando: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  textoError: {
    color: '#C62828',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  botonReintentar: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  botonReintentarTexto: {
    color: '#fff',
    fontWeight: '700',
  },
  textoVacio: {
    fontSize: 60,
    marginBottom: 15,
  },
  textoVacioMensaje: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  textoVacioSub: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});