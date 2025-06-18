// src/screens/ItemDetailScreen.tsx
import { useTheme } from '@/theme/ThemeContext';
import { useTypography } from '@/theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { loadItems } from '../services/storage';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const typo = useTypography();

  const [item, setItem] = useState<{
    title: string;
    location: string;
    category: string;
    image?: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const all = await loadItems();
      const found = all.find(i => i.id === id);
      setItem(found ?? null);
    })();
  }, [id]);

  if (!item) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary, padding: 20 }}>Loading…</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Item Details</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Image */}
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={[styles.image, { borderColor: colors.inputBorder }]}
        />
      ) : (
        <View
          style={[
            styles.imagePlaceholder,
            { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder },
          ]}
        >
          <Text style={[typo.small, { color: colors.textSecondary }]}>No Image</Text>
        </View>
      )}

      {/* Details */}
      <View style={styles.infoBox}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Name</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{item.title}</Text>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Location</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{item.location}</Text>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{item.category}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: { padding: 4, width: 32, alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontWeight: '600', textAlign: 'center', flex: 1 },
  image: {
    width: '90%',
    height: 240,
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  imagePlaceholder: {
    width: '90%',
    height: 240,
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: { marginTop: 24, paddingHorizontal: 20 },
  label: { marginTop: 10, fontSize: 14 },
  value: { fontSize: 16, marginBottom: 8 },
});
