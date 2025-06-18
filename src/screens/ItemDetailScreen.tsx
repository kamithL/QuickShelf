import { useTheme } from '@/theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTypography } from '../../theme/typography';

export default function ItemDetailScreen() {
  const { title, location, image } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme(); 
  const typo = useTypography();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Item Details</Text>
        <View style={{ width: 32 }} />
      </View>

      {image ? (
        <Image source={{ uri: image.toString() }} style={[styles.image, { borderColor: colors.inputBorder }]} />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}>
          <Text style={[typo.small, { color: colors.textSecondary }]}>No Image</Text>
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Name</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{title}</Text>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Location</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{location || 'N/A'}</Text>
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
  backButton: {
    padding: 4,
    width: 32,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
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
  infoBox: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  label: {
   
    marginTop: 10,
  },
  value: {
   
    fontSize: 16,
    marginBottom: 8,
  },
});
