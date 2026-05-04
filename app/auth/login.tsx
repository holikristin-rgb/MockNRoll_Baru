import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  useFocusEffect(
    useCallback(() => {
      const checkTempLogin = async () => {
        const temp = await AsyncStorage.getItem("tempLogin");
        if (temp) {
          const { identifier, password } = JSON.parse(temp);
          setIdentifier(identifier);
          setPassword(password);
          await AsyncStorage.removeItem("tempLogin");
        }
      };
      checkTempLogin();
    }, []),
  );

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Peringatan", "Isi data dulu!");
      return;
    }
    try {
      const result = await login(identifier, password);
      if (result.success) {
        if (result.role === "admin") {
          router.replace("/dashboard");
        } else {
          router.replace("/auth/setup-profile");
        }
      } else {
        Alert.alert("Gagal", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Gagal menghubungi sistem login.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>MASUK</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/auth/register")}>
        <Text style={{ color: "white", marginTop: 20, textAlign: "center" }}>
          Belum punya akun?{" "}
          <Text style={{ color: "#C5A985" }}>Daftar Aku Baru</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#0E2F22",
  },
  title: {
    fontSize: 32,
    color: "#C5A985",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: { backgroundColor: "#C5A985", padding: 15, borderRadius: 10 },
  buttonText: { textAlign: "center", color: "white", fontWeight: "bold" },
});
