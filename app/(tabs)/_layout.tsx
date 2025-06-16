// app/(tabs)/_layout.tsx
import { useTheme } from '@/theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function TabLayout() {
  const { isDark, colors, toggleTheme } = useTheme();
  const navigation = useNavigation<DrawerNavigationProp<Record<string, object | undefined>>>();

  const iconMap = {
    index: 'home-outline',
    add:   'add-circle-outline',
  } as const;

  type TabName = keyof typeof iconMap;
  type IconName = typeof iconMap[TabName];

  return (
    <Tabs
      screenOptions={({ route }) => {
        const routeKey = route.name as TabName;
        const iconName: IconName = iconMap[routeKey];

        return {
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: colors.cardBackground },
          headerTintColor: colors.textPrimary,
          headerTitle: routeKey === 'index' ? 'Home' : 'Add Item',

          // Hamburger menu button
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="menu" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          ),

          // Dark/light mode toggle
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleTheme}
              style={{ marginRight: 16 }}
            >
              <Ionicons
                name={isDark ? 'sunny-outline' : 'moon-outline'}
                size={24}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          ),

          tabBarActiveTintColor: colors.primary,
          tabBarStyle: { backgroundColor: colors.cardBackground },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconName} size={size} color={color} />
          ),
          tabBarLabel: routeKey === 'index' ? 'Home' : 'Add Item',
        };
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="add" />
    </Tabs>
  );
}
