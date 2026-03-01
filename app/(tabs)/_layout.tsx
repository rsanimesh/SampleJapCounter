import { Colors } from '@/constants/Colors';
import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.dark.tint,
                tabBarInactiveTintColor: Colors.dark.tabIconDefault,
                headerShown: false,
                headerStyle: {
                    backgroundColor: Colors.dark.background,
                    borderBottomColor: Colors.dark.border,
                    borderBottomWidth: 1,
                },
                headerShadowVisible: false,
                headerTintColor: Colors.dark.text,
                tabBarStyle: {
                    backgroundColor: Colors.dark.surface,
                    borderTopColor: Colors.dark.border,
                    borderTopWidth: 1,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="statistics"
                options={{
                    title: 'Statistics',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} color={color} size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24} />
                    ),
                }}
            />
        </Tabs>
    );
}
