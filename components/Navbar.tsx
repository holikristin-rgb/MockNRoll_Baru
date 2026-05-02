import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext'; // TAMBAHKAN INI
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const router = useRouter();
  const { user } = useAuth(); // AMBIL DATA USER
  
  const cartContext = useCart();
  const cart = cartContext?.cart || [];
  const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);

  // Logika: Jika sudah login ke profile, jika belum ke login
  const handleAuthPress = () => {
    if (user) {
      router.push('/(user)/profile');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <View style={styles.navContainer}>
      <View style={styles.leftLinks}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.linkText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(user)/about')}>
          <Text style={styles.linkText}>Our Story</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(user)/menu')}>
          <Text style={styles.linkText}>Shop</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoWrapper}>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.logoCircle}>
          <Image 
            source={require('../assets/images/logo-mocknrolls.png')} 
            style={styles.logoImage} 
            resizeMode="cover" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.rightIcons}>
        {/* LOGIKA TOMBOL LOGIN/PROFILE */}
        <TouchableOpacity style={styles.iconBtn} onPress={handleAuthPress}>
           <Ionicons name="person-circle-outline" size={24} color="#C5A985" />
           <Text style={styles.loginText}>{user ? 'Profile' : 'Log In'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/(user)/cart')}>
          <View>
            <Ionicons name="bag-outline" size={24} color="white" />
            {totalItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalItems}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ... styles tetap sama seperti kode kamu ...
const styles = StyleSheet.create({
  navContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#0E2F22', 
    height: 110, 
    paddingHorizontal: '5%',
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#B8860B',
    zIndex: 10,
  },
  leftLinks: { flexDirection: 'row', gap: 20, flex: 1 },
  linkText: { color: 'white', fontSize: 13, fontWeight: '600', textTransform: 'uppercase' },
  logoWrapper: { flex: 1, alignItems: 'center' },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#B8860B',
  },
  logoImage: { width: '100%', height: '100%' },
  rightIcons: { flexDirection: 'row', flex: 1, justifyContent: 'flex-end', alignItems: 'center', gap: 15 },
  iconBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  loginText: { color: 'white', fontSize: 13, fontWeight: '700' },
  cartBtn: { padding: 5 },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#A0522D',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white'
  },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' }
});