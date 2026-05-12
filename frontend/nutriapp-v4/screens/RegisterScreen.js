import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
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
            alert("Gmail inválido");
            return;
        }
        if (password.length < 6) {
            alert("Mínimo 6 caracteres");
            return;
        }
        try {
            const res = await fetch(`${BACKEND_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (!res.ok) throw new Error();
            alert("Usuario guardado");
            setUsername("");
            setPassword("");
            navigation.navigate("Main"); // va a la pantalla principal
        } catch (error) {
            alert("Error conexión");
        }
    };

    const goToLogin = () => {
        navigation.navigate("Login"); // cuando tengas la pantalla de login
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Registro</Text>
            <TextInput
                style={styles.input}
                placeholder="Gmail"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={registerUser}>
                <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={goToLogin}>
                <Text style={styles.loginText}>Ir a iniciar sesión</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 28, textAlign: "center", marginBottom: 30 },
    input: { borderWidth: 1, padding: 12, marginBottom: 15, borderRadius: 10 },
    button: { backgroundColor: "#00ff26", padding: 15, borderRadius: 10, alignItems: "center" },
    buttonText: { color: "#fff", fontWeight: "bold" },
    loginButton: { alignItems: "center", marginTop: 10 },
    loginText: { color: "#007AFF", fontWeight: "bold" },
});