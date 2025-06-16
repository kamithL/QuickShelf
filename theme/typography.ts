// theme/typography.tsx
import { useTheme } from './ThemeContext';

export const useTypography = () => {
  const { colors } = useTheme();
  return {
    heading: { fontSize: 22, fontWeight: 'bold' as const, color: colors.textPrimary },
    body:    { fontSize: 16,                   color: colors.textPrimary },
    small:   { fontSize: 12,                   color: colors.textSecondary },
    title:   { fontSize: 22, fontWeight: '600' as const, color: colors.textPrimary },
    label:   { fontSize: 13, fontWeight: '500' as const, color: colors.textSecondary },
  };
};
