// app/_layout.js
import { ThemeProvider, useTheme } from '@/theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

function DrawerWithTheme() {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerLabelStyle: { fontSize: 16, color: colors.textPrimary },
        drawerStyle: { backgroundColor: colors.background },
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props} style={{ backgroundColor: colors.background }}>
          <DrawerItemList {...props} />
          <View style={[styles.toggleRow, { borderTopColor: colors.border }]}>
            <Text style={{ color: colors.textPrimary, flex: 1 }}>Dark Mode</Text>
            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'Home & Add Item',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="item-detail"
        options={{
          title: 'Item Detail',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <DrawerWithTheme />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
});
