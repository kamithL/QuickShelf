import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface Item {
  id: string;
  title: string;
  location?: string;
  image?: string;
}

export default function ItemCard({ item }: { item: Item }) {
  return (
    <View style={styles.card}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        {item.location && (
          <Text style={styles.location}>📦 {item.location}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    flex: 1,           // Fill the row
    height: '100%',    // Stretch with parent
    backgroundColor: 'transparent', // optional
    borderWidth:1,
    borderColor: '#ddd',
   
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  placeholder: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  placeholderText: {
    fontSize: 11,
    color: '#999',
  },
  details: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 17,
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
});
