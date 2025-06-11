import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Snackbar } from 'react-native-paper';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import ItemCard from '../components/ItemCard';
import { loadItems, saveItems } from '../services/storage';

export default function HomeScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletedItem, setDeletedItem] = useState<any | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchItems = async () => {
        const savedItems = await loadItems();
        setItems(savedItems);
      };
      fetchItems();
    }, [])
  );

  const handleDelete = (id: string) => {
    const itemToDelete = items.find(i => i.id === id);
    if (!itemToDelete) return;

    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = items.filter(i => i.id !== id);
          setItems(updated);
          await saveItems(updated);
          setDeletedItem(itemToDelete);
          setSnackbarVisible(true);
        },
      },
    ]);
  };

  const pickImage = () => {
    Alert.alert('Select Image', 'Choose an option', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    handleImageResult(result);
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Gallery access is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    handleImageResult(result);
  };

  const handleImageResult = async (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const manipulated = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setEditedImage(manipulated.uri);
    }
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      onPress={() => handleDelete(id)}
      activeOpacity={0.8}
      style={styles.actionButton}
    >
      <Ionicons name="trash-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: any }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id)}
      overshootRight={false}
    >
      <TouchableOpacity
        onPress={() => {
          setEditingItem(item);
          setEditedTitle(item.title);
          setEditedLocation(item.location);
          setEditedImage(item.image || null);
        }}
      >
        <View style={styles.row}>
          <ItemCard item={item} />
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Inventory</Text>
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search items..."
          style={styles.searchInputWithIcon}
          placeholderTextColor="#aaa"
        />
      </View>

      <FlatList
        data={items.filter(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location?.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No items added yet.</Text>}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <Modal visible={!!editingItem} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={[typography.heading, { marginBottom: 12 }]}>Edit Item</Text>

            {/* Image */}
            <Text style={typography.label}>Image</Text>
            <View style={styles.imageWrapper}>
              {editedImage ? (
                <Image source={{ uri: editedImage }} style={styles.modalImage} />
              ) : (
                <View style={[styles.modalImage, styles.placeholder]}>
                  <Text style={typography.small}>No Image</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={editedImage ? () => setEditedImage(null) : pickImage}
                style={styles.imageOverlayButton}
              >
                <Ionicons
                  name={editedImage ? 'trash-outline' : 'camera-outline'}
                  size={18}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            {/* Title */}
            <Text style={typography.label}>Item Name</Text>
            <TextInput
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Title"
              style={styles.input}
              placeholderTextColor={colors.textSecondary}
            />

            {/* Location */}
            <Text style={typography.label}>Location</Text>
            <TextInput
              value={editedLocation}
              onChangeText={setEditedLocation}
              placeholder="Location"
              style={styles.input}
              placeholderTextColor={colors.textSecondary}
            />

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <Button title="Cancel" onPress={() => setEditingItem(null)} />
              <Button
                title="Save"
                onPress={async () => {
                  const updatedItems = items.map((i) =>
                    i.id === editingItem.id
                      ? { ...i, title: editedTitle, location: editedLocation, image: editedImage }
                      : i
                  );
                  setItems(updatedItems);
                  await saveItems(updatedItems);
                  setEditingItem(null);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>


      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={5000}
        action={{
          label: 'Undo',
          onPress: () => {
            if (deletedItem) {
              const updated = [...items, deletedItem];
              setItems(updated);
              saveItems(updated);
              setDeletedItem(null);
            }
          },
        }}
        style={styles.snackbar}
      >
        Item deleted
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  title: { ...typography.title, marginBottom: 12 },
  empty: { marginTop: 20, textAlign: 'center', color: colors.textSecondary },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInputWithIcon: {
    flex: 1,
    height: 40,
    fontSize: 15,
    color: colors.textPrimary,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginLeft: 80,
  },
  row: {
    height: 80,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: colors.danger,
    width: 64,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snackbar: {
    borderRadius: 12,
    backgroundColor: '#333',
    position: 'absolute',
    bottom: 70,
    left: 16,
    right: 16,
    zIndex: 75,
  },
  modalBackdrop: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.3)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalBox: {
  width: '90%',
  backgroundColor: colors.cardBackground,
  borderRadius: 12,
  padding: 20,
},
imageWrapper: {
  position: 'relative',
  width: 100,
  height: 100,
  marginBottom: 12,
  alignSelf: 'flex-start',
},
modalImage: {
  width: '100%',
  height: '100%',
  borderRadius: 10,
  backgroundColor: '#eee',
  borderWidth: 1,
  borderColor: '#ccc',
},
imageOverlayButton: {
  position: 'absolute',
  top: 6,
  right: 6,
  backgroundColor: 'rgba(0,0,0,0.6)',
  padding: 8,
  borderRadius: 16,
  zIndex: 10,
  elevation: 4,
},
input: {
  borderWidth: 1,
  borderColor: colors.inputBorder || '#ccc',
  borderRadius: 8,
  paddingVertical: 10,
  paddingHorizontal: 12,
  fontSize: 15,
  color: colors.textPrimary,
  backgroundColor: colors.inputBackground,
  marginBottom: 12,
},
placeholder: {
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#eee',
  borderRadius: 8,
  width: 100,
  height: 100,
},

});
