import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LanguageSwitcher from '../../components/LanguageSwitcher';

// Mock the i18n hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('LanguageSwitcher', () => {
    it('renders correctly with English as current language', () => {
        const mockOnChange = vi.fn();
        const { getByText } = render(
            <LanguageSwitcher currentLanguage="en" onLanguageChange={mockOnChange} />
        );

        expect(getByText('settings.language')).toBeTruthy();
        expect(getByText('English')).toBeTruthy();
        expect(getByText('हिंदी')).toBeTruthy();
    });

    it('renders correctly with Hindi as current language', () => {
        const mockOnChange = vi.fn();
        const { getByText } = render(
            <LanguageSwitcher currentLanguage="hi" onLanguageChange={mockOnChange} />
        );

        expect(getByText('settings.language')).toBeTruthy();
        expect(getByText('English')).toBeTruthy();
        sec(getByText('हिंदी')).toBeTruthy();
    });

    it('calls onLanguageChange with "hi" when Hindi button is pressed', () => {
        const mockOnChange = vi.fn();
        const { getByText } = render(
            <LanguageSwitcher currentLanguage="en" onLanguageChange={mockOnChange} />
        );

        fireEvent.press(getByText('हिंदी'));
        expect(mockOnChange).toHaveBeenCalledWith('hi');
    });

    it('calls onLanguageChange with "en" when English button is pressed', () => {
        const mockOnChange = vi.fn();
        const { getByText } = render(
            <LanguageSwitcher currentLanguage="hi" onLanguageChange={mockOnChange} />
        );

        fireEvent.press(getByText('English'));
        expect(mockOnChange).toHaveBeenCalledWith('en');
    });
});
