import { vi } from 'vitest';

// Mock expo-file-system with proper class constructor
vi.mock('expo-file-system', () => {
  class MockFile {
    exists = false;
    text = vi.fn(() => Promise.resolve(''));
    write = vi.fn(() => Promise.resolve());
    create = vi.fn(() => Promise.resolve());
    
    constructor(_path: string, _name: string) {
      // Constructor accepts path and name arguments
    }
  }
  
  return {
    File: MockFile,
    Paths: {
      document: '/mock/document/path',
    },
  };
});

// Mock expo-sqlite
vi.mock('expo-sqlite', () => ({
  openDatabaseAsync: vi.fn(() =>
    Promise.resolve({
      execAsync: vi.fn(() => Promise.resolve()),
      runAsync: vi.fn(() => Promise.resolve()),
      getFirstAsync: vi.fn(() => Promise.resolve(null)),
      getAllAsync: vi.fn(() => Promise.resolve([])),
    })
  ),
}));

// Mock expo-haptics
vi.mock('expo-haptics', () => ({
  impactAsync: vi.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock expo-router
vi.mock('expo-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
  }),
  useLocalSearchParams: () => ({}),
  usePathname: () => '/',
  Link: ({ children }: { children: React.ReactNode }) => children,
  Stack: {
    Screen: () => null,
  },
  Tabs: {
    Screen: () => null,
  },
}));

// Mock @expo/vector-icons
vi.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  MaterialCommunityIcons: 'MaterialCommunityIcons',
  FontAwesome: 'FontAwesome',
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// Mock constants/Colors
vi.mock('@/constants/Colors', () => ({
  Colors: {
    dark: {
      text: '#FFFFFF',
      textSecondary: '#B3B3B3',
      background: '#121212',
      surface: '#1E1E1E',
      tint: '#FFD700',
      icon: '#B0BEC5',
      tabIconDefault: '#B0BEC5',
      tabIconSelected: '#FFD700',
      border: '#333333',
      borderTint: '#FFD700',
      buttonText: '#121212',
      error: '#CF6679',
    },
  },
}));
