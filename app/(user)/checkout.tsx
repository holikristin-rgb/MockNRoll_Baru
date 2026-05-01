import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Navbar from '../../components/Navbar';
import { useCart } from '../../context/CartContext';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();

  const [method, setMethod] = useState('QRIS');
  const [customerName, setCustomerName] = useState('');

  const router = useRouter();

  const handleConfirm = async () => {
    if (cart.length === 0) {
      Alert.alert(
        'Keranjang kosong',
        'Silakan pilih menu terlebih dahulu.'
      );
      return;
    }

    if (!customerName.trim()) {
      Alert.alert(
        'Nama wajib diisi',
        'Masukkan nama pemesan.'
      );
      return;
    }

    const adminNumber = '6281269197525';

    const orderDetails = cart
      .map(
        (item) =>
          `• ${item.name} x${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`
      )
      .join('\n');

    const message = `
*PESANAN BARU MOCK'N'ROLLS*

Nama Pemesan:
${customerName}

Detail Pesanan:
${orderDetails}

Total Pembayaran:
Rp ${totalPrice.toLocaleString('id-ID')}

Metode Pembayaran:
${method}

Status:
SUDAH MELAKUKAN PEMBAYARAN
`;

    const whatsappUrl =
      `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;

    try {
      await Linking.openURL(whatsappUrl);

      Alert.alert(
        'Pesanan berhasil',
        'Pesanan sudah dikirim ke WhatsApp admin.'
      );

      clearCart();
      router.push('/(user)/menu');
    } catch (error) {
      Alert.alert(
        'Gagal membuka WhatsApp',
        'Pastikan WhatsApp sudah terinstall.'
      );
    }
  };

  return (
    <View style={styles.wrapper}>
      <Navbar />

      <ScrollView style={styles.container}>
        <Text style={styles.title}>
          Checkout Pesanan
        </Text>

        {/* Nama Pemesan */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Data Pemesan
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nama Pemesan"
            value={customerName}
            onChangeText={setCustomerName}
          />
        </View>

        {/* Ringkasan Pesanan */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Ringkasan Pesanan
          </Text>

          {cart.map((item) => (
            <View key={item.id} style={styles.orderRow}>
              <Text style={styles.orderName}>
                {item.name} x{item.quantity}
              </Text>

              <Text style={styles.orderPrice}>
                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
              </Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.card}>
          <Text style={styles.label}>
            Total Pembayaran
          </Text>

          <Text style={styles.totalPrice}>
            Rp {totalPrice.toLocaleString('id-ID')}
          </Text>
        </View>

        {/* Metode Pembayaran */}
        <Text style={styles.subTitle}>
          Pilih Metode Pembayaran
        </Text>

        <View style={styles.methodContainer}>
          <TouchableOpacity
            style={[
              styles.methodBtn,
              method === 'QRIS' && styles.activeMethod
            ]}
            onPress={() => setMethod('QRIS')}
          >
            <Text
              style={
                method === 'QRIS'
                  ? styles.activeText
                  : styles.normalText
              }
            >
              QRIS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodBtn,
              method === 'CASH' && styles.activeMethod
            ]}
            onPress={() => setMethod('CASH')}
          >
            <Text
              style={
                method === 'CASH'
                  ? styles.activeText
                  : styles.normalText
              }
            >
              CASH (PO)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tampilan pembayaran */}
        {method === 'QRIS' ? (
          <View style={styles.paymentBox}>
            <Text style={styles.paymentHint}>
              Scan QR berikut untuk pembayaran:
            </Text>

            <Image
              source={require('../../assets/images/qris-payment.png')}
              style={styles.qrisImage}
              resizeMode="contain"
            />

            <Text style={styles.brandName}>
              MOCK'N'ROLLS OFFICIAL
            </Text>
          </View>
        ) : (
          <View style={styles.paymentBox}>
            <Text style={styles.cashText}>
              Pembayaran cash dilakukan saat pengambilan
              pesanan (Pre Order).
            </Text>
          </View>
        )}

        {/* Tombol konfirmasi */}
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmText}>
            KONFIRMASI PESANAN
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F4F1E9'
  },

  container: {
    flex: 1,
    padding: 20
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D4628',
    marginBottom: 20
  },

  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2D4628'
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#FAFAFA'
  },

  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },

  orderName: {
    fontSize: 14,
    color: '#333'
  },

  orderPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D4628'
  },

  label: {
    color: '#666',
    fontSize: 14,
    marginBottom: 5
  },

  totalPrice: {
    fontSize: 30,
    fontWeight: '900',
    color: '#A0522D'
  },

  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2D4628'
  },

  methodContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20
  },

  methodBtn: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D4628'
  },

  activeMethod: {
    backgroundColor: '#2D4628'
  },

  activeText: {
    color: 'white',
    fontWeight: 'bold'
  },

  normalText: {
    color: '#2D4628'
  },

  paymentBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    minHeight: 250
  },

  paymentHint: {
    marginBottom: 15,
    color: '#666'
  },

  qrisImage: {
    width: 250,
    height: 250
  },

  brandName: {
    marginTop: 15,
    fontWeight: 'bold',
    color: '#2D4628'
  },

  cashText: {
    textAlign: 'center',
    color: '#444',
    lineHeight: 22
  },

  confirmBtn: {
    backgroundColor: '#A0522D',
    padding: 20,
    borderRadius: 12,
    marginTop: 30,
    marginBottom: 50,
    alignItems: 'center'
  },

  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});