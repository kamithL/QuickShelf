// src/screens/HomeScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Snackbar } from 'react-native-paper';

import { useTheme } from '@/theme/ThemeContext';
import { useTypography } from '@/theme/typography';
import { loadItems, saveItems } from '../services/storage';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const typo = useTypography();

  // state
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [activeLoc, setActiveLoc] = useState<string>('All');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [deletedItem, setDeletedItem] = useState<any | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const swipeableRefs = useRef<Record<string, Swipeable | null>>({});

  // load on focus
  useFocusEffect(useCallback(() => {
    (async () => {
      const data = await loadItems();
      setItems(data);
    })();
  }, []));

  // chip list
  const uniqueLocs = ['All', ...Array.from(new Set(items.map(i => i.location).filter(Boolean)))];

  // filters
  const bySearch = items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.location?.toLowerCase().includes(search.toLowerCase())
  );
  const byLocation = activeLoc === 'All'
    ? bySearch
    : bySearch.filter(i => i.location === activeLoc);

  // image pickers
  const pickImage = () => Alert.alert('Select Image', 'Choose an option', [
    { text: 'Camera', onPress: openCamera },
    { text: 'Gallery', onPress: openGallery },
    { text: 'Cancel', style: 'cancel' },
  ]);
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission Denied');
    const res = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 });
    handleImageResult(res);
  };
  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission Denied');
    const res = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.7 });
    handleImageResult(res);
  };
  const handleImageResult = async (res: any) => {
    if (!res.canceled && res.assets?.[0]) {
      const m = await ImageManipulator.manipulateAsync(
        res.assets[0].uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setEditedImage(m.uri);
    }
  };

  // delete/edit handlers
  const handleDelete = (item: any) => {
    Alert.alert('Delete Item', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const upd = items.filter(i => i.id !== item.id);
          setItems(upd);
          await saveItems(upd);
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
  const onSaveEditedItem = async () => {
    const upd = items.map(i =>
      i.id === editingItem.id
        ? { ...i, title: editedTitle, location: editedLocation, image: editedImage }
        : i
    );
    setItems(upd);
    await saveItems(upd);
    swipeableRefs.current[editingItem.id]?.close();
    setEditingItem(null);
    setEditedTitle('');
    setEditedLocation('');
    setEditedImage(null);
  };

  // render helpers
  const renderChip = (loc: string) => {
    const isSelected = loc === activeLoc;
    return (
      <TouchableOpacity
        key={loc}
        onPress={() => setActiveLoc(loc)}
        style={[
          styles.chip,
          { backgroundColor: isSelected ? colors.primary : colors.cardBackground },
        ]}
      >
        <Text style={[typo.label, { color: isSelected ? '#fff' : colors.textSecondary }]}>
          {loc}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <Swipeable
      ref={ref => { swipeableRefs.current[item.id] = ref; }}
      overshootRight={false}
      renderRightActions={() => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            style={[styles.actionButton, { backgroundColor: colors.info }]}
          >
            <Ionicons name="create-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            style={[styles.actionButton, { backgroundColor: colors.danger }]}
          >
            <Ionicons name="trash-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      )}
    >
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.cardBackground }]}
        onPress={() => router.push({ pathname: '/item-detail', params: { id: item.id } })}
      >
        <View style={[styles.thumb, { backgroundColor: colors.inputBackground }]}>
          {item.image
            ? <Image source={{ uri: item.image }} style={styles.image} />
            : <Text style={[typo.small, { color: colors.textSecondary }]}>No Image</Text>}
        </View>
        <View style={styles.info}>
          <Text style={[typo.title, { color: colors.textPrimary }]} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons name="cube-outline" size={14} color={colors.textSecondary} />
            <Text style={[typo.small, { color: colors.textSecondary, marginLeft: 4 }]}>
              {item.category || '—'}
            </Text>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.textSecondary}
              style={{ marginLeft: 12 }}
            />
            <Text style={[typo.small, { color: colors.textSecondary, marginLeft: 4 }]}>
              {item.location || '—'}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[typo.heading, styles.heading, { color: colors.textPrimary }]}>
        My Inventory
      </Text>

      <View style={[styles.searchBox, { backgroundColor: colors.inputBackground }]}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          value={search}
          onChangeText={setSearch}
          placeholder="Search items..."
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.chipContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={uniqueLocs}
          renderItem={({ item }) => renderChip(item)}
          keyExtractor={l => l}
        />
      </View>

      <FlatList
        data={byLocation}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Edit Modal */}
      <Modal visible={!!editingItem} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContainer, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <TouchableOpacity onPress={() => setEditingItem(null)}>
                <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Edit Item
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView
              style={styles.modalContent}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View style={styles.imageWrapper}>
                {editedImage ? (
                  <>
                    <Image source={{ uri: editedImage }} style={styles.modalImage} />
                    <TouchableOpacity
                      onPress={pickImage}
                      style={[styles.imageEditButton, { backgroundColor: colors.primary }]}
                    >
                      <Ionicons name="create-outline" size={20} color={colors.background} />
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={[styles.modalPlaceholder, {
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                    }]}
                    onPress={pickImage}
                  >
                    <Ionicons name="camera-outline" size={32} color={colors.textSecondary} />
                    <Text style={[typo.small, { color: colors.textSecondary, marginTop: 8 }]}>
                      No Image
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={[typo.label, { color: colors.textSecondary }]}>Item Name</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.textPrimary,
                }]}
                value={editedTitle}
                onChangeText={setEditedTitle}
                placeholder="Enter name"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={[typo.label, { color: colors.textSecondary }]}>Location</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.textPrimary,
                }]}
                value={editedLocation}
                onChangeText={setEditedLocation}
                placeholder="Enter location"
                placeholderTextColor={colors.textSecondary}
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setEditingItem(null)} />
              <Button title="Save" onPress={onSaveEditedItem} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'Undo',
          onPress: () => {
            if (deletedItem) {
              setItems(prev => [...prev, deletedItem]);
              saveItems([...items, deletedItem]);
              setDeletedItem(null);
            }
          },
        }}
      >
        Item deleted
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 28, marginBottom: 16 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 44,
    marginBottom: 16,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  chipContainer: { marginBottom: 16 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    width: width - 40,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  info: { flex: 1, marginLeft: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  actionButton: {
    width: 64,
    justifyContent: 'center',
    alignItems: 'center',
    height: 85,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    flexGrow: 0,
    width: '100%',
    marginTop: 10,
  },
  imageWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  modalPlaceholder: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageEditButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    padding: 6,
    borderRadius: 12,
    zIndex: 2,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    width: '100%',
  },
});
