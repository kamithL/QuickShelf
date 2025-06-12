// src/screens/ItemDetailScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function ItemDetailScreen() {
  const router = useRouter();
  const { title, location, image } = useLocalSearchParams();

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Item Details</Text>
            <View style={{ width: 24 }} /> 
        </View>


      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: String(image) }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={typography.small}>No Image</Text>
          </View>
        )}
      </View>

      <Text style={typography.label}>Name</Text>
      <Text style={styles.text}>{!title?'-':title}</Text>

      <Text style={[typography.label, { marginTop: 16 }]}>Location</Text>
      <Text style={styles.text}>{!location?'-':location}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  imageContainer: {
    alignSelf: 'center',
    width: 180,
    height: 180,
    borderRadius: 12,
    backgroundColor: '#eee',
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 24,
    alignItems: 'flex-start',
  },
  headerTitle: {
    ...typography.heading,
    textAlign: 'center',
    flex: 1,
  },

});
