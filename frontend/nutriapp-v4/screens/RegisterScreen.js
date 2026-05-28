import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Text, TextInput, TouchableOpacity, StyleSheet,
    View, KeyboardAvoidingView, Platform, StatusBar
} from "react-native";

const BACKEND_URL = "https://columellate-supplementally-rachel.ngrok-free.dev";

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const registerUser = async () => {
        if (!username || !password) {
            alert("Completa todos los campos");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(username)) {
            alert("Correo electrónico inválido");
            return;
        }
        if (password.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres");
            return;
        }
        try {
            const res = await fetch(`${BACKEND_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (!res.ok) throw new Error();
            alert("¡Bienvenido a tu nueva vida saludable!");
            setUsername("");
            setPassword("");
            navigation.navigate("Login");
        } catch (error) {
            alert("Error de conexión con el servidor");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.innerContainer}
            >
                {/* Círculo decorativo de fondo */}
                <View style={styles.headerDecoration} />

                {/* Encabezado con icono y textos */}
                <View style={styles.header}>
                    <Text style={styles.emoji}>🥗</Text>
                    <Text style={styles.title}>NutriLife</Text>
                    <Text style={styles.subtitle}>Comienza tu plan hoy mismo</Text>
                </View>

                {/* Formulario de registro */}
                <View style={styles.form}>
                    <Text style={styles.label}>Correo Electrónico</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="ejemplo@correo.com"
                        placeholderTextColor="#999"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <Text style={styles.label}>Contraseña</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mínimo 6 caracteres"
                        placeholderTextColor="#999"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity style={styles.button} onPress={registerUser} activeOpacity={0.8}>
                        <Text style={styles.buttonText}>Crear Cuenta</Text>
                    </TouchableOpacity>
                </View>

                {/* Enlace para ir al login */}
                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.loginText}>
                        ¿Ya tienes cuenta? <Text style={styles.loginLink}>Inicia sesión</Text>
                    </Text>
                </TouchableOpacity>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7FBF7" },
    innerContainer: { flex: 1, paddingHorizontal: 30, justifyContent: "center" },
    headerDecoration: {
        position: 'absolute', top: -50, right: -50,
        width: 200, height: 200, borderRadius: 100,
        backgroundColor: '#E8F5E9', zIndex: -1,
    },
    header: { alignItems: "center", marginBottom: 40 },
    emoji: { fontSize: 50, marginBottom: 10 },
    title: { fontSize: 32, fontWeight: "bold", color: "#2E7D32", letterSpacing: 1 },
    subtitle: { fontSize: 16, color: "#666", marginTop: 5 },
    form: {
        backgroundColor: "#fff", padding: 25, borderRadius: 25,
        shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
    },
    label: { fontSize: 14, fontWeight: "600", color: "#444", marginBottom: 8, marginLeft: 4 },
    input: {
        backgroundColor: "#F1F8E9", paddingHorizontal: 15, paddingVertical: 12,
        borderRadius: 12, marginBottom: 20, fontSize: 16, color: "#333",
        borderWidth: 1, borderColor: "#DCEDC8",
    },
    button: {
        backgroundColor: "#4CAF50", paddingVertical: 15, borderRadius: 15,
        alignItems: "center", marginTop: 10, elevation: 3,
    },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    loginButton: { marginTop: 25, alignItems: "center" },
    loginText: { color: "#666", fontSize: 15 },
    loginLink: { color: "#2E7D32", fontWeight: "bold" },
});