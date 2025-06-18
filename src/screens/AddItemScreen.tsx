// src/screens/AddItemScreen.tsx
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import uuid from 'react-native-uuid';

import { useTheme } from '@/theme/ThemeContext';
import { useTypography } from '@/theme/typography';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import Input from '../components/Input';
import { loadItems, saveItems } from '../services/storage';

export default function AddItemScreen() {
  const { colors } = useTheme();
  const typo = useTypography();
  const styles = getStyles(colors, typo);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // reset dropdowns on focus
  useFocusEffect(useCallback(() => {
    setShowLocationDropdown(false);
    setShowCategoryDropdown(false);
  }, []));

  useEffect(() => {
    (async () => {
      const items = await loadItems();
      setLocationSuggestions(
        Array.from(new Set(items.map(i => i.location).filter(Boolean)))
      );
      setCategorySuggestions(
        Array.from(new Set(items.map(i => i.category).filter(Boolean)))
      );
    })();
  }, []);

  const filteredLocationSuggestions = locationSuggestions.filter(loc =>
    loc.toLowerCase().includes(location.toLowerCase())
  );
  const filteredCategorySuggestions = categorySuggestions.filter(cat =>
    cat.toLowerCase().includes(category.toLowerCase())
  );

  const pickImage = () =>
    Alert.alert('Select Image', 'Choose a source', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  const openCamera = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission required', 'Camera access is needed to take photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true });
    if (!result.canceled) setImage(result.assets[0].uri);
  };
  const openGallery = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission required', 'Media library access is needed to select photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsEditing: true });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleAdd = async () => {
    if (!title.trim() || !location.trim() || !category.trim()) {
      setShowErrors(true);
      return;
    }
    const newItem = { id: uuid.v4().toString(), title, location, category, image };
    const existing = await loadItems();
    await saveItems([...existing, newItem]);

    // reset form
    setTitle(''); 
    setLocation(''); 
    setCategory(''); 
    setImage(null); 
    setShowErrors(false);
    setShowLocationDropdown(false);
    setShowCategoryDropdown(false);

    router.replace('/');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Add New Item</Text>

        {/* Image Picker */}
        <View style={styles.imageWrapper}>
          {image ? (
            <>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TouchableOpacity onPress={pickImage} style={[styles.iconButton, { backgroundColor: colors.primary }]}>
                <Ionicons name="create-outline" size={20} color={colors.background} />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={pickImage} style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={32} color={colors.textSecondary} />
              <Text style={styles.placeholderText}>No Image</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ gap: 16 }}>
          <Input
            placeholder="Item Name"
            value={title}
            onChangeText={setTitle}
            error={showErrors && !title ? 'Title Required' : ''}
          />

          {/* Location with dropdown */}
          <View style={styles.relative}>
            <Input
              placeholder="Location"
              value={location}
              onChangeText={text => {
                setLocation(text);
                setShowLocationDropdown(true);
              }}
              onFocus={() => setShowLocationDropdown(true)}
              error={showErrors && !location ? 'Location Required' : ''}
              rightIcon={
                <Ionicons
                  name={showLocationDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.textSecondary}
                />
              }
            />
            {showLocationDropdown && filteredLocationSuggestions.length > 0 && (
              <View style={styles.dropdown}>
                {filteredLocationSuggestions.map(loc => (
                  <TouchableOpacity
                    key={loc}
                    onPress={() => {
                      setLocation(loc);
                      setShowLocationDropdown(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={styles.dropdownText}>{loc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Category with dropdown */}
          <View style={styles.relative}>
            <Input
              placeholder="Category"
              value={category}
              onChangeText={text => {
                setCategory(text);
                setShowCategoryDropdown(true);
              }}
              onFocus={() => setShowCategoryDropdown(true)}
              error={showErrors && !category ? 'Category Required' : ''}
              rightIcon={
                <Ionicons
                  name={showCategoryDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.textSecondary}
                />
              }
            />
            {showCategoryDropdown && filteredCategorySuggestions.length > 0 && (
              <View style={styles.dropdown}>
                {filteredCategorySuggestions.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => {
                      setCategory(cat);
                      setShowCategoryDropdown(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={styles.dropdownText}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.addButtonWrapper}>
          <Button label="Add Item" onPress={handleAdd} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors: ReturnType<typeof useTheme>['colors'], typo: ReturnType<typeof useTypography>) =>
  StyleSheet.create({
    flex: { flex: 1 },
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    heading: {
      ...typo.heading,
      marginBottom: 20,
      color: colors.textPrimary,
    },
    imageWrapper: {
      position: 'relative',
      width: 120,
      height: 120,
      alignSelf: 'center',
      marginBottom: 20,
    },
    imagePreview: {
      width: '100%',
      height: '100%',
      borderRadius: 12,
    },
    imagePlaceholder: {
      flex: 1,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.inputBackground,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      ...typo.small,
      color: colors.textSecondary,
      marginTop: 8,
    },
    iconButton: {
      position: 'absolute',
      top: 6,
      right: 6,
      padding: 6,
      borderRadius: 16,
    },
    relative: { position: 'relative' },
    dropdown: {
      position: 'absolute',
      top: 50,
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: colors.cardBackground,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
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
    dropdownText: {
      color: colors.textPrimary,
    },
    addButtonWrapper: {
      marginTop: 24,
    },
  });
