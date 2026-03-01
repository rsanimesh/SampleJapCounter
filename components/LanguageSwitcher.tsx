import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
    currentLanguage: 'en' | 'hi';
    onLanguageChange: (lang: 'en' | 'hi') => void;
}

export default function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{t('settings.language')}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        currentLanguage === 'en' && styles.buttonActive
                    ]}
                    onPress={() => onLanguageChange('en')}
                    activeOpacity={0.8}
                >
                    <Text style={[
                        styles.buttonText,
                        currentLanguage === 'en' && styles.buttonTextActive
                    ]}>English</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.button,
                        currentLanguage === 'hi' && styles.buttonActive
                    ]}
                    onPress={() => onLanguageChange('hi')}
                    activeOpacity={0.8}
                >
                    <Text style={[
                        styles.buttonText,
                        currentLanguage === 'hi' && styles.buttonTextActive
                    ]}>हिंदी</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.dark.border, // Optional, can remove if UI feels too crowded
    },
    label: {
        fontSize: 16,
        color: Colors.dark.text,
    },
    buttonContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.background,
        borderRadius: 8,
        overflow: 'hidden',
        padding: 4,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    button: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    buttonActive: {
        backgroundColor: Colors.dark.tint,
    },
    buttonText: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        fontWeight: '500',
    },
    buttonTextActive: {
        color: Colors.dark.buttonText,
        fontWeight: 'bold',
    },
});
