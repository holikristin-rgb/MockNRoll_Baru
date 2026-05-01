import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Navbar from '../../components/Navbar';
import { useCart } from '../../context/CartContext';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const [method, setMethod] = useState('QRIS');
  const router = useRouter();

  // Generate invoice number
  const invoiceNumber = useMemo(() => {
    const randomNumber = Math.floor(
      10000 + Math.random() * 90000
    );
    return `MNR-${randomNumber}`;
  }, []);

  // Generate tanggal
  const today = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const handleWhatsappConfirm = async () => {
    const adminNumber = '6281269197525';

    const message =
      method === 'QRIS'
        ? `
Halo MOCK'N'ROLLS! Saya ingin konfirmasi pembayaran.

No. Invoice: ${invoiceNumber}
Total: Rp ${totalPrice.toLocaleString('id-ID')}

Saya akan segera mengirimkan bukti transfernya. Terima kasih!
`
        : `
Halo MOCK'N'ROLLS! Saya ingin konfirmasi pesanan cash.

No. Invoice: ${invoiceNumber}
Total: Rp ${totalPrice.toLocaleString('id-ID')}

Saya akan melakukan pembayaran saat pengambilan pesanan. Terima kasih!
`;

    const whatsappUrl =
      `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;

    await Linking.openURL(whatsappUrl);

    clearCart();
    router.push('/(user)/menu');
  };

  return (
    <View style={styles.wrapper}>
      <Navbar />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Receipt */}
        <View style={styles.receiptCard}>
          <Text style={styles.brandTitle}>
            MOCK'N'ROLLS
          </Text>

          <Text style={styles.brandSub}>
            PREMIUM RISOL & MOCKTAIL
          </Text>

          <View style={styles.line} />

          {/* Invoice */}
          <View style={styles.invoiceRow}>
            <View>
              <Text style={styles.label}>
                NO. INVOICE
              </Text>

              <Text style={styles.invoiceText}>
                {invoiceNumber}
              </Text>
            </View>

            <View>
              <Text style={styles.label}>
                TANGGAL
              </Text>

              <Text style={styles.invoiceText}>
                {today}
              </Text>
            </View>
          </View>

          {/* Order List */}
          <View style={styles.orderList}>
            {cart.map((item) => (
              <View
                key={item.id}
                style={styles.orderRow}
              >
                <Text style={styles.orderQty}>
                  {item.quantity}x
                </Text>

                <Text style={styles.orderName}>
                  {item.name}
                </Text>

                <Text style={styles.orderPrice}>
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.line} />

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Total Pembayaran
            </Text>

            <Text style={styles.totalValue}>
              Rp {totalPrice.toLocaleString('id-ID')}
            </Text>
          </View>

          {/* QRIS */}
          {method === 'QRIS' && (
            <View style={styles.qrSection}>
              <Image
                source={require('../../assets/images/qris-payment.png')}
                style={styles.qrImage}
                resizeMode="contain"
              />
            </View>
          )}

          {/* Dynamic Notes */}
          <Text style={styles.noteText}>
            {method === 'QRIS'
              ? '* Pesanan diproses setelah konfirmasi bukti bayar.'
              : '* Pesanan diproses dan dibayar saat pengambilan (Cash).'}
          </Text>

          <Text style={styles.noteText}>
            Terima kasih sudah jajan di MOCK'N'ROLLS!
          </Text>
        </View>

        {/* Payment Method */}
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
              CASH
            </Text>
          </TouchableOpacity>
        </View>

        {/* WhatsApp Button */}
        <TouchableOpacity
          style={styles.whatsappBtn}
          onPress={handleWhatsappConfirm}
        >
          <Text style={styles.whatsappText}>
            Konfirmasi ke WhatsApp
          </Text>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push('/(user)/menu')}
        >
          <Text style={styles.backText}>
            Kembali ke Beranda
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F7F7F7'
  },

  container: {
    padding: 20,
    alignItems: 'center'
  },

  receiptCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 25,
    elevation: 5
  },

  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    color: '#2D4628'
  },

  brandSub: {
    textAlign: 'center',
    color: '#A0522D',
    fontWeight: 'bold',
    marginBottom: 25
  },

  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    marginVertical: 20
  },

  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  label: {
    color: '#999',
    fontSize: 12
  },

  invoiceText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5
  },

  orderList: {
    marginVertical: 20
  },

  orderRow: {
    flexDirection: 'row',
    marginBottom: 12
  },

  orderQty: {
    width: 40,
    fontWeight: 'bold'
  },

  orderName: {
    flex: 1,
    fontSize: 16
  },

  orderPrice: {
    fontWeight: 'bold',
    fontSize: 16
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20
  },

  totalLabel: {
    fontSize: 22,
    fontWeight: 'bold'
  },

  totalValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2D4628'
  },

  qrSection: {
    alignItems: 'center',
    marginVertical: 20
  },

  qrImage: {
    width: 220,
    height: 220
  },

  noteText: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 8
  },

  methodContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 25,
    width: '100%',
    maxWidth: 500
  },

  methodBtn: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D4628',
    alignItems: 'center',
    backgroundColor: 'white'
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

  whatsappBtn: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#25D366',
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 20
  },

  whatsappText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },

  backBtn: {
    width: '100%',
    maxWidth: 500,
    borderWidth: 1,
    borderColor: '#2D4628',
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 40
  },

  backText: {
    color: '#2D4628',
    fontWeight: 'bold'
  }
});