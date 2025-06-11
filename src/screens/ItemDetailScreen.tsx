import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import uuid from 'react-native-uuid';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { loadItems, saveItems } from '../services/storage';

export default function AddItemScreen() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleImageSelect = () => {
    Alert.alert('Select Image', 'Choose a source', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsEditing: true,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAdd = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter a title.');
      return;
    }

    const newItem = {
      id: uuid.v4().toString(),
      title,
      location,
      image,
    };

    const existing = await loadItems();
    const updated = [...existing, newItem];
    await saveItems(updated);

    // ✅ Reset form
    setTitle('');
    setLocation('');
    setImage(null);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add New Item</Text>

      {/* Image Picker */}
      <View style={styles.imageWrapper}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <View style={[styles.imagePreview, styles.placeholder]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}

        <TouchableOpacity onPress={handleImageSelect} style={styles.imageOverlayButton}>
          <Ionicons name="camera-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Title Input */}
      <Text style={typography.label}>Item Name</Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholderTextColor={colors.textSecondary}
      />

      {/* Location Input */}
      <Text style={typography.label}>Location</Text>
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
        placeholderTextColor={colors.textSecondary}
      />

      {/* Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  heading: { ...typography.title, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder || '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.inputBackground,
    marginBottom: 16,
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#eee',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  imageOverlayButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 16,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
