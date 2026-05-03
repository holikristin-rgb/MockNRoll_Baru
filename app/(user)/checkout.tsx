import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useMemo, useRef, useState } from "react";
import {
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

// Pastikan path gambar QRIS sesuai dengan folder assets Anda
const QRIS_IMAGE = require("../../assets/images/qris-payment.png");

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { addOrder, user } = useAuth();
  const [method, setMethod] = useState<string | null>(null);
  const [uploadBukti, setUploadBukti] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();
  const viewShotRef = useRef<any>(null);

  // State untuk Custom Popup
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  const invoiceNumber = useMemo(
    () => `MNR-${Math.floor(10000 + Math.random() * 90000)}`,
    [],
  );
  const today = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const showAlert = (title: string, message: string) => {
    setModalContent({ title, message });
    setModalVisible(true);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setUploadBukti(result.assets[0].uri);
    }
  };

  const isButtonDisabled = !method || (method === "QRIS" && !uploadBukti);

  const sendWhatsAppConfirmation = () => {
    const phoneNumber = "6281269197525"; // Nomor WhatsApp tujuan yang sudah diperbarui
    const orderDetails = cart
      .map((item: any) => `- ${item.name} (${item.quantity}x)`)
      .join("\n");
    const message = `*KONFIRMASI PESANAN TUNAI*\n\n*Invoice:* ${invoiceNumber}\n*Nama:* ${user?.username || "Guest"}\n*Total:* Rp ${totalPrice.toLocaleString("id-ID")}\n\n*Pesanan:*\n${orderDetails}\n\nSaya bayar tunai di tempat.`;
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() =>
      showAlert("Error", "Gagal membuka WhatsApp."),
    );
  };

  const handleShareStruk = async () => {
    if (Platform.OS === "web") {
      showAlert(
        "⚠️ Notifikasi",
        "Fitur Bagikan Struk hanya tersedia untuk pengguna handphone.",
      );
      return;
    }
    try {
      const uri = await viewShotRef.current.capture();
      await Sharing.shareAsync(uri);
    } catch (error) {
      showAlert("❌ Error", "Terjadi kesalahan saat membagikan struk.");
    }
  };

  const handleDownloadStruk = async () => {
    if (Platform.OS === "web") {
      showAlert(
        "⚠️ Notifikasi",
        "Fitur Unduh Struk hanya tersedia untuk pengguna handphone.",
      );
      return;
    }
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        const uri = await viewShotRef.current.capture();
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync("MockNRoll", asset, false);
        showAlert(
          "📸 Berhasil",
          "Struk belanja sudah tersimpan di album 'MockNRoll' pada galeri kamu!",
        );
      } else {
        showAlert(
          "🚫 Izin Ditolak",
          "Butuh izin akses galeri untuk menyimpan struk.",
        );
      }
    } catch (error) {
      showAlert(
        "❌ Error",
        "Gagal mengunduh struk. Pastikan izin penyimpanan sudah aktif.",
      );
    }
  };

  const handleKonfirmasiFinal = async () => {
    if (isButtonDisabled) return;
    await addOrder({
      invoice: invoiceNumber,
      customer: user?.username || "Guest",
      total: totalPrice,
      method: method,
      items: cart,
      date: today,
      bukti: uploadBukti,
    });
    setIsFinished(true);
    if (method === "TUNAI") sendWhatsAppConfirmation();
  };

  return (
    <View style={styles.wrapper}>
      <Navbar />

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <Text style={styles.modalText}>{modalContent.message}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Mengerti</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.container}>
        <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }}>
          <View style={styles.receiptCard}>
            <View style={styles.receiptHeader}>
              <Text style={styles.brandTitle}>{"MOCK'N'ROLLS"}</Text>
              <Text style={styles.brandSub}>PREMIUM RISOL & MOCKTAIL</Text>
            </View>
            <View style={styles.dashedLine} />
            <View style={styles.orderList}>
              {cart.map((item: any) => (
                <View key={item.id} style={styles.orderRow}>
                  <Text style={styles.orderQty}>{item.quantity}x</Text>
                  <Text style={styles.orderName}>{item.name}</Text>
                  <Text style={styles.orderPrice}>
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.line} />
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Bayar</Text>
              <Text style={styles.totalValue}>
                Rp {totalPrice.toLocaleString("id-ID")}
              </Text>
            </View>
            {isFinished && (
              <Text style={styles.statusLabel}>
                {method === "QRIS"
                  ? "STATUS: LUNAS (QRIS)"
                  : "STATUS: MENUNGGU TUNAI"}
              </Text>
            )}
            <Text style={styles.footerNote}>
              {"Terima kasih sudah jajan di MOCK'N'ROLLS!"}
            </Text>
          </View>
        </ViewShot>

        {!isFinished && (
          <View style={styles.selectionArea}>
            <Text style={styles.sectionTitle}>Pilih Metode Pembayaran</Text>
            <View style={styles.methodRow}>
              <TouchableOpacity
                style={[
                  styles.methodBtn,
                  method === "QRIS" && styles.activeBtn,
                ]}
                onPress={() => setMethod("QRIS")}
              >
                <Text
                  style={[
                    styles.methodText,
                    method === "QRIS" && styles.activeText,
                  ]}
                >
                  QRIS
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.methodBtn,
                  method === "TUNAI" && styles.activeBtn,
                ]}
                onPress={() => {
                  setMethod("TUNAI");
                  setUploadBukti(null);
                }}
              >
                <Text
                  style={[
                    styles.methodText,
                    method === "TUNAI" && styles.activeText,
                  ]}
                >
                  TUNAI
                </Text>
              </TouchableOpacity>
            </View>

            {method === "QRIS" && (
              <View style={styles.qrContainer}>
                <Image
                  source={QRIS_IMAGE}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
                <Text style={styles.uploadInfo}>
                  Upload Bukti Transfer Kamu:
                </Text>
                <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
                  {uploadBukti ? (
                    <Image
                      source={{ uri: uploadBukti }}
                      style={styles.previewImage}
                    />
                  ) : (
                    <Text style={styles.placeholderText}>
                      + Pilih Foto Bukti Bayar
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.confirmBtn,
                isButtonDisabled && styles.disabledBtn,
              ]}
              onPress={handleKonfirmasiFinal}
              disabled={isButtonDisabled}
            >
              <Text style={styles.confirmBtnText}>
                {method === "TUNAI"
                  ? "Selesaikan & Konfirmasi WA"
                  : "Selesaikan Pemesanan"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isFinished && (
          <View style={styles.actionArea}>
            <TouchableOpacity
              style={styles.shareBtn}
              onPress={handleShareStruk}
            >
              <Text style={styles.confirmBtnText}>Bagikan Struk</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={handleDownloadStruk}
            >
              <Text style={styles.confirmBtnText}>Unduh Struk</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.finishBtn}
              onPress={() => {
                clearCart();
                router.push("/(user)/menu");
              }}
            >
              <Text style={styles.finishBtnText}>
                Selesai & Kembali ke Menu
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#F7F7F7" },
  container: { padding: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: 320,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#2D4628",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: "#2D4628",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  modalButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  receiptCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    elevation: 5,
  },
  receiptHeader: { alignItems: "center" },
  brandTitle: { fontSize: 26, fontWeight: "900", color: "#2D4628" },
  brandSub: {
    fontSize: 10,
    color: "#A0522D",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderColor: "#EEE",
    borderStyle: "dashed",
    marginVertical: 15,
  },
  orderList: { marginVertical: 10 },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  orderQty: { width: 35, fontWeight: "bold", color: "#2D4628" },
  orderName: { flex: 1, color: "#444" },
  orderPrice: { fontWeight: "bold", color: "#2D4628" },
  line: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 12 },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 18, fontWeight: "bold" },
  totalValue: { fontSize: 22, fontWeight: "900", color: "#2D4628" },
  statusLabel: {
    textAlign: "center",
    color: "#2D4628",
    fontWeight: "900",
    marginTop: 20,
    fontSize: 16,
  },
  footerNote: {
    textAlign: "center",
    fontSize: 10,
    color: "#BBB",
    marginTop: 15,
    fontStyle: "italic",
  },
  selectionArea: { marginTop: 25 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  methodRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  methodBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  activeBtn: { borderColor: "#2D4628", backgroundColor: "#E9F0E8" },
  methodText: { fontWeight: "bold", color: "#888" },
  activeText: { color: "#2D4628" },
  qrContainer: { alignItems: "center", marginBottom: 20 },
  qrImage: { width: 200, height: 200, marginBottom: 15 },
  uploadInfo: {
    alignSelf: "flex-start",
    fontSize: 13,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 8,
  },
  uploadArea: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#CCC",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  previewImage: { width: "100%", height: "100%" },
  placeholderText: { color: "#AAA", fontSize: 13 },
  confirmBtn: {
    backgroundColor: "#2D4628",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  disabledBtn: { backgroundColor: "#CCC" },
  confirmBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  actionArea: { marginTop: 20 },
  shareBtn: {
    backgroundColor: "#3498DB",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  downloadBtn: {
    backgroundColor: "#E67E22",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  finishBtn: { padding: 15, alignItems: "center", marginTop: 5 },
  finishBtnText: { color: "#2D4628", fontWeight: "bold", fontSize: 15 },
});
