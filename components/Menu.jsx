// components/Menu.tsx
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const items = [
  {
    id: 1,
    name: "Risol Coklat",
    price: "Rp. 4.000",
    desc: "Lumeran coklat premium dengan kulit risol yang renyah.",
    image: require("../assets/images/risol-coklat.png"),
  },
  {
    id: 2,
    name: "Risol Matcha",
    price: "Rp. 4.000",
    desc: "Sensasi matcha otentik yang lumer di setiap gigitan.",
    image: require("../assets/images/risol-matcha.png"),
  },
  {
    id: 3,
    name: "Blueberry Mocktail",
    price: "Rp. 10.000",
    desc: "Kesegaran blueberry asli dengan soda yang menyejukkan.",
    image: require("../assets/images/mocktail-blueberry.png"),
  },
];

export default function Menu() {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Popular Item</Text>
        <View style={styles.underline} />
      </View>

      <View style={styles.listContainer}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.horizontalCard}
            activeOpacity={0.7}
          >
            {/* Bagian Gambar Kecil */}
            <Image
              source={item.image}
              style={styles.smallImg}
              resizeMode="cover"
            />

            {/* Bagian Keterangan Produk */}
            <View style={styles.textContainer}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc} numberOfLines={2}>
                  {item.desc}
                </Text>
              </View>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>

            {/* Dekorasi tombol plus kecil */}
            <View style={styles.addButton}>
              <Text style={styles.addIcon}>+</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#F4F1E9",
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2D4628",
  },
  underline: {
    height: 3,
    width: 40,
    backgroundColor: "#C5A985",
    marginTop: 4,
  },
  listContainer: {
    gap: 15,
  },
  horizontalCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    // Shadow halus
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  smallImg: {
    width: 80,
    height: 80,
    borderRadius: 15,
    backgroundColor: "#f9f9f9",
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "space-between",
    height: 80,
    paddingVertical: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D4628",
  },
  itemDesc: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
    lineHeight: 16,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#C5A985",
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#2D4628",
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
