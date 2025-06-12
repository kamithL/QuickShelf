// src/screens/HomeScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
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
  const swipeableRefs = useRef<Record<string, Swipeable | null>>({});



  useFocusEffect(
    useCallback(() => {
      const fetchItems = async () => {
        const saved = await loadItems();
        setItems(saved);
      };
      fetchItems();
    }, [])
  );

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
    if (!result.canceled && result.assets?.[0]) {
      const manipulated = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setEditedImage(manipulated.uri);
    }
  };

  const handleDelete = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    Alert.alert('Delete Item', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = items.filter(i => i.id !== id);
          setItems(updated);
          await saveItems(updated);
          setDeletedItem(item);
          setSnackbarVisible(true);
        },
      },
    ]);
  };

  const handleEdit = (item: any) => {
      setEditingItem(item);
      setEditedTitle(item.title);
      setEditedLocation(item.location);
      setEditedImage(item.image || null);
  };

  const renderItem = ({ item }: { item: any }) => (
    <Swipeable
      ref={(ref) => {
        swipeableRefs.current[item.id] = ref;
      }}
      overshootRight={false}
      renderRightActions={() => (
      <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            style={[styles.actionButton, { backgroundColor: colors.info }]}
          >
            <Ionicons name="create-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={[styles.actionButton, { backgroundColor: colors.danger }]}
          >
            <Ionicons name="trash-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    >
      <TouchableOpacity
       onPress={() => {
          router.push({
            pathname: '/item-detail',
            params: {
              title: item.title,
              location: item.location,
              image: item.image,
            },
          });
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
          placeholderTextColor={colors.textSecondary}
          style={styles.searchInputWithIcon}
        />
      </View>

      {/* <FlatList
        key={items.length} 
        data={items.filter(i =>
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.location?.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No items added yet.</Text>}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      /> */}


        <DraggableFlatList
        data={items.filter(i =>
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.location?.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => {
          setItems(data);
          saveItems(data); // ✅ persist new order
        }}
        renderItem={({ item, drag, isActive }) => (
          <ScaleDecorator>
            <Swipeable
              renderRightActions={() => (
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() => handleEdit(item)}
                    style={[styles.actionButton, { backgroundColor: colors.info }]}
                  >
                    <Ionicons name="create-outline" size={24} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={[styles.actionButton, { backgroundColor: colors.danger }]}
                  >
                    <Ionicons name="trash-outline" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            >
              <TouchableOpacity
                onLongPress={drag} // 👈 Enable drag on long press
                delayLongPress={200}
                onPress={() => {
                  router.push({
                    pathname: '/item-detail',
                    params: {
                      title: item.title,
                      location: item.location,
                      image: item.image,
                    },
                  });
                }}
              >
                <View style={styles.row}>
                  <ItemCard item={item} />
                </View>
              </TouchableOpacity>
            </Swipeable>
          </ScaleDecorator>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />


      {/* Edit Modal */}
        <Modal visible={!!editingItem} animationType="slide" transparent>
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.modalBackdrop}
  >
    <View style={styles.modalBox}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[typography.heading, { marginBottom: 12 }]}>Edit Item</Text>

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

        <Text style={typography.label}>Item Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={editedTitle}
          onChangeText={setEditedTitle}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={typography.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={editedLocation}
          onChangeText={setEditedLocation}
          placeholderTextColor={colors.textSecondary}
        />

        <View style={styles.modalActions}>
          <Button title="Cancel" onPress={() => setEditingItem(null)} />
          <Button
            title="Save"
            onPress={async () => {
              const updated = items.map(i =>
                i.id === editingItem.id
                  ? { ...i, title: editedTitle, location: editedLocation, image: editedImage }
                  : i
              );
              setItems(updated);
              await saveItems(updated);
               if (editingItem?.id && swipeableRefs.current[editingItem.id]) {
                swipeableRefs.current[editingItem.id]?.close();
              }
              setEditingItem(null);
              setEditedTitle('');
              setEditedLocation('');
              setEditedImage(null);
            }}
          />
        </View>
      </ScrollView>
    </View>
  </KeyboardAvoidingView>
</Modal>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
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
  searchIcon: { marginRight: 6 },
  searchInputWithIcon: { flex: 1, height: 40, fontSize: 15, color: colors.textPrimary },
  row: { backgroundColor: colors.cardBackground },
  separator: { height: 1, backgroundColor: '#e0e0e0', marginLeft: 80 },
  actionButton: {
    backgroundColor: colors.danger,
    width: 64,
    justifyContent: 'center',
    alignItems: 'center',
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
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
});
