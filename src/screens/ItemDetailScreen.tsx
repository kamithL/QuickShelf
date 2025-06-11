// components/ItemCard.tsx
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function ItemCard({ item }: { item: any }) {
  return (
    <View style={styles.card}>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        {item.location ? <Text style={styles.location}>📦 {item.location}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', marginBottom: 12, backgroundColor: '#f2f2f2', borderRadius: 10, padding: 10 },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  info: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: 'bold' },
  location: { color: '#666', marginTop: 4 },
});
