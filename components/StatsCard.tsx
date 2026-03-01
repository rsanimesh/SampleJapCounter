import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface StatsCardProps {
    title: string;
    count: string | number;
    subtext: string;
    style?: ViewStyle;
}

export default function StatsCard({ title, count, subtext, style }: StatsCardProps) {
    return (
        <View style={[styles.card, style]}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.count}>{count}</Text>
            <Text style={styles.subtext}>{subtext}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.dark.surface,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.dark.borderTint,
        // Reduced shadow for dark mode
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 140,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.dark.text,
        marginBottom: 8,
    },
    count: {
        fontSize: 48,
        fontWeight: 'bold',
        color: Colors.dark.tint,
        marginBottom: 4,
    },
    subtext: {
        fontSize: 12,
        color: Colors.dark.text,
    },
});
