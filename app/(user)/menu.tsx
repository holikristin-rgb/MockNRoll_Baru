import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import { useCart } from '../../context/CartContext';

const MENU_DATA = [
  { id: '1', name: 'Risol Matcha', price: 4000, image: require('../../assets/images/risol-matcha.png') },
  { id: '2', name: 'Risol Coklat', price: 4000, image: require('../../assets/images/risol-coklat.png') },
  { id: '3', name: 'Risol Bolognese', price: 4000, image: require('../../assets/images/risol-bolognese.png') },
  { id: '4', name: 'Blueberry Yakult', price: 10000, image: require('../../assets/images/mocktail-blueberry.png') },
  { id: '5', name: 'Strawberry Fresh', price: 10000, image: require('../../assets/images/mocktail-strawberry.png') },
];

export default function Shop() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const {
    cart,
    addToCart,
    removeFromCart,
    buyNow
  } = useCart();

  const columns = width > 1024 ? 4 : width > 720 ? 3 : 2;
  const cardWidth = (width - (40 + (columns - 1) * 15)) / columns;

  const getItemQty = (id: string) => {
    const item = cart?.find((c: any) => c.id === id);
    return item ? item.quantity : 0;
  };

  const totalItems = cart.reduce(
    (total: number, item: any) => total + item.quantity,
    0
  );

  const handleBuyNow = (item: any) => {
    buyNow(item);
    router.push('/(user)/checkout');
  };

  const renderItem = ({ item }: any) => {
    const qty = getItemQty(item.id);

    return (
      <View style={[styles.card, { width: cardWidth }]}>
        <View style={styles.imageWrapper}>
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.nameText}>
            {item.name}
          </Text>

          <Text style={styles.priceText}>
            Rp {item.price.toLocaleString('id-ID')}
          </Text>

          {/* Quantity */}
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => removeFromCart(item.id)}
              disabled={qty === 0}
            >
              <Ionicons
                name="remove"
                size={16}
                color={qty > 0 ? '#2D4628' : '#CCC'}
              />
            </TouchableOpacity>

            <Text style={styles.qtyNumber}>
              {qty}
            </Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => addToCart(item)}
            >
              <Ionicons
                name="add"
                size={16}
                color="#2D4628"
              />
            </TouchableOpacity>
          </View>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => addToCart(item)}
            >
              <Ionicons
                name="cart-outline"
                size={16}
                color="#2D4628"
              />
              <Text style={styles.cartButtonText}>
                Keranjang
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => handleBuyNow(item)}
            >
              <Text style={styles.buyButtonText}>
                Beli Sekarang
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>
          Our Special Menu
        </Text>

        <Text style={styles.headerSub}>
          PILIH MENU MOCK'N'ROLLS
        </Text>
      </View>

      <FlatList
        key={`list-${columns}`}
        data={MENU_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />

      {/* Floating Cart */}
      <TouchableOpacity
        style={styles.floatingCart}
        onPress={() => router.push('/(user)/cart')}
      >
        <Ionicons
          name="cart"
          size={24}
          color="white"
        />

        <Text style={styles.cartLabel}>
          Keranjang
        </Text>

        {totalItems > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {totalItems}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD'
  },

  headerSection: {
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 15
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2D4628'
  },

  headerSub: {
    fontSize: 12,
    color: '#A0522D',
    fontWeight: '700',
    letterSpacing: 1
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120
  },

  row: {
    justifyContent: 'flex-start',
    gap: 15
  },

  card: {
    backgroundColor: 'white',
    marginBottom: 20,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    elevation: 2
  },

  imageWrapper: {
    width: '100%',
    height: 110,
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },

  image: {
    width: '85%',
    height: '85%'
  },

  info: {
    alignItems: 'center'
  },

  nameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2D4628'
  },

  priceText: {
    fontSize: 13,
    color: '#2D4628',
    fontWeight: '600'
  },

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginVertical: 10,
    gap: 10
  },

  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },

  qtyNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D4628'
  },

  actionRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%'
  },

  cartButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2D4628',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5
  },

  cartButtonText: {
    color: '#2D4628',
    fontWeight: 'bold',
    fontSize: 12
  },

  buyButton: {
    flex: 1,
    backgroundColor: '#A0522D',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center'
  },

  buyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
  },

  floatingCart: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    backgroundColor: '#2D4628',
    paddingHorizontal: 20,
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 10
  },

  cartLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },

  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#A0522D',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },

  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold'
  }
});