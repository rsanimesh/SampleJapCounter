import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import StatisticsScreen from '../../app/(tabs)/statistics';
import * as dbService from '../../services/database';

// Mock routing
jest.mock('expo-router', () => ({
    useFocusEffect: (cb: any) => cb(),
}));

// Mock i18n
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Mock DB
vi.mock('../../services/database', () => ({
    getPaginatedHistory: vi.fn(),
    Session: {},
}));

describe('StatisticsScreen', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Default mock returns an empty list
        (dbService.getPaginatedHistory as any).mockResolvedValue([]);
    });

    it('renders header correctly', () => {
        const { getByText } = render(<StatisticsScreen />);
        expect(getByText('statistics.title')).toBeTruthy();
    });

    it('renders empty component when there is no history', async () => {
        const { getByText } = render(<StatisticsScreen />);

        await waitFor(() => {
            expect(getByText('statistics.noHistory')).toBeTruthy();
        });
    });

    it('renders list of sessions when history exists', async () => {
        // Mock history response
        const mockSessions = [
            { id: 1, type: 'General', bead_count: 54, mala_count: 0, duration_sec: 120, timestamp: '2026-03-01T12:00:00Z' },
            { id: 2, type: 'General', bead_count: 0, mala_count: 1, duration_sec: 600, timestamp: '2026-03-01T14:00:00Z' }
        ];

        (dbService.getPaginatedHistory as any).mockResolvedValue(mockSessions);

        const { getByText, queryByText } = render(<StatisticsScreen />);

        await waitFor(() => {
            // Empty text should not be present
            expect(queryByText('statistics.noHistory')).toBeNull();

            // Values from formatted HistoryCard should be present via mock or derived
            expect(getByText('statistics.title')).toBeTruthy();
        });
    });

    it('fetches more data on end reached', async () => {
        // Mock initial response
        const mockSessions = [
            { id: 1, type: 'General', bead_count: 54, mala_count: 0, duration_sec: 120, timestamp: '2026-03-01T12:00:00Z' }
        ];
        (dbService.getPaginatedHistory as any).mockResolvedValueOnce(mockSessions)
            .mockResolvedValueOnce([]);

        const { getByTestId, UNSAFE_getByType } = render(<StatisticsScreen />);

        await waitFor(() => {
            expect(dbService.getPaginatedHistory).toHaveBeenCalledWith(10, 0);
        });

        // Find the FlatList and trigger onEndReached
        const flatList = UNSAFE_getByType(require('react-native').FlatList);

        // Simulate scrolling to bottom
        fireEvent(flatList, 'onEndReached');

        await waitFor(() => {
            expect(dbService.getPaginatedHistory).toHaveBeenCalledWith(10, 10);
        });
    });
});
