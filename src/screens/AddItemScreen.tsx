// src/screens/AddItemScreen.tsx
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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
  // now pass both colors & typo into your dynamic stylesheet
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

  const handleImageSelect = () =>
    Alert.alert('Select Image', 'Choose a source', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true });
    if (!result.canceled) setImage(result.assets[0].uri);
  };
  const openGallery = async () => {
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
    setTitle(''); setLocation(''); setCategory(''); setImage(null); setShowErrors(false);
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
          {/* ... */}
        </View>

        <View style={{ gap: 16 }}>
          <Input
            placeholder="Item Name"
            value={title}
            onChangeText={setTitle}
            error={showErrors && !title ? 'Title Required' : ''}
          />

                 <View style={styles.relative}>
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
                  color={colors.textSecondary}
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
                    <Text style={styles.dropdownText}>{loc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.relative}>
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
                  color={colors.textSecondary}
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

// 🧠 StyleSheet factory now takes both colors & typography
const getStyles = (colors: ReturnType<typeof useTheme>['colors'], typo: ReturnType<typeof useTypography>) =>
  StyleSheet.create({
    flex: { flex: 1 },
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    heading: {
      ...typo.heading,           // now available
      marginBottom: 20,
      color: colors.textPrimary,
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
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#ccc',
      borderWidth: 1,
      backgroundColor: colors.inputBackground,
    },
    placeholderText: {
      ...typo.small,            // and here
      color: colors.textSecondary,
    },
    iconButton: {
      position: 'absolute',
      top: 6,
      right: 6,
      backgroundColor: 'rgba(0,0,0,0.6)',
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
    dropdownText: {
      color: colors.textPrimary,
    },
    addButtonWrapper: {
      marginTop: 24,
    },
  });