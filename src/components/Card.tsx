import { useTheme } from '@/theme/ThemeContext';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function Card({ children, style }: Props) {
  const { colors } = useTheme();

  const dynamicStyles = StyleSheet.create({
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: 10,
      padding: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  });

  return <View style={[dynamicStyles.card, style]}>{children}</View>;
}
