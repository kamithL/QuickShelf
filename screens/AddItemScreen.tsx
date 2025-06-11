// screens/AddItemScreen.tsx
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import uuid from 'react-native-uuid';

import { loadItems, saveItems } from '../services/storage';

export default function AddItemScreen() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<string | null>(null);


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAdd = async () => {


    
    if (!title) {
      Alert.alert('Missing Title', 'Please enter a name for the item.');
      return;
    }



    const existing = await loadItems();
   
    const newItem = {
      id: uuid.v4(),
      title,
      location,
      image,
    };
    
    console.log(existing,newItem);
    await saveItems([...existing, newItem]);
    // Clear form
    setTitle('');
    setLocation('');
    setImage(null);
    router.replace('/'); // go back to Home
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Item Name</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="e.g. Headphones" />

      <Text style={styles.label}>Location</Text>
      <TextInput value={location} onChangeText={setLocation} style={styles.input} placeholder="e.g. Box A" />

      <Button title="Pick an Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <View style={{ marginTop: 20 }}>
        <Button title="Add Item" onPress={handleAdd} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginTop: 5 },
  image: { width: 100, height: 100, marginTop: 10, borderRadius: 8 },
});
