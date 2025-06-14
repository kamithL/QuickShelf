// src/screens/AddItemScreen.tsx

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const items = await loadItems();
      const locations = Array.from(new Set(items.map(i => i.location).filter(Boolean)));
      const categories = Array.from(new Set(items.map(i => i.category).filter(Boolean)));
      setLocationSuggestions(locations);
      setCategorySuggestions(categories);
    };
    fetchSuggestions();
  }, []);


  const filteredLocationSuggestions = locationSuggestions.filter(loc =>
    loc.toLowerCase().includes(location.toLowerCase())
  );

  const filteredCategorySuggestions = categorySuggestions.filter(cat =>
    cat.toLowerCase().includes(category.toLowerCase())
  );

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
    if (!title.trim() || !location.trim() || !category.trim()) {
      setShowErrors(true);
      return;
    }

    const newItem = {
      id: uuid.v4().toString(),
      title,
      location,
      category,
      image,
    };

    const existing = await loadItems();
    const updated = [...existing, newItem];
    await saveItems(updated);

    setTitle('');
    setLocation('');
    setCategory('');
    setImage(null);
    setShowErrors(false);
    router.replace('/');
  };

  return (
  <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
>
  <ScrollView
    contentContainerStyle={styles.container}
    keyboardShouldPersistTaps="handled"
  >
    <Text style={styles.heading}>Add New Item</Text>

    {/* Image Picker Section */}
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

    {/* Form Fields */}
    <View style={{ gap: 16 }}>
      <Input
        placeholder="Item Name"
        value={title}
        onChangeText={setTitle}
        error={showErrors && !title ? 'Title Required' : ''}
      />

      {/* Location Input with Dropdown */}
      <View style={{ position: 'relative' }}>
        <Input
          placeholder="Location"
          value={location}
          onChangeText={(text) => {
            setLocation(text);
            setShowLocationDropdown(true);
          }}
          onFocus={() => setShowLocationDropdown(true)}
          error={showErrors && !location ? 'Location Required' : ''}
          rightIcon={
            <Ionicons
              name={showLocationDropdown ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#888"
            />
          }
        />

        {showLocationDropdown && filteredLocationSuggestions.length > 0 && (
          <View style={styles.dropdown}>
            {filteredLocationSuggestions.map((loc) => (
              <TouchableOpacity
                key={loc}
                onPress={() => {
                  setLocation(loc);
                  setShowLocationDropdown(false);
                }}
                style={styles.dropdownItem}
              >
                <Text>{loc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Category Input with Dropdown */}
      <View style={{ position: 'relative' }}>
        <Input
          placeholder="Category"
          value={category}
          onChangeText={(text) => {
            setCategory(text);
            setShowCategoryDropdown(true);
          }}
          onFocus={() => setShowCategoryDropdown(true)}
          error={showErrors && !category ? 'Category Required' : ''}
          rightIcon={
            <Ionicons
              name={showCategoryDropdown ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#888"
            />
          }
        />

        {showCategoryDropdown && filteredCategorySuggestions.length > 0 && (
          <View style={styles.dropdown}>
            {filteredCategorySuggestions.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => {
                  setCategory(cat);
                  setShowCategoryDropdown(false);
                }}
                style={styles.dropdownItem}
              >
                <Text>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>

    <View style={{ marginTop: 24 }}>
      <Button label="Add Item" onPress={handleAdd} />
    </View>
  </ScrollView>
</KeyboardAvoidingView>

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
  dropdown: {
    position: 'absolute',
    top: 50, // height of the input
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 4,
    maxHeight: 150,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
