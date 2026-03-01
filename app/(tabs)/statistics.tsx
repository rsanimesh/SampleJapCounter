import HistoryCard from '@/components/HistoryCard';
import { Colors } from '@/constants/Colors';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { getPaginatedHistory, Session } from '../../services/database';

export default function StatisticsScreen() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [offset, setOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);

    const fetchSessions = async (reset = false) => {
        if (isLoading || (!reset && !hasMoreData)) return;

        setIsLoading(true);
        try {
            const currentOffset = reset ? 0 : offset;
            const limit = 10;
            const newSessions = await getPaginatedHistory(limit, currentOffset);

            if (reset) {
                setSessions(newSessions);
                setOffset(limit);
            } else {
                setSessions(prev => {
                    const existingIds = new Set(prev.map(s => s.id));
                    const uniqueNewSessions = newSessions.filter(s => !existingIds.has(s.id));
                    return [...prev, ...uniqueNewSessions];
                });
                setOffset(prev => prev + limit);
            }

            if (newSessions.length < limit) {
                setHasMoreData(false);
            } else {
                setHasMoreData(true);
            }
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchSessions(true);
        }, [])
    );

    const renderItem = ({ item }: { item: Session }) => (
        <HistoryCard
            date={item.timestamp}
            beadCount={item.bead_count}
            malaCount={item.mala_count}
            duration={item.duration_sec || 0}
        />
    );

    const renderFooter = () => {
        if (!isLoading) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color={Colors.dark.tint} />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Session History</Text>
            <FlatList
                data={sessions}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                onEndReached={() => fetchSessions(false)}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={
                    !isLoading ? <Text style={styles.emptyText}>No sessions recorded yet.</Text> : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        paddingTop: 50, // Safe area padding
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.tint,
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.dark.textSecondary,
        marginTop: 50,
        fontSize: 16,
    },
});