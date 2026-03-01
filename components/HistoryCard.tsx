import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface HistoryCardProps {
    date: string | number; // Timestamp or ISO string
    beadCount: number;
    malaCount: number;
    duration: number; // in seconds
}

export default function HistoryCard({ date, beadCount, malaCount, duration }: HistoryCardProps) {
    const dateObj = new Date(date);

    // Format: "Feb 8, Sat • 11:41 PM"
    const datePart = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        weekday: 'short',
    });
    const timePart = dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });
    const formattedDate = `${datePart} • ${timePart}`;

    // Format duration to mm:ss or just minutes if preferred
    // User asked for "{x}m", let's approximate
    const durationHours = Math.round(duration / 3600);
    const durationMinutes = Math.round(duration / 60);
    const durationSeconds = Math.round(duration % 60);

    return (
        <View style={styles.container}>
            {/* Top Section: Date Header */}
            <View style={styles.header}>
                <Text style={styles.dateText}>{formattedDate}</Text>
            </View>

            {/* Middle Section: The Hero (Beads) */}
            <View style={styles.heroSection}>
                <Text style={styles.heroValue}>{(malaCount * 108) + beadCount}</Text>
                <Text style={styles.heroLabel}>Beads</Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Bottom Section: Stats Row */}
            <View style={styles.statsRow}>
                {/* Malas */}
                <View style={styles.statItem}>
                    <MaterialCommunityIcons name="dots-hexagon" size={20} color={Colors.dark.tint} />
                    <Text style={styles.statText}>{malaCount} Malas</Text>
                </View>

                {/* Duration */}
                <View style={styles.statItem}>
                    <Ionicons name="timer-outline" size={20} color={Colors.dark.tint} />
                    <Text style={styles.statText}>{durationHours}:{durationMinutes}:{durationSeconds}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.dark.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.3)', // Slight transparency on Gold
        // Shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    header: {
        marginBottom: 10,
    },
    dateText: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    heroSection: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    heroValue: {
        fontSize: 42,
        fontWeight: 'bold',
        color: Colors.dark.tint,
        textShadowColor: 'rgba(255, 215, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    heroLabel: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        marginTop: -5,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.dark.border,
        marginBottom: 15,
        opacity: 0.5,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statText: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
});
