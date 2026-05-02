import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  // 1. Ambil semua fungsi yang diperlukan dari context
  const { getOrders, getMenus, getAllUsers, saveMenu, deleteMenu } = useAuth();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuPrice, setNewMenuPrice] = useState('');

  const refreshData = async () => {
    const o = await getOrders();
    const m = await getMenus();
    const u = await getAllUsers();
    setOrders(o);
    setMenus(m);
    setUsers(u);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // 2. Fungsi untuk Menghapus Menu
  const handleDelete = async (id: string) => {
    Alert.alert(
      "Hapus Menu",
      "Apakah kamu yakin ingin menghapus menu ini?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus", 
          style: "destructive", 
          onPress: async () => {
            const success = await deleteMenu(id);
            if (success) refreshData();
          } 
        }
      ]
    );
  };

  const handleAddMenu = async () => {
    if (!newMenuName || !newMenuPrice) return Alert.alert("Error", "Isi semua data menu!");
    
    const success = await saveMenu({ name: newMenuName, price: newMenuPrice });
    if (success) {
      setModalVisible(false);
      setNewMenuName('');
      setNewMenuPrice('');
      refreshData();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Admin Control Center</Text>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{users.length}</Text>
          <Text style={styles.statLabel}>Users</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{orders.length}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{menus.length}</Text>
          <Text style={styles.statLabel}>Menus</Text>
        </View>
      </View>

      {/* Menu Management Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Manajemen Menu</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle" size={20} color="white" />
            <Text style={{color: 'white', fontWeight: 'bold', marginLeft: 5}}>Tambah Menu</Text>
          </TouchableOpacity>
        </View>
        
        {menus.length === 0 ? (
          <Text style={styles.emptyText}>Belum ada menu. Klik tambah untuk mengisi.</Text>
        ) : (
          menus.map((item) => (
            <View key={item.id} style={styles.card}>
              <View>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSub}>Rp {Number(item.price).toLocaleString('id-ID')}</Text>
              </View>
              {/* Tombol Hapus */}
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash-outline" size={22} color="#E74C3C" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* User Management Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daftar Pengguna Terdaftar</Text>
        {users.map((u, index) => (
          <View key={index} style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{u.username}</Text>
              <Text style={styles.cardSub}>{u.email}</Text>
            </View>
            <Text style={styles.roleBadge}>{u.role}</Text>
          </View>
        ))}
      </View>

      {/* MODAL TAMBAH MENU */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tambah Menu Baru</Text>
            <TextInput 
              placeholder="Nama Menu" 
              style={styles.input} 
              value={newMenuName}
              onChangeText={setNewMenuName}
            />
            <TextInput 
              placeholder="Harga (Angka saja)" 
              style={styles.input} 
              value={newMenuPrice}
              onChangeText={setNewMenuPrice}
              keyboardType="numeric"
            />
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity style={[styles.modalBtn, {backgroundColor: '#888'}]} onPress={() => setModalVisible(false)}>
                <Text style={{color: 'white'}}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} onPress={handleAddMenu}>
                <Text style={{color: 'white'}}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E2F22', padding: 20 },
  headerTitle: { fontSize: 28, color: '#C5A985', fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statBox: { backgroundColor: '#1A4D3B', padding: 15, borderRadius: 12, width: '31%', alignItems: 'center', borderWidth: 1, borderColor: '#C5A985' },
  statNum: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: '#C5A985', fontSize: 12 },
  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  addButton: { backgroundColor: '#C5A985', flexDirection: 'row', padding: 10, borderRadius: 8, alignItems: 'center' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontWeight: 'bold', fontSize: 16, color: '#0E2F22' },
  cardSub: { color: '#666' },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 10 },
  roleBadge: { backgroundColor: '#C5A985', color: 'white', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15, fontSize: 11, overflow: 'hidden' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 15, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15 },
  modalBtn: { padding: 12, borderRadius: 8, backgroundColor: '#0E2F22', width: '48%', alignItems: 'center' }
});