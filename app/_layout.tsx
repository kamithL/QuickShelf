// app/_layout.js
import { ThemeProvider, useTheme } from '@/theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
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
      drawerContent={(props) => {
        // filter out the item-detail route
        const filteredRoutes = props.state.routes.filter(
          (r) => r.name !== 'item-detail'
        );
        const filteredState = {
          ...props.state,
          routes: filteredRoutes,
        };

        return (
          <DrawerContentScrollView
            {...props}
            style={{ backgroundColor: colors.background }}
          >
            {/* pass filteredState only to DrawerItemList */}
            <DrawerItemList {...props} state={filteredState} />

            {/* Dark mode toggle */}
            <View style={[styles.toggleRow, { borderTopColor: colors.border }]}>
              <Text style={{ color: colors.textPrimary, flex: 1 }}>
                Dark Mode
              </Text>
              <Switch value={isDark} onValueChange={toggleTheme} />
            </View>
          </DrawerContentScrollView>
        );
      }}
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
      {/* still register item-detail so navigation works, but it won’t show */}
      <Drawer.Screen name="item-detail" options={{ headerShown: false }} />
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
