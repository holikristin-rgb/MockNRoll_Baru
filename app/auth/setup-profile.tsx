import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function SetupProfileScreen() {
  const [image, setImage] = useState<string | null>(null);
  const { user, updateProfile } = useAuth(); 
  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      // Jika ada gambar, simpan. Jika tidak, tetap lanjutkan ke profil
      if (image && updateProfile) {
        await updateProfile({ ...user, profileImage: image });
      }
      router.replace('/profile');
    } catch (error) {
      Alert.alert("Gagal", "Tidak dapat menyimpan profil.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Halo, {user?.username}!</Text>
      <Text style={styles.subtitle}>Lengkapi profilmu dengan foto terbaik</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera" size={50} color="#C5A985" />
            <Text style={styles.placeholderText}>Tambah Foto</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>MULAI JAJAN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/profile')}>
        <Text style={styles.skipText}>Lewati Dulu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E2F22', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, color: '#C5A985', fontWeight: 'bold' },
  subtitle: { color: 'white', marginBottom: 30, textAlign: 'center' },
  imageContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#C5A985',
    overflow: 'hidden', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40
  },
  profileImage: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center' },
  placeholderText: { color: '#C5A985', marginTop: 10, fontWeight: 'bold' },
  button: { backgroundColor: '#C5A985', width: '100%', padding: 15, borderRadius: 10 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  skipText: { color: '#888', marginTop: 20 }
});