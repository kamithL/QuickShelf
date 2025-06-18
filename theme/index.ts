export * from './typography';

import { useColorScheme } from 'react-native';
import { darkColors, lightColors } from './colors';

export const useThemeColors = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : lightColors;
};