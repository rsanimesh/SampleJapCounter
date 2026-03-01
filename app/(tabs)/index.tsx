import StatsCard from '@/components/StatsCard';
import { Colors } from '@/constants/Colors';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { getAllTimeStats, getStatsForDate } from '../../services/database';

export default function HomeScreen() {
    const router = useRouter();
    const [todayStats, setTodayStats] = useState({ totalBeads: 0, totalMalas: 0 });
    const [allTimeStats, setAllTimeStats] = useState({ totalBeads: 0, totalMalas: 0 });

    useFocusEffect(
        useCallback(() => {
            const fetchStats = async () => {
                const now = new Date();
                const today = now.toISOString().split('T')[0];
                const todayData = await getStatsForDate(today);
                const allTimeData = await getAllTimeStats();
                setTodayStats(todayData);
                setAllTimeStats(allTimeData);
            };
            fetchStats();
        }, [])
    );

    return (
        <View style={styles.container}>
            {/* Section A: Header */}
            <View style={styles.header}>
                <Image
                    source={require('@/assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Section B: Stats Dashboard */}
            <Pressable onPress={() => router.push('/statistics')} style={styles.statsContainer}>
                <StatsCard
                    title="Todays Jap"
                    count={todayStats.totalBeads.toString()}
                    subtext={`${todayStats.totalMalas} Malas`}
                    style={styles.card}
                />
                <StatsCard
                    title="Total Jap"
                    count={allTimeStats.totalBeads.toString()}
                    subtext={`${allTimeStats.totalMalas} Malas`}
                    style={styles.card}
                />
            </Pressable>

            {/* Section C: Action Button */}
            <Pressable onPress={() => router.push('/japPage')} style={styles.startButton}>
                <Image
                    source={require('@/assets/images/appicon.png')}
                    style={styles.buttonIcon}
                    resizeMode="contain"
                />
                <Text style={styles.startButtonText}>Start Jap</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        paddingVertical: 60,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    logo: {
        width: 240,
        height: 240,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 40,
    },
    card: {
        flex: 1,
        marginHorizontal: 8,
    },
    startButton: {
        backgroundColor: Colors.dark.tint,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        elevation: 5,
        shadowColor: Colors.dark.tint,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
        tintColor: Colors.dark.buttonText,
    },
    startButtonText: {
        color: Colors.dark.buttonText,
        fontSize: 20,
        fontWeight: 'bold',
    },
});