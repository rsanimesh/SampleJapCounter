import { Colors } from '@/constants/Colors';
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { initDB } from '../services/database';

export default function RootLayout() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: Colors.dark.background },
          headerStyle: { backgroundColor: Colors.dark.background },
          headerTintColor: Colors.dark.text,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="japPage" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}