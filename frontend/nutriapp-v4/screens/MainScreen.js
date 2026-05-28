import { useState } from 'react';
import {
  View, Text, TouchableOpacity, Image, StyleSheet,
  ActivityIndicator, ScrollView, StatusBar
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const BACKEND_URL = 'https://columellate-supplementally-rachel.ngrok-free.dev';

// ── Componente principal ───────────────────────────────────────────
export default function MainScreen({ route, navigation }) {
  
  // Obtener el username que viene desde LoginScreen
  const username = route?.params?.username || null;
  
  const [imagen, setImagen] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // ── Función para tomar foto con la cámara ──────────────────────
  const tomarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      alert('Necesitamos permiso para usar la cámara');
      return;
    }
    const foto = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!foto.canceled) {
      setImagen(foto.assets[0].uri);
      setResultado(null);
      setError(null);
      await analizarImagen(foto.assets[0]);
    }
  };

  // ── Función para elegir foto de la galería ─────────────────────
  const elegirDeGaleria = async () => {
    const foto = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!foto.canceled) {
      setImagen(foto.assets[0].uri);
      setResultado(null);
      setError(null);
      await analizarImagen(foto.assets[0]);
    }
  };

  // ── Función principal: envía la imagen al backend ──────────────
  const analizarImagen = async (foto) => {
    setCargando(true);
    try {
      // Crear el formulario con la imagen
      const formData = new FormData();
      formData.append('imagen', {
        uri: foto.uri,
        type: 'image/jpeg',
        name: 'foto.jpg',
      });
      
      // Agregar el username si está disponible para guardar en historial
      const url = username
        ? `${BACKEND_URL}/analyze?username=${encodeURIComponent(username)}`
        : `${BACKEND_URL}/analyze`;

      const respuesta = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      
      const datos = await respuesta.json();
      setResultado(datos);
    } catch (e) {
      setError('Error de conexión: Verifica tu red');
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contenedor}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" />

      {/* Encabezado con saludo y botón de historial */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.saludo}>Hola, saludable 👋</Text>
          <Text style={styles.titulo}>Escanea tu plato</Text>
        </View>
        {/* Botón para ir al historial */}
        <TouchableOpacity
          style={styles.botonHistorial}
          onPress={() => navigation.navigate('Historial', { username })}
        >
          <Text style={styles.botonHistorialTexto}>📋 Historial</Text>
        </TouchableOpacity>
      </View>

      {/* Tarjeta de acciones: cámara y galería */}
      <View style={styles.cardAcciones}>
        <Text style={styles.instrucciones}>
          Sube una foto para analizar los nutrientes
        </Text>
        <View style={styles.botones}>
          <TouchableOpacity style={styles.botonPrincipal} onPress={tomarFoto}>
            <Text style={styles.botonTexto}>📷 Cámara</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botonSecundario} onPress={elegirDeGaleria}>
            <Text style={styles.botonTextoSecundario}>🖼 Galería</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Imagen tomada con overlay de carga */}
      {imagen && (
        <View style={styles.contenedorImagen}>
          <Image source={{ uri: imagen }} style={styles.imagen} />
          {cargando && (
            <View style={styles.overlayCargando}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.textoCargando}>Analizando...</Text>
            </View>
          )}
        </View>
      )}

      {/* Mensaje de error */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
        </View>
      )}

      {/* Resultados nutricionales */}
      {resultado && !cargando && (
        <>
          {/* Tarjeta de macros */}
          <View style={styles.tarjetaResultado}>
            <View style={styles.headerResultado}>
              <Text style={styles.alimento}>
                {resultado.alimento_detectado}
              </Text>
              <View style={styles.badgeCalorias}>
                <Text style={styles.badgeTexto}>
                  {resultado.nutricion.calorias} kcal
                </Text>
              </View>
            </View>

            <Text style={styles.seccionTitulo}>Macronutrientes</Text>

            <View style={styles.gridMacros}>
              <View style={styles.itemMacro}>
                <Text style={styles.macroEmoji}>💪</Text>
                <Text style={styles.macroValor}>
                  {resultado.nutricion.proteinas}g
                </Text>
                <Text style={styles.macroNombre}>Prot</Text>
              </View>
              <View style={styles.itemMacro}>
                <Text style={styles.macroEmoji}>🍞</Text>
                <Text style={styles.macroValor}>
                  {resultado.nutricion.carbohidratos}g
                </Text>
                <Text style={styles.macroNombre}>Carbs</Text>
              </View>
              <View style={styles.itemMacro}>
                <Text style={styles.macroEmoji}>🥑</Text>
                <Text style={styles.macroValor}>
                  {resultado.nutricion.grasas}g
                </Text>
                <Text style={styles.macroNombre}>Grasas</Text>
              </View>
            </View>
          </View>

          {/* Tarjeta de recetas sugeridas por IA */}
          {resultado.recetas && resultado.recetas.length > 0 && (
            <View style={styles.tarjetaRecetas}>
              <Text style={styles.recetasTitulo}>
                🍳 Recetas sugeridas
              </Text>
              <Text style={styles.recetasSubtitulo}>
                Ideas para cocinar con {resultado.alimento_detectado}
              </Text>
              {resultado.recetas.map((receta, index) => (
                <View key={index} style={styles.itemReceta}>
                  <Text style={styles.recetaNumero}>{String(index + 1)}</Text>
                  <Text style={styles.recetaNombre}>{receta}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

// ── Estilos ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    backgroundColor: '#F8FAF8',
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 40
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  saludo: { fontSize: 16, color: '#666', fontWeight: '500' },
  titulo: { fontSize: 30, fontWeight: '800', color: '#1B3A1E' },
  botonHistorial: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  botonHistorialTexto: {
    color: '#2E7D32',
    fontWeight: '700',
    fontSize: 13,
  },
  cardAcciones: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 25,
    elevation: 3,
  },
  instrucciones: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 15,
    fontSize: 14,
  },
  botones: { flexDirection: 'row', gap: 12 },
  botonPrincipal: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  botonSecundario: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  botonTexto: { color: 'white', fontSize: 16, fontWeight: '700' },
  botonTextoSecundario: { color: '#4CAF50', fontSize: 16, fontWeight: '700' },
  contenedorImagen: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 25,
    height: 300,
    backgroundColor: '#eee',
  },
  imagen: { width: '100%', height: '100%' },
  overlayCargando: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textoCargando: { color: '#fff', marginTop: 10, fontWeight: '600' },
  tarjetaResultado: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 28,
    marginBottom: 20,
    elevation: 6
  },
  headerResultado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  alimento: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1b5e20',
    textTransform: 'capitalize',
    flex: 1,
  },
  badgeCalorias: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeTexto: { color: '#E65100', fontWeight: 'bold', fontSize: 14 },
  seccionTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#AAA',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15
  },
  gridMacros: { flexDirection: 'row', justifyContent: 'space-between' },
  itemMacro: {
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 20,
    width: '30%',
  },
  macroEmoji: { fontSize: 20, marginBottom: 5 },
  macroValor: { fontSize: 16, fontWeight: '800', color: '#333' },
  macroNombre: { fontSize: 12, color: '#999' },
  // Estilos de recetas
  tarjetaRecetas: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 28,
    marginBottom: 20,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  recetasTitulo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1b5e20',
    marginBottom: 5,
  },
  recetasSubtitulo: {
    fontSize: 13,
    color: '#888',
    marginBottom: 15,
  },
  itemReceta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recetaNumero: {
    width: 28,
    height: 28,
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '800',
    color: '#2E7D32',
    marginRight: 12,
  },
  recetaNombre: { fontSize: 16, color: '#333', fontWeight: '500' },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20
  },
  error: { color: '#C62828', textAlign: 'center', fontWeight: '500' },
});