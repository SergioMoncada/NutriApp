import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// ⚠️ Cambia esta IP por la de tu PC (la verás cuando corras el backend)
const BACKEND_URL = '  https://columellate-supplementally-rachel.ngrok-free.dev';

export default function App() {
  const [imagen, setImagen] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const tomarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      alert('Necesitamos permiso para usar la cámara');
      return;
    }

    const foto = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!foto.canceled) {
      setImagen(foto.assets[0].uri);
      setResultado(null);
      await analizarImagen(foto.assets[0]);
    }
  };

  const analizarImagen = async (foto) => {
    setCargando(true);
    try {
      const formData = new FormData();
      formData.append('imagen', {
        uri: foto.uri,
        type: 'image/jpeg',
        name: 'foto.jpg',
      });

      const respuesta = await fetch(`${BACKEND_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      const datos = await respuesta.json();
      setResultado(datos);
    } catch (error) {
      alert('Error al conectar con el servidor: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>🥗 NutriApp</Text>

      <TouchableOpacity style={styles.boton} onPress={tomarFoto}>
        <Text style={styles.botonTexto}>📷 Tomar foto</Text>
      </TouchableOpacity>

      {imagen && <Image source={{ uri: imagen }} style={styles.imagen} />}

      {cargando && <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />}

      {resultado && (
        <View style={styles.tarjeta}>
          <Text style={styles.alimento}>🍽 {resultado.alimento_detectado}</Text>
          <Text style={styles.macro}>🔥 Calorías: {resultado.nutricion.calorias} kcal</Text>
          <Text style={styles.macro}>💪 Proteínas: {resultado.nutricion.proteinas}g</Text>
          <Text style={styles.macro}>🍞 Carbos: {resultado.nutricion.carbohidratos}g</Text>
          <Text style={styles.macro}>🥑 Grasas: {resultado.nutricion.grasas}g</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: 20 },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: '#2e7d32' },
  boton: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 12, marginBottom: 20 },
  botonTexto: { color: 'white', fontSize: 18, fontWeight: '600' },
  imagen: { width: 250, height: 250, borderRadius: 12, marginVertical: 16 },
  tarjeta: { backgroundColor: 'white', padding: 20, borderRadius: 12, width: '100%', marginTop: 10, elevation: 3 },
  alimento: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#1b5e20' },
  macro: { fontSize: 16, marginVertical: 4, color: '#333' },
});