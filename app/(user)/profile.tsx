import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
    }
  }, [user]);

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                user?.profileImage
                  ? { uri: user.profileImage }
                  : { uri: "https://via.placeholder.com/150" }
              }
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>{user.username}</Text>
          <Text style={styles.userSub}>{user.email}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informasi Akun</Text>
          <View style={styles.infoCard}>
            {/* Row Username */}
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#2D4628" />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Username</Text>
                <Text style={styles.infoValue}>{user.username}</Text>
              </View>
            </View>

            {/* Row Email */}
            <View style={[styles.infoRow, { marginTop: 15 }]}>
              <Ionicons name="mail-outline" size={20} color="#2D4628" />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>

            {/* Row Role */}
            <View style={[styles.infoRow, { marginTop: 15 }]}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#2D4628"
              />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Role</Text>
                <Text style={styles.infoValue}>{user.role}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.infoCard, { marginTop: 20, alignItems: "center" }]}
            onPress={logout}
          >
            <Text style={{ color: "#e11d48", fontWeight: "bold" }}>
              Keluar Akun
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F1E9" },
  scrollContent: { paddingBottom: 40 },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  avatarContainer: { marginBottom: 15 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#2D4628",
  },
  userName: { fontSize: 22, fontWeight: "800", color: "#2D4628" },
  userSub: { fontSize: 14, color: "#666" },
  infoSection: { paddingHorizontal: "10%", marginTop: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D4628",
    marginBottom: 10,
  },
  infoCard: { backgroundColor: "#fff", borderRadius: 15, padding: 15 },
  infoRow: { flexDirection: "row", alignItems: "center" },
  infoTextGroup: { marginLeft: 15 },
  infoLabel: { fontSize: 12, color: "#888" },
  infoValue: { fontSize: 15, fontWeight: "600" },
});
