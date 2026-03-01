import { Colors } from '@/constants/Colors';
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { initDB } from '../services/database';
import { loadSettings } from '../services/settings';
import '../i18n'; // Initialize i18n
import i18n from '../i18n';

export default function RootLayout() {
  useEffect(() => {
    initDB();

    // Load persisted language
    loadSettings().then((settings) => {
      if (settings.language && settings.language !== i18n.language) {
        i18n.changeLanguage(settings.language);
      }
    });
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