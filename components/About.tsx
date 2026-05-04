import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function About() {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Section Gambar Hero - Desain Modelis & Floating */}
        <View style={styles.heroSection}>
          <View style={styles.imageShadowLayer}>
            <View style={styles.imageContainer}>
              <Image
                source={require("../assets/images/hero-food.png")}
                style={styles.heroImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* Header Content */}
        <View style={styles.headerWrapper}>
          <Text style={styles.brandTagline}>Artisanal Flavor</Text>
          <Text style={styles.title}>Tentang MOCK'N'ROLLS</Text>
          <View style={styles.underline} />
        </View>

        {/* Card Informasi - Lebih Minimalis */}
        <View style={styles.infoCard}>
          <Text style={styles.description}>
            MOCK'N'ROLLS merupakan destinasi kuliner digital modern yang
            menghadirkan simfoni rasa antara kelezatan tradisional dan kesegaran
            kontemporer. Kami menspesialisasikan diri pada pembuatan Risol
            premium dengan tekstur renyah yang dipadukan secara eksklusif
            bersama Mocktail artisan berkualitas tinggi.
          </Text>
          <Text style={styles.descriptionText}>
            Berbasis di Medan, kami mengusung sistem penjualan pre-order melalui
            platform digital untuk memastikan setiap produk yang sampai ke
            tangan pelanggan terjaga kualitas dan kesegarannya.
          </Text>
        </View>

        {/* Stats Section - Modern Pill Style */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statNum}>100%</Text>
            <Text style={styles.statLab}>Segar</Text>
          </View>
          <View style={styles.statPillActive}>
            <Text style={styles.statNumActive}>Digital</Text>
            <Text style={styles.statLabActive}>Pre-Order</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statNum}>Premium</Text>
            <Text style={styles.statLab}>Quality</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Established in Medan • 2026</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#FDFDFB", // Off-white yang lebih elegan
  },
  container: {
    paddingHorizontal: 25,
    paddingBottom: 40,
    alignItems: "center",
  },
  heroSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  imageShadowLayer: {
    width: width * 0.88,
    borderRadius: 30,
    backgroundColor: "transparent",
    // Efek Shadow yang "Deep" dan menyebar
    shadowColor: "#2D4628",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 20,
  },
  imageContainer: {
    backgroundColor: "#fff",
    borderRadius: 30,
    overflow: "hidden",
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  heroImage: {
    width: "100%",
    height: 240,
  },
  headerWrapper: {
    alignItems: "center",
    marginBottom: 25,
  },
  brandTagline: {
    fontSize: 12,
    fontWeight: "700",
    color: "#C5A985",
    letterSpacing: 4,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#2D4628",
    textAlign: "center",
  },
  underline: {
    width: 50,
    height: 4,
    backgroundColor: "#C5A985",
    marginTop: 10,
    borderRadius: 2,
  },
  infoCard: {
    width: "100%",
    paddingVertical: 10,
  },
  description: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "500",
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 40,
    justifyContent: "space-between",
    width: "100%",
  },
  statPill: {
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    paddingVertical: 15,
    borderRadius: 25,
    width: "31%",
  },
  statPillActive: {
    alignItems: "center",
    backgroundColor: "#2D4628",
    paddingVertical: 15,
    borderRadius: 25,
    width: "31%",
    transform: [{ scale: 1.05 }], // Menonjolkan bagian pre-order
    elevation: 5,
  },
  statNum: { color: "#2D4628", fontWeight: "800", fontSize: 14 },
  statLab: { color: "#888", fontSize: 10, marginTop: 2 },
  statNumActive: { color: "#C5A985", fontWeight: "800", fontSize: 14 },
  statLabActive: { color: "#fff", fontSize: 10, marginTop: 2 },
  footer: {
    marginTop: 50,
  },
  footerText: {
    fontSize: 12,
    color: "#BBB",
    letterSpacing: 1,
  },
});
