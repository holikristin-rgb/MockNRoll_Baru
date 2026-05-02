import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

export default function RootLayout() {
  return (
    <AuthProvider> 
      <CartProvider>
        {/* Pastikan Stack adalah satu-satunya yang dirender di sini agar navigasi siap */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/register" />
          <Stack.Screen name="(user)/profile" />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}