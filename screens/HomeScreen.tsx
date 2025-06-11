import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, Button, FlatList, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { Swipeable, TouchableOpacity } from 'react-native-gesture-handler';
import { Snackbar } from 'react-native-paper';
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



  useFocusEffect(
    useCallback(() => {
      const fetchItems = async () => {
        const savedItems = await loadItems();
        setItems(savedItems);
      };
      fetchItems();
    }, [])
  );


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
        setEditingItem(item);                 // Open modal
        setEditedTitle(item.title);
        setEditedLocation(item.location);
      }}
      activeOpacity={0.9}
    >
      <View style={styles.row}>
        <ItemCard item={item} />
      </View>
    </TouchableOpacity>
  </Swipeable>
);


const handleDelete = (id: string) => {
  const itemToDelete = items.find(i => i.id === id);
  if (!itemToDelete) return;

  Alert.alert(
    'Delete Item',
    'Are you sure you want to delete this item?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = items.filter(i => i.id !== id);
          setItems(updated);
          await saveItems(updated);

          // ✅ Show snackbar with undo
          setDeletedItem(itemToDelete);
          setSnackbarVisible(true);
        },
      },
    ]
  );
};



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
        data={items.filter((item) =>
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
                <Text style={styles.modalTitle}>Edit Item</Text>

                <View>
                    <Text style={styles.itemTitle}>Item Name</Text>
                    <TextInput
                        value={editedTitle}
                        onChangeText={setEditedTitle}
                        placeholder="Title"
                        style={styles.input}
                    />
                </View>
                <View>
                    <Text style={styles.itemTitle}>Loacation</Text>
                    <TextInput
                            value={editedLocation}
                            onChangeText={setEditedLocation}
                            placeholder="Location"
                            style={styles.input}
                        />
                </View>
                

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button title="Cancel" onPress={() => setEditingItem(null)} />
                    <Button
                    title="Save"
                    onPress={async () => {
                        const updatedItems = items.map(i =>
                        i.id === editingItem.id
                            ? { ...i, title: editedTitle, location: editedLocation }
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
    <View style={styles.snackbarWrapper}>
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
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  empty: { marginTop: 20, textAlign: 'center', color: '#888' },
  swipeWrapper: {
  borderRadius: 12,
  overflow: 'hidden',
  marginBottom: 12,
},
deleteBtn: {
  backgroundColor: '#ff3b30', // iOS Messages red
  justifyContent: 'center',
  alignItems: 'center',
  width: 80,
  alignSelf: 'stretch', // Match height of swipe container
},
deleteText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 16,
},
actionContainer: {
  flexDirection: 'row',
  alignSelf: 'stretch',
  height: '100%',
},

actionBtn: {
  width: 64,
  justifyContent: 'center',
  alignItems: 'center',
},
row: {
  height: 80,               // Fixed height (like iOS)
  backgroundColor: '#fff',
  justifyContent: 'center',
},
actionButton: {
  backgroundColor: '#ff3b30',
  width: 64,
  height: 80, // MUST match `.row` height
  justifyContent: 'center',
  alignItems: 'center',
},
separator: {
  height: 1,
  backgroundColor: '#e0e0e0',
  marginLeft: 80, // optional: align with text/image
},
modalBackdrop: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.3)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalBox: {
  width: '85%',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 20,
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
},
input: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 6,
  padding: 8,
  marginBottom: 12,
},
itemTitle: {
  fontSize: 12,
},
searchInput: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  marginBottom: 12,
},
searchWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  paddingHorizontal: 10,
  marginBottom: 12,
  backgroundColor: '#f9f9f9',
},
searchIcon: {
  marginRight: 6,
},
searchInputWithIcon: {
  flex: 1,
  height: 40,
  fontSize: 15,
  color: '#333',
},
snackbarWrapper: {
  position: 'absolute',
  bottom: 70, // Above bottom tab bar
  left: 16,
  right: 16,
  zIndex: 75,
},

snackbar: {
  borderRadius: 12,
  backgroundColor: '#333', // Optional: change to '#444' for better iOS feel
},

});
