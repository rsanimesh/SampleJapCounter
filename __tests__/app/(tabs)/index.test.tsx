import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../../app/(tabs)/index';
import * as dbService from '../../services/database';

const mockPush = vi.fn();

// Mock routing
jest.mock('expo-router', () => ({
    useRouter: () => ({ push: mockPush }),
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
    getStatsForDate: vi.fn(),
    getAllTimeStats: vi.fn(),
}));

describe('HomeScreen', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Mock the return values from the database
        (dbService.getStatsForDate as any).mockResolvedValue({ totalBeads: 108, totalMalas: 1 });
        (dbService.getAllTimeStats as any).mockResolvedValue({ totalBeads: 1080, totalMalas: 10 });
    });

    it('renders header, stats and start button', async () => {
        const { getByText } = render(<HomeScreen />);

        await waitFor(() => {
            expect(getByText('home.todayJaps')).toBeTruthy();
            expect(getByText('home.totalJaps')).toBeTruthy();
            expect(getByText('home.startJap')).toBeTruthy();
        });
    });

    it('displays correct statistics data from database', async () => {
        const { getByText } = render(<HomeScreen />);

        // Wait for data to load
        await waitFor(() => {
            expect(getByText('108')).toBeTruthy(); // Today beads
            expect(getByText('1 common.mala')).toBeTruthy(); // Today malas
            expect(getByText('1080')).toBeTruthy(); // Total beads
            expect(getByText('10 common.mala')).toBeTruthy(); // Total malas
        });
    });

    it('navigates to statistics page on stats container press', async () => {
        const { getByText } = render(<HomeScreen />);

        await waitFor(() => {
            expect(getByText('home.todayJaps')).toBeTruthy();
        });

        const statsCard = getByText('home.todayJaps').parent;
        if (statsCard && statsCard.parent) {
            fireEvent.press(statsCard.parent);
            expect(mockPush).toHaveBeenCalledWith('/statistics');
        }
    });

    it('navigates to japPage on "Start Jap" button press', async () => {
        const { getByText } = render(<HomeScreen />);

        const startButton = getByText('home.startJap');
        fireEvent.press(startButton);

        expect(mockPush).toHaveBeenCalledWith('/japPage');
    });
});
