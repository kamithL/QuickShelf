// services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'QUICKSHELF_ITEMS';

export const saveItems = async (items: any[]) => {
  try {
    const json = JSON.stringify(items);
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch (e) {
    console.error('Failed to save items', e);
  }
};

export const loadItems = async (): Promise<any[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Failed to load items', e);
    return [];
  }
};
