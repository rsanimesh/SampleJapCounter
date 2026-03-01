import { File, Paths } from 'expo-file-system';

export interface SettingsData {
    userName: string;
    vibrationEnabled: boolean;
    // soundEnabled removed as per requirement
}

export const DEFAULT_SETTINGS: SettingsData = {
    userName: '',
    vibrationEnabled: true, // Default to true
};

const settingsFile = new File(Paths.document, 'user_settings.json');

export const loadSettings = async (): Promise<SettingsData> => {
    try {
        if (settingsFile.exists) {
            const content = await settingsFile.text();
            if (!content) return DEFAULT_SETTINGS;

            const parsed = JSON.parse(content);
            // Merge with defaults to handle missing keys in future schema updates
            return { ...DEFAULT_SETTINGS, ...parsed };
        } else {
            // Create file with defaults if it doesn't exist
            await saveSettings(DEFAULT_SETTINGS);
            return DEFAULT_SETTINGS;
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        return DEFAULT_SETTINGS;
    }
};

export const saveSettings = async (settings: SettingsData): Promise<void> => {
    try {
        if (!settingsFile.exists) {
            settingsFile.create();
        }
        settingsFile.write(JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
    }
};
