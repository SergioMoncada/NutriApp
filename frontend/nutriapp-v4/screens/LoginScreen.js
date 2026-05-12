import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

const BACKEND_URL = "https://columellate-supplementally-rachel.ngrok-free.dev";

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [cargando, setCargando] = useState(false);

    const loginUser = async () => {
        if (!username || !password) {
            alert("Completa todos los campos");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(username)) {
            alert("Email inválido");
            return;
        }
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
            const data = await res.json();
            if (!res.ok) {
                alert(data.detail || "Error al iniciar sesión");
                return;
            }
            alert(`Bienvenido ${data.username}`);
            navigation.navigate("Main");
        } catch (error) {
            alert("Error de conexión");
        } finally {
            setCargando(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            {cargando ? (
                <ActivityIndicator size="large" color="#4CAF50" />
            ) : (
                <TouchableOpacity style={styles.button} onPress={loginUser}>
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate("Register")}
            >
                <Text style={styles.registerText}>
                    ¿No tienes cuenta? Regístrate
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f5f5f5" },
    title: { fontSize: 28, textAlign: "center", marginBottom: 30, fontWeight: "bold", color: "#2e7d32" },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 15, borderRadius: 10, backgroundColor: "white" },
    button: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 10, alignItems: "center" },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    registerButton: { alignItems: "center", marginTop: 15 },
    registerText: { color: "#007AFF", fontWeight: "bold" },
});