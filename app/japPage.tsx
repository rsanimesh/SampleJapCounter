import { Colors } from '@/constants/Colors';
import { loadSettings } from '@/services/settings';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';
import { addSession } from '../services/database';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.8;
const STROKE_WIDTH = 20;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const BEADS_PER_MALA = 108;

export default function JapPageScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    // State
    const [beadCount, setBeadCount] = useState(0);
    const [malaCount, setMalaCount] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchSettings = async () => {
                const settings = await loadSettings();
                setVibrationEnabled(settings.vibrationEnabled);
            };
            fetchSettings();
        }, [])
    );

    // Derived values
    const progress = beadCount / BEADS_PER_MALA;
    const strokeDashoffset = CIRCUMFERENCE - (progress * CIRCUMFERENCE);

    // Format time helper
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Timer Effect
    useEffect(() => {
        let interval: any;
        if (startTime) {
            // Update immediately to avoid 1s delay feeling
            setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));

            interval = setInterval(() => {
                setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        } else {
            setElapsedSeconds(0);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [startTime]);

    // Navigation Guard
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (beadCount === 0 && malaCount === 0 && elapsedSeconds === 0) {
                // If we don't have unsaved changes, then we don't need to do anything
                return;
            }

            // Prevent default behavior of leaving the screen
            e.preventDefault();

            // Prompt the user before leaving the screen
            Alert.alert(
                'Discard session?',
                'You have unsaved changes. Are you sure to discard them and leave the screen?',
                [
                    { text: "Don't leave", style: 'cancel', onPress: () => { } },
                    {
                        text: 'Discard',
                        style: 'destructive',
                        // If the user confirmed, then we dispatch the action we blocked earlier
                        // This will continue the action that had triggered the removal of the screen
                        onPress: () => navigation.dispatch(e.data.action),
                    },
                ]
            );
        });

        return unsubscribe;
    }, [navigation, beadCount]);

    // Handlers
    const handleIncrement = useCallback(() => {
        setStartTime(prev => prev === null ? Date.now() : prev);

        setBeadCount(prev => {
            const nextCount = prev + 1;
            if (nextCount === BEADS_PER_MALA) {
                // Completed a Mala
                if (vibrationEnabled) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
                setMalaCount(m => m + 1);
                return 0;
            }
            // Light feedback for every bead
            if (vibrationEnabled) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            return nextCount;
        });
    }, [vibrationEnabled]);

    const handleSave = useCallback(() => {
        Alert.alert(
            'Save Session',
            'Do you want to save this session?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Save',
                    onPress: async () => {
                        let durationInSeconds = 0;
                        if (startTime) {
                            durationInSeconds = Math.floor((Date.now() - startTime) / 1000);
                        }
                        console.log('Saving Session:', { beadCount, malaCount, durationInSeconds });

                        try {
                            await addSession('General', beadCount, malaCount, durationInSeconds);

                            // Reset counters
                            setBeadCount(0);
                            setMalaCount(0);
                            setStartTime(null);
                            setElapsedSeconds(0);

                            // Allow some time for the log and potential cleanup before navigating
                            // In a real app, you'd save to storage/DB here.
                            router.back();
                        } catch (error) {
                            console.error("Failed to save session:", error);
                        }
                    }
                }
            ]
        );
    }, [beadCount, malaCount, startTime, router]);

    return (
        <Pressable style={styles.container} onPress={handleIncrement}>
            <View style={[styles.contentContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

                {/* Center: Circular Progress */}
                <View style={styles.circleContainer}>
                    <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}>
                        <G rotation="-90" origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}>
                            {/* Background Circle */}
                            <Circle
                                cx={CIRCLE_SIZE / 2}
                                cy={CIRCLE_SIZE / 2}
                                r={RADIUS}
                                stroke={Colors.dark.border}
                                strokeWidth={STROKE_WIDTH}
                                fill="transparent"
                            />
                            {/* Progress Circle */}
                            <Circle
                                cx={CIRCLE_SIZE / 2}
                                cy={CIRCLE_SIZE / 2}
                                r={RADIUS}
                                stroke={Colors.dark.tint}
                                strokeWidth={STROKE_WIDTH}
                                fill="transparent"
                                strokeDasharray={CIRCUMFERENCE}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                            />
                        </G>
                    </Svg>

                    {/* Center Text */}
                    <View style={styles.centerTextContainer}>
                        <Text style={styles.countText}>{beadCount}</Text>
                        <Text style={styles.malaText}>Mala: {malaCount}</Text>
                        <Text style={styles.timerText}>{formatTime(elapsedSeconds)}</Text>
                    </View>
                </View>

                {/* Bottom: Save Button */}
                {/* Using Pressable/TouchableOpacity and stopping propagation to prevent increment */}
                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={(e) => {
                            e.stopPropagation();
                            handleSave();
                        }}
                    >
                        <View style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Save Session</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    circleContainer: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    centerTextContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    countText: {
        fontSize: 86,
        fontWeight: 'bold',
        color: Colors.dark.tint,
        textShadowColor: Colors.dark.borderTint,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    malaText: {
        fontSize: 18,
        color: Colors.dark.textSecondary,
        marginTop: 5,
    },
    timerText: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        marginTop: 2,
        fontVariant: ['tabular-nums'],
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: Colors.dark.surface,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: Colors.dark.tint,
        elevation: 5,
        shadowColor: Colors.dark.tint,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    saveButtonText: {
        color: Colors.dark.tint, // Gold Text
        fontSize: 18,
        fontWeight: '600',
    },
});