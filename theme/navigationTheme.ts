import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';
import { darkColors, lightColors } from './colors';

export const createNavigationTheme = (isDark: boolean): Theme => {
  const baseTheme = isDark ? DarkTheme : DefaultTheme;
  const customColors = isDark ? darkColors : lightColors;

  return {
    ...baseTheme,
    dark: isDark,
    colors: {
      ...baseTheme.colors,
      background: customColors.background,
      card: customColors.cardBackground,
      text: customColors.textPrimary,
      border: customColors.border,
      primary: customColors.primary,
      notification: customColors.info,
    },
  };
};
