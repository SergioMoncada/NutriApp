import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const BACKEND_URL = 'https://columellate-supplementally-rachel.ngrok-free.dev';

export default function App() {
  const [imagen, setImagen] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const tomarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      alert('Necesitamos permiso para usar la cámara');
      return;
    }
    const foto = await ImagePicker.launchCameraAsync({
      mediaTypes:['images'],
      quality: 0.7,
    });
    if (!foto.canceled) {
      setImagen(foto.assets[0].uri);
      setResultado(null);
      setError(null);
      await analizarImagen(foto.assets[0]);
    }
  };

  const elegirDeGaleria = async () => {
    const foto = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!foto.canceled) {
      setImagen(foto.assets[0].uri);
      setResultado(null);
      setError(null);
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
      console.log('Enviando imagen al backend... a la URL:', `${BACKEND_URL}/analyze/`);
      const respuesta = await fetch(`http://192.168.137.89:8000/analyze`, {
        method: 'POST',
        body: formData,
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const datos = await respuesta.json();
      setResultado(datos);
    } catch (e) {
      setError('Error: ' + e.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.titulo}>🥗 NutriApp</Text>
      <View style={styles.botones}>
        <TouchableOpacity style={styles.boton} onPress={tomarFoto}>
          <Text style={styles.botonTexto}>📷 Cámara</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.boton, styles.botonSecundario]} onPress={elegirDeGaleria}>
          <Text style={styles.botonTexto}>🖼 Galería</Text>
        </TouchableOpacity>
      </View>

      {imagen && <Image source={{ uri: imagen }} style={styles.imagen} />}
      {cargando && <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {resultado && (
        <View style={styles.tarjeta}>
          <Text style={styles.alimento}>🍽 {resultado.alimento_detectado}</Text>
          <View style={styles.fila}>
            <Text style={styles.macro}>🔥 Calorías</Text>
            <Text style={styles.valor}>{resultado.nutricion.calorias} kcal</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.macro}>💪 Proteínas</Text>
            <Text style={styles.valor}>{resultado.nutricion.proteinas}g</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.macro}>🍞 Carbos</Text>
            <Text style={styles.valor}>{resultado.nutricion.carbohidratos}g</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.macro}>🥑 Grasas</Text>
            <Text style={styles.valor}>{resultado.nutricion.grasas}g</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: 20 },
  titulo: { fontSize: 32, fontWeight: 'bold', marginBottom: 30, color: '#2e7d32' },
  botones: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  boton: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 12 },
  botonSecundario: { backgroundColor: '#388E3C' },
  botonTexto: { color: 'white', fontSize: 16, fontWeight: '600' },
  imagen: { width: 280, height: 280, borderRadius: 16, marginVertical: 16 },
  tarjeta: { backgroundColor: 'white', padding: 20, borderRadius: 16, width: '100%', marginTop: 10, elevation: 4 },
  alimento: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#1b5e20', textTransform: 'capitalize' },
  fila: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  macro: { fontSize: 16, color: '#555' },
  valor: { fontSize: 16, fontWeight: '600', color: '#2e7d32' },
  error: { color: 'red', marginTop: 10, textAlign: 'center' },
});