// src/components/Input.tsx
import { useTheme } from '@/theme/ThemeContext';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';


interface Props extends TextInputProps {
  error?: string;
  rightIcon?: React.ReactNode;
}

export default function Input({ error, rightIcon, style, ...props }: Props) {
  const { colors } = useTheme();

  const dynamicStyles = StyleSheet.create({
    wrapper: {
      width: '100%',
    },
    inputWrapper: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: colors.textPrimary,
    },
    rightIcon: {
      marginLeft: 8,
    },
    error: {
      color: colors.danger,
      fontSize: 12,
      marginTop: 4,
    },
  });

  return (
    <View style={dynamicStyles.wrapper}>
      <View style={dynamicStyles.inputWrapper}>
        <TextInput
          style={[dynamicStyles.input, style]}
          placeholderTextColor={colors.textSecondary}
          {...props}
        />
        {rightIcon && <View style={dynamicStyles.rightIcon}>{rightIcon}</View>}
      </View>
      {error ? <Text style={dynamicStyles.error}>{error}</Text> : null}
    </View>
  );
}
