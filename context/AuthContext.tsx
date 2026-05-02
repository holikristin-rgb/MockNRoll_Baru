import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- FUNGSI MIGRASI OTOMATIS ---
  const migrateMenus = async () => {
    try {
      const existing = await AsyncStorage.getItem('appMenus');
      if (!existing) {
        const defaultMenus = [
          { id: '1', name: 'Risol Matcha', price: 4000 },
          { id: '2', name: 'Risol Coklat', price: 4000 },
          { id: '3', name: 'Risol Bolognese', price: 4000 },
          { id: '4', name: 'Blueberry Yakult', price: 10000 },
          { id: '5', name: 'Strawberry Fresh', price: 10000 },
        ];
        await AsyncStorage.setItem('appMenus', JSON.stringify(defaultMenus));
        console.log("Migrasi menu berhasil!");
      }
    } catch (e) {
      console.error("Gagal migrasi:", e);
    }
  };

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        await migrateMenus();
        const savedUser = await AsyncStorage.getItem('activeUser');
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Gagal mengambil session:", e);
      } finally {
        setLoading(false);
      }
    };
    loadStoredData();
  }, []);

  // --- FUNGSI AUTH ---
  const register = async (userData: any) => {
    try {
      const existingUsers = await AsyncStorage.getItem('registeredUsers');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      users.push(userData);
      await AsyncStorage.setItem('registeredUsers', JSON.stringify(users));
      return true;
    } catch (e) { return false; }
  };

  const login = async (identifier: string, pass: string) => {
    try {
      const existingUsers = await AsyncStorage.getItem('registeredUsers');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      const foundUser = users.find(
        (u: any) => (u.username === identifier || u.email === identifier) && u.password === pass
      );
      if (foundUser) {
        setUser(foundUser);
        await AsyncStorage.setItem('activeUser', JSON.stringify(foundUser));
        return { success: true, role: foundUser.role }; 
      }
      return { success: false, message: "Username atau Password salah!" };
    } catch (e) { return { success: false, message: "Kesalahan sistem." }; }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('activeUser');
  };

  // [TAMBAHAN BARU] Fungsi Update Profile agar Foto Tersimpan
  const updateProfile = async (updatedUserData: any) => {
    try {
      // 1. Simpan ke State (Agar UI langsung update)
      setUser(updatedUserData);
      
      // 2. Simpan ke Session Aktif
      await AsyncStorage.setItem('activeUser', JSON.stringify(updatedUserData));
      
      // 3. Update di Database User Terdaftar
      const existingUsers = await AsyncStorage.getItem('registeredUsers');
      if (existingUsers) {
        const users = JSON.parse(existingUsers);
        const userIndex = users.findIndex((u: any) => u.email === updatedUserData.email);
        if (userIndex !== -1) {
          users[userIndex] = updatedUserData;
          await AsyncStorage.setItem('registeredUsers', JSON.stringify(users));
        }
      }
      return true;
    } catch (e) {
      console.error("Gagal update profil:", e);
      return false;
    }
  };

  const getAllUsers = async () => {
    const data = await AsyncStorage.getItem('registeredUsers');
    return data ? JSON.parse(data) : [];
  };

  // --- FUNGSI MANAJEMEN MENU ---
  const getMenus = async () => {
    const data = await AsyncStorage.getItem('appMenus');
    return data ? JSON.parse(data) : [];
  };

  const saveMenu = async (newMenu: any) => {
    const existing = await getMenus();
    const updated = [...existing, { ...newMenu, id: Date.now().toString() }];
    await AsyncStorage.setItem('appMenus', JSON.stringify(updated));
    return true;
  };

  const deleteMenu = async (menuId: string) => {
    const existing = await getMenus();
    const updated = existing.filter((m: any) => m.id !== menuId);
    await AsyncStorage.setItem('appMenus', JSON.stringify(updated));
    return true;
  };

  // --- FUNGSI ORDERS ---
  const getOrders = async () => {
    const data = await AsyncStorage.getItem('appOrders');
    return data ? JSON.parse(data) : [];
  };

  const addOrder = async (orderData: any) => {
    const existing = await getOrders();
    const updated = [...existing, { ...orderData, id: Date.now().toString(), status: 'Pending' }];
    await AsyncStorage.setItem('appOrders', JSON.stringify(updated));
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, register, getAllUsers, 
      updateProfile, // PENTING: Harus ada di sini agar bisa dipanggil file lain
      getMenus, saveMenu, deleteMenu, 
      getOrders, addOrder, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);