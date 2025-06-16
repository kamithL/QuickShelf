import { useTheme } from '@/theme/ThemeContext';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTypography } from '../../theme/typography';

interface Item {
  id: string;
  title: string;
  location?: string;
  image?: string;
  category?: string;
}

export default function ItemCard({ item }: { item: Item }) {
    const { colors } = useTheme();
    const typo = useTypography();

  const styles = StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      padding: 12,
      borderRadius: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    image: {
      width: 64,
      height: 64,
      borderRadius: 10,
      marginRight: 12,
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
    },
    placeholder: {
      width: 64,
      height: 64,
      borderRadius: 10,
      backgroundColor: colors.inputBackground,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.inputBorder,
      marginRight: 12,
    },
    placeholderText: {
      ...typo.small,
      color: colors.textSecondary,
    },
    details: {
      flex: 1,
    },
    title: {
      ...typo.body,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    location: {
      ...typo.small,
      color: colors.textSecondary,
    },
    category: {
      ...typo.small,
      color: colors.textSecondary,
      fontStyle: 'italic',
      marginTop: 2,
    },
  });

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
        {item.location && <Text style={styles.location}>📦 {item.location}</Text>}
        {item.category && <Text style={styles.category}>🏷️ {item.category}</Text>}
      </View>
    </View>
  );
}
