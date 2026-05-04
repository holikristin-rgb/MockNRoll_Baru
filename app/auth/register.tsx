import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Form Belum Lengkap", "Semua kolom harus diisi ya!");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Gagal", "Password minimal 8 karakter!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Tidak Cocok", "Konfirmasi password harus sama.");
      return;
    }

    try {
      const userRole = username.toLowerCase().includes("admin")
        ? "admin"
        : "user";

      // Mengirim data lengkap ke AuthContext
      const success = await register({
        username,
        email,
        password,
        role: userRole,
      });

      if (success) {
        await AsyncStorage.setItem(
          "tempLogin",
          JSON.stringify({
            identifier: username,
            password: password,
          }),
        );

        Alert.alert(
          "Pendaftaran Berhasil",
          `Akun ${userRole} kamu sudah terdaftar.`,
          [
            {
              text: "Ke Halaman Login",
              onPress: () => router.replace("/auth/login"),
            },
          ],
        );
      } else {
        Alert.alert("Gagal", "Gagal menyimpan data akun.");
      }
    } catch (error) {
      Alert.alert("Error", "Masalah pada koneksi penyimpanan.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Akun</Text>
      <TextInput
        placeholder="Username"
        style={styles.input}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordWrapper}>
        <TextInput
          placeholder="Password"
          style={styles.inputInside}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#C5A985"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordWrapper}>
        <TextInput
          placeholder="Konfirmasi Password"
          style={styles.inputInside}
          secureTextEntry={!showConfirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showConfirmPassword ? "eye-off" : "eye"}
            size={20}
            color="#C5A985"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>DAFTAR SEKARANG</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/auth/login")}>
        <Text style={{ color: "white", marginTop: 15, textAlign: "center" }}>
          Sudah punya akun? <Text style={{ color: "#C5A985" }}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#0E2F22",
  },
  title: {
    fontSize: 24,
    color: "#C5A985",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
  },
  inputInside: { flex: 1, padding: 15 },
  eyeIcon: { paddingHorizontal: 15 },
  button: {
    backgroundColor: "#C5A985",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
