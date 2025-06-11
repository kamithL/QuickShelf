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
import { loadItems, saveItems } from '../services/storage';

export default function AddItemScreen({ navigation }: any) {
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
     // ✅ Clear form
    setTitle('');
    setLocation('');
    setImage(null);

    // ✅ Navigate back
    router.replace('/'); // or navigation.goBack()
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add New Item</Text>

      <View style={styles.imageWrapper}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}

        <TouchableOpacity onPress={handleImageSelect } style={styles.iconButton}>
          <Ionicons name="camera-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Item Name"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Location"
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />
     <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Add Item</Text>
     </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
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
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  placeholderText: {
    color: '#888',
    fontSize: 12,
  },
  iconButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 16,
  },
  addButton: {
  backgroundColor: '#007AFF',
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
