import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SettingsScreen from '../../app/(tabs)/settings';
import * as settingsService from '../../services/settings';

// Mock navigation
jest.mock('expo-router', () => ({
    useFocusEffect: (cb: any) => cb(),
}));

// Mock safe area insets
jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock i18n
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: vi.fn(),
        },
    }),
}));

// Mock settings service
vi.mock('../../services/settings', () => ({
    loadSettings: vi.fn(),
    saveSettings: vi.fn(),
    DEFAULT_SETTINGS: { userName: '', vibrationEnabled: true, language: 'en' },
}));

describe('SettingsScreen', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (settingsService.loadSettings as any).mockResolvedValue({
            userName: 'Test User',
            vibrationEnabled: false,
            language: 'en',
        });
    });

    it('renders loading state initially', () => {
        // Override mock to delay promise to see loading state
        (settingsService.loadSettings as any).mockImplementation(() => new Promise(() => { }));
        const { getByText } = render(<SettingsScreen />);
        expect(getByText('common.loading')).toBeTruthy();
    });

    it('renders settings content after loading', async () => {
        const { getByText, getByDisplayValue } = render(<SettingsScreen />);

        await waitFor(() => {
            expect(getByText('settings.title')).toBeTruthy();
        });

        expect(getByDisplayValue('Test User')).toBeTruthy();
        expect(getByText('settings.vibration')).toBeTruthy();
    });

    it('handles name change', async () => {
        const { getByDisplayValue } = render(<SettingsScreen />);

        await waitFor(() => {
            expect(getByDisplayValue('Test User')).toBeTruthy();
        });

        const input = getByDisplayValue('Test User');
        fireEvent.changeText(input, 'New User');

        expect(getByDisplayValue('New User')).toBeTruthy();
    });

    it('saves settings with success alert', async () => {
        const { getByText, getByDisplayValue } = render(<SettingsScreen />);

        await waitFor(() => {
            expect(getByDisplayValue('Test User')).toBeTruthy();
        });

        const mockAlert = vi.spyOn(require('react-native').Alert, 'alert');
        (settingsService.saveSettings as any).mockResolvedValueOnce(undefined);

        fireEvent.press(getByText('settings.saveSettings'));

        await waitFor(() => {
            expect(settingsService.saveSettings).toHaveBeenCalledWith({
                userName: 'Test User',
                vibrationEnabled: false,
                language: 'en'
            });
            expect(mockAlert).toHaveBeenCalledWith('common.success', 'settings.settingsSaved');
        });
    });
});
