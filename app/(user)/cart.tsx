import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Navbar from '../../components/Navbar';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const router = useRouter();

  const {
    cart,
    removeFromCart,
    addToCart,
    deleteItem,
    totalPrice
  } = useCart();

  const handleCheckout = () => {
    if (cart.length > 0) {
      router.push('/(user)/checkout');
    }
  };

  return (
    <View style={styles.container}>
      <Navbar />

      <View style={styles.mainContainer}>
        <Text style={styles.headerTitle}>
          Keranjang Belanja
        </Text>

        {cart.length === 0 ? (
          <View style={styles.emptyContent}>
            <Ionicons
              name="basket-outline"
              size={80}
              color="#CCC"
            />

            <Text style={styles.emptyText}>
              Keranjang kamu masih kosong
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={cart}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.itemRow}>

                  {/* Kiri */}
                  <View style={styles.leftContent}>
                    <Text style={styles.itemName}>
                      {item.name}
                    </Text>

                    <Text style={styles.itemPrice}>
                      Rp {item.price.toLocaleString('id-ID')}
                    </Text>

                    <Text style={styles.subtotal}>
                      Subtotal:
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </Text>
                  </View>

                  {/* Kanan */}
                  <View style={styles.rightContent}>
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => deleteItem(item.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#A0522D"
                      />
                    </TouchableOpacity>

                    <View style={styles.qtyBox}>
                      <TouchableOpacity
                        onPress={() => removeFromCart(item.id)}
                      >
                        <Ionicons
                          name="remove-circle-outline"
                          size={26}
                          color="#2D4628"
                        />
                      </TouchableOpacity>

                      <Text style={styles.qtyVal}>
                        {item.quantity}
                      </Text>

                      <TouchableOpacity
                        onPress={() => addToCart(item)}
                      >
                        <Ionicons
                          name="add-circle-outline"
                          size={26}
                          color="#2D4628"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.totalInfo}>
                <Text style={styles.totalLabel}>
                  Total Belanja
                </Text>

                <Text style={styles.totalVal}>
                  Rp {totalPrice.toLocaleString('id-ID')}
                </Text>
              </View>

              <View style={styles.btnGroup}>
                <TouchableOpacity
                  style={styles.btnAdd}
                  onPress={() => router.push('/(user)/menu')}
                >
                  <Text style={styles.btnAddText}>
                    Tambah Menu
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnPay}
                  onPress={handleCheckout}
                >
                  <Text style={styles.btnPayText}>
                    Checkout
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD'
  },

  mainContainer: {
    flex: 1,
    padding: 20
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2D4628',
    marginBottom: 20
  },

  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  emptyText: {
    marginTop: 10,
    color: '#999'
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 2
  },

  leftContent: {
    flex: 1
  },

  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },

  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D4628'
  },

  itemPrice: {
    fontSize: 13,
    color: '#888',
    marginTop: 4
  },

  subtotal: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#A0522D'
  },

  deleteBtn: {
    marginBottom: 15
  },

  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },

  qtyVal: {
    fontSize: 16,
    fontWeight: 'bold'
  },

  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE'
  },

  totalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },

  totalLabel: {
    fontSize: 16,
    color: '#666'
  },

  totalVal: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2D4628'
  },

  btnGroup: {
    flexDirection: 'row',
    gap: 10
  },

  btnAdd: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2D4628',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center'
  },

  btnAddText: {
    color: '#2D4628',
    fontWeight: 'bold'
  },

  btnPay: {
    flex: 1,
    backgroundColor: '#2D4628',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center'
  },

  btnPayText: {
    color: 'white',
    fontWeight: 'bold'
  }
});