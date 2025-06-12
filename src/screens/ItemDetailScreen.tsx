import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function ItemDetailScreen() {
  const { title, location, image } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Item Details</Text>
        <View style={{ width: 32 }} />
      </View>
      {image ? (
        <Image source={{ uri: image.toString() }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={typography.small}>No Image</Text>
        </View>
      )}
      <View style={styles.infoBox}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{title}</Text>

        <Text style={styles.label}>Location</Text>
        <Text style={styles.value}>{location || 'N/A'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: colors.cardBackground,
  },
  backButton: {
    padding: 4,
    width: 32,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    flex: 1,
  },
  image: {
    width: '90%',
    height: 240,
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  imagePlaceholder: {
    width: '90%',
    height: 240,
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  label: {
    ...typography.label,
    marginTop: 10,
    color: colors.textSecondary,
  },
  value: {
    ...typography.body,
    fontSize: 16,
    marginBottom: 8,
    color: colors.textPrimary,
  },
});
