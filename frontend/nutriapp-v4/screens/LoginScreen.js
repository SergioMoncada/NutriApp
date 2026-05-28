import React, { useState } from "react";
// Importa React y el hook useState para manejar el estado local del componente.

import { SafeAreaView } from "react-native-safe-area-context";
// Importa SafeAreaView para ajustar el contenido a las áreas seguras del dispositivo.

import {
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    View,
    KeyboardAvoidingView,
    Platform,
    StatusBar
} from "react-native";
// Importa componentes de React Native para texto, entradas de texto, botones,
// estilos, indicador de carga, vistas, manejo de teclado, detección de plataforma y barra de estado.

const BACKEND_URL = "https://columellate-supplementally-rachel.ngrok-free.dev";
// Define la URL del backend donde se hacen las peticiones de login.

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [cargando, setCargando] = useState(false);
    // Define los estados del componente:
    // username para el correo, password para la contraseña y cargando para el indicador.

    const loginUser = async () => {
        if (!username || !password) {
            alert("Completa todos los campos");
            return;
        }
        // Si falta usuario o contraseña, muestra alerta y no continúa.

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(username)) {
            alert("Email inválido");
            return;
        }
        // Valida que el correo tenga un formato básico correcto.

        setCargando(true);
        try {
            const res = await fetch(`${BACKEND_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
                body: JSON.stringify({ username, password }),
            });
            // Hace la petición POST al endpoint /login del backend con username y password.

            const data = await res.json();
            if (!res.ok) {
                alert(data.detail || "Error al iniciar sesión");
                return;
            }
            // Si la respuesta no es exitosa, muestra el error devuelto por el backend.

            alert(`¡Qué bueno verte de nuevo, ${data.username}!`);
            navigation.navigate("Main", { username: data.username });
            // Si el login es exitoso, muestra mensaje y navega a la pantalla principal.
        } catch (error) {
            alert("Error de conexión");
        } finally {
            setCargando(false);
        }
        // Maneja errores de conexión y siempre quita el indicador de carga al final.
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.innerContainer}
            >
                {/* Decoración de fondo */}
                <View style={styles.circleTop} />

                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.logoEmoji}>🍏</Text>
                    </View>
                    <Text style={styles.title}>¡Hola de nuevo!</Text>
                    <Text style={styles.subtitle}>Tu salud te ha estado esperando</Text>
                </View>
                // Encabezado de bienvenida con icono y textos.

                <View style={styles.formCard}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="tu@correo.com"
                            placeholderTextColor="#999"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>
                    // Campo de entrada para el correo electrónico.

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                    // Campo de entrada para la contraseña con ocultación de texto.

                    {cargando ? (
                        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
                    ) : (
                        <TouchableOpacity 
                            style={styles.mainButton} 
                            onPress={loginUser}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>Iniciar Sesión</Text>
                        </TouchableOpacity>
                    )}
                    // Muestra un indicador de carga si está cargando, o el botón de login.
                </View>

                <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() => navigation.navigate("Register")}
                >
                    <Text style={styles.footerText}>
                        ¿Aún no tienes cuenta? <Text style={styles.linkText}>Crea una</Text>
                    </Text>
                </TouchableOpacity>
                // Enlace para navegar a la pantalla de registro.
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#F7FBF7" 
    },
    innerContainer: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: "center",
    },
    circleTop: {
        position: 'absolute',
        top: -100,
        left: -50,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: '#E8F5E9',
        zIndex: -1,
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
    },
    iconContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#fff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    logoEmoji: {
        fontSize: 40,
    },
    title: { 
        fontSize: 30, 
        fontWeight: "bold", 
        color: "#2E7D32",
        textAlign: "center"
    },
    subtitle: {
        fontSize: 15,
        color: "#777",
        marginTop: 8,
        textAlign: "center"
    },
    formCard: {
        backgroundColor: "#fff",
        borderRadius: 30,
        padding: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 8,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: "700",
        color: "#4CAF50",
        marginBottom: 8,
        textTransform: 'uppercase',
        marginLeft: 5,
    },
    input: { 
        backgroundColor: "#F9F9F9",
        borderWidth: 1,
        borderColor: "#EDF2ED",
        padding: 15, 
        borderRadius: 15,
        fontSize: 16,
        color: "#333"
    },
    mainButton: { 
        backgroundColor: "#4CAF50", 
        paddingVertical: 16, 
        borderRadius: 18, 
        alignItems: "center",
        marginTop: 10,
        elevation: 4,
        shadowColor: "#4CAF50",
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonText: { 
        color: "#fff", 
        fontWeight: "bold", 
        fontSize: 17 
    },
    loader: {
        marginVertical: 10,
    },
    footerButton: { 
        alignItems: "center", 
        marginTop: 30 
    },
    footerText: { 
        color: "#666", 
        fontSize: 15 
    },
    linkText: { 
        color: "#2E7D32", 
        fontWeight: "bold" 
    },
});