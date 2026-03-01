import { Colors } from '@/constants/Colors';
import { DEFAULT_SETTINGS, SettingsData, loadSettings as loadSettingsService, saveSettings as saveSettingsService } from '@/services/settings';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    const loadSettings = async () => {
        try {
            const data = await loadSettingsService();
            setSettings(data);
        } catch (error) {
            console.error('Error loading settings:', error);
            setSettings(DEFAULT_SETTINGS);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadSettings();
        }, [])
    );

    const saveSettings = async () => {
        try {
            await saveSettingsService(settings);
            Alert.alert('Success', 'Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            Alert.alert('Error', 'Failed to save settings.');
        }
    };

    const updateSetting = (key: keyof SettingsData, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text>Loading settings...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.headerTitle}>Settings</Text>

            {/* Profile Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={settings.userName}
                        onChangeText={(text) => updateSetting('userName', text)}
                        placeholder="Enter your name"
                        placeholderTextColor={Colors.dark.textSecondary}
                    />
                </View>
            </View>

            {/* Preferences Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Vibration</Text>
                        <Switch
                            value={settings.vibrationEnabled}
                            onValueChange={(val) => updateSetting('vibrationEnabled', val)}
                            trackColor={{ false: Colors.dark.border, true: Colors.dark.tint }}
                            thumbColor={settings.vibrationEnabled ? Colors.dark.text : Colors.dark.tabIconDefault}
                        />
                    </View>
                    {/* Sound option removed */}
                </View>
            </View>

            {/* Footer */}
            <TouchableOpacity style={styles.saveButton} onPress={saveSettings} activeOpacity={0.8}>
                <Text style={styles.saveButtonText}>Save Settings</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.dark.tint,
        marginBottom: 30,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.dark.textSecondary,
        marginBottom: 10,
        marginLeft: 5,
    },
    inputContainer: {
        backgroundColor: Colors.dark.surface,
        borderRadius: 12,
        padding: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    label: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        marginBottom: 5,
    },
    input: {
        fontSize: 18,
        color: Colors.dark.text,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
        paddingVertical: 5,
    },
    card: {
        backgroundColor: Colors.dark.surface,
        borderRadius: 12,
        paddingVertical: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    rowLabel: {
        fontSize: 16,
        color: Colors.dark.text,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.dark.border,
        marginHorizontal: 20,
    },
    saveButton: {
        backgroundColor: Colors.dark.tint,
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
        elevation: 4,
        shadowColor: Colors.dark.tint,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    saveButtonText: {
        color: Colors.dark.buttonText,
        fontSize: 18,
        fontWeight: 'bold',
    },
});