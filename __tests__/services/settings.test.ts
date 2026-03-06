import { describe, it, expect } from 'vitest';
import { DEFAULT_SETTINGS, SettingsData } from '../../services/settings';

describe('Settings Service', () => {
  describe('DEFAULT_SETTINGS', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_SETTINGS).toEqual({
        userName: '',
        vibrationEnabled: true,
        language: 'en',
      });
    });

    it('should have userName as empty string', () => {
      expect(DEFAULT_SETTINGS.userName).toBe('');
    });

    it('should have vibrationEnabled as true by default', () => {
      expect(DEFAULT_SETTINGS.vibrationEnabled).toBe(true);
    });

    it('should have language as en by default', () => {
      expect(DEFAULT_SETTINGS.language).toBe('en');
    });
  });

  describe('SettingsData Type', () => {
    it('should allow valid settings object', () => {
      const settings: SettingsData = {
        userName: 'TestUser',
        vibrationEnabled: false,
        language: 'hi',
      };
      
      expect(settings.userName).toBe('TestUser');
      expect(settings.vibrationEnabled).toBe(false);
      expect(settings.language).toBe('hi');
    });

    it('should allow Hindi language option', () => {
      const settings: SettingsData = {
        ...DEFAULT_SETTINGS,
        language: 'hi',
      };
      
      expect(settings.language).toBe('hi');
    });

    it('should allow English language option', () => {
      const settings: SettingsData = {
        ...DEFAULT_SETTINGS,
        language: 'en',
      };
      
      expect(settings.language).toBe('en');
    });

    it('should merge with defaults correctly', () => {
      const partialSettings = { userName: 'User' };
      const mergedSettings: SettingsData = {
        ...DEFAULT_SETTINGS,
        ...partialSettings,
      };
      
      expect(mergedSettings).toEqual({
        userName: 'User',
        vibrationEnabled: true,
        language: 'en',
      });
    });
  });

  describe('Settings JSON Serialization', () => {
    it('should serialize settings to JSON', () => {
      const settings: SettingsData = {
        userName: 'TestUser',
        vibrationEnabled: true,
        language: 'hi',
      };
      
      const json = JSON.stringify(settings);
      const parsed = JSON.parse(json);
      
      expect(parsed).toEqual(settings);
    });

    it('should handle empty userName in JSON', () => {
      const settings: SettingsData = DEFAULT_SETTINGS;
      
      const json = JSON.stringify(settings);
      const parsed = JSON.parse(json);
      
      expect(parsed.userName).toBe('');
    });
  });
});
