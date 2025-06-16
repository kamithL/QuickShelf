import { useTheme } from '@/theme/ThemeContext';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';


interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function Button({ label, onPress, disabled }: ButtonProps) {
  const { colors } = useTheme();

  const dynamicStyles = StyleSheet.create({
    button: {
      backgroundColor: disabled ? colors.disabled : colors.primary,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12,
    },
    label: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '600',
    },
    pressed: {
      opacity: 0.8,
    },
  });

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        dynamicStyles.button,
        pressed && dynamicStyles.pressed,
      ]}
    >
      <Text style={dynamicStyles.label}>{label}</Text>
    </Pressable>
  );
}

