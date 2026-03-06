import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import JapPageScreen from '../../app/japPage';
import * as dbService from '../../services/database';
import * as settingsService from '../../services/settings';
import * as Haptics from 'expo-haptics';

// Mock navigation
const mockBack = vi.fn();
const mockAddListener = vi.fn();
const mockDispatch = vi.fn();

jest.mock('expo-router', () => ({
    useRouter: () => ({ back: mockBack }),
    useNavigation: () => ({
        addListener: mockAddListener,
        dispatch: mockDispatch,
    }),
    useFocusEffect: (cb: any) => cb(),
}));

// Mock safe area
jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock i18n
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Mock DB and Settings
vi.mock('../../services/database', () => ({
    addSession: vi.fn(),
}));

vi.mock('../../services/settings', () => ({
    loadSettings: vi.fn(),
}));

// Mock Haptics
jest.mock('expo-haptics', () => ({
    impactAsync: vi.fn(),
    notificationAsync: vi.fn(),
    ImpactFeedbackStyle: { Light: 'light' },
    NotificationFeedbackType: { Success: 'success' },
}));

describe('JapPageScreen', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (settingsService.loadSettings as any).mockResolvedValue({ vibrationEnabled: true });

        // Mock the navigation listener to return an unsubscribe function
        mockAddListener.mockReturnValue(vi.fn());
    });

    it('renders initial state correctly 0 beads 0 malas', async () => {
        const { getByText } = render(<JapPageScreen />);

        await waitFor(() => {
            expect(getByText('0')).toBeTruthy(); // bead count
            expect(getByText('jap.malaCount: 0')).toBeTruthy();
            expect(getByText('00:00:00')).toBeTruthy();
        });
    });

    it('increments bead count and triggers haptics on press', async () => {
        const { getByText, getByTestId } = render(<JapPageScreen />);

        // The main container is a Pressable
        const container = getByText('0').parent?.parent?.parent;

        if (container) {
            fireEvent.press(container);
        }

        await waitFor(() => {
            expect(getByText('1')).toBeTruthy();
            expect(Haptics.impactAsync).toHaveBeenCalled();
        });
    });

    it('handles save session alert', async () => {
        const { getByText } = render(<JapPageScreen />);
        const mockAlert = vi.spyOn(require('react-native').Alert, 'alert');
        (dbService.addSession as any).mockResolvedValueOnce(undefined);

        const saveBtn = getByText('jap.saveSession');
        fireEvent.press(saveBtn);

        expect(mockAlert).toHaveBeenCalledWith(
            'Save Session',
            'Do you want to save this session?',
            expect.any(Array)
        );

        // Simulate pressing "Save" on the alert 
        // The second button is Save
        const saveCallback = mockAlert.mock.calls[0][2]?.[1]?.onPress;
        if (saveCallback) {
            await saveCallback();
            expect(dbService.addSession).toHaveBeenCalled();
            expect(mockBack).toHaveBeenCalled();
        }
    });
});
