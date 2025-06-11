import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
export default function TabLayout() {
  return (
  <PaperProvider>
    <GestureHandlerRootView style={styles.root}>
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
             headerStatusBarHeight: 0,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
            name="add"
            options={{
              title: 'Add Item',
              headerTitleStyle: { fontWeight: 'bold' },
              headerStatusBarHeight: 0,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  </PaperProvider>  
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
