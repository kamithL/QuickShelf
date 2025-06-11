import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import uuid from 'react-native-uuid';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import Button from '../components/Button';
import Input from '../components/Input';
import { loadItems, saveItems } from '../services/storage';

export default function AddItemScreen() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);

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
    
    if (!title.trim() || !location.trim()) {
       setShowErrors(true);
      // Alert.alert('Validation', 'Please enter a title.');
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

    setTitle('');
    setLocation('');
    setImage(null);
     setShowErrors(false);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add New Item</Text>

      <View style={styles.imageWrapper}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={typography.small}>No Image</Text>
          </View>
        )}
        <TouchableOpacity onPress={handleImageSelect} style={styles.iconButton}>
          <Ionicons name="camera-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={{ gap: 16 }}>
        <Input placeholder="Item Name" value={title} onChangeText={setTitle}    error={showErrors && !title ? 'Title Required' : ''} />
        <Input placeholder="Location" value={location} onChangeText={setLocation}  error={showErrors && !location ? 'Location Required' : ''} />
      </View>


      <Button label="Add Item" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  heading: { ...typography.heading, marginBottom: 20 },
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
  iconButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 16,
  },
});
