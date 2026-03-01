# SampleJapCounter

A cross-platform mobile application built with React Native and Expo for tracking Jap (mantra chanting) sessions. The app helps users count beads and malas during meditation, persist session history, and review statistics over time.

## Features

- **Bead & Mala Counter** — Tap-to-count interface with a circular progress indicator. Automatically increments mala count every 108 beads.
- **Session Timer** — Tracks elapsed time for each counting session.
- **Haptic Feedback** — Configurable vibration on each bead tap and mala completion.
- **Session Persistence** — Saves sessions to a local SQLite database with date, bead count, mala count, and duration.
- **Statistics Dashboard** — View today's stats and all-time totals on the home screen.
- **Session History** — Paginated list of past sessions with date, counts, and duration.
- **Settings** — Configure user name, vibration toggle, and language preference.
- **Internationalization (i18n)** — Supports English and Hindi with `react-i18next`.
- **Dark Theme** — Full dark mode UI with a gold accent color scheme.
- **Navigation Guard** — Prompts before discarding an unsaved session.

## Tech Stack

| Category          | Technology                                      |
| ----------------- | ----------------------------------------------- |
| Framework         | [React Native](https://reactnative.dev/) 0.81   |
| Platform          | [Expo](https://expo.dev/) SDK 54 (New Architecture) |
| Routing           | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based) |
| Navigation        | React Navigation (Bottom Tabs + Native Stack)   |
| Database          | [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) |
| State             | React hooks (`useState`, `useCallback`, `useFocusEffect`) |
| i18n              | [i18next](https://www.i18next.com/) + react-i18next |
| Haptics           | [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) |
| SVG               | react-native-svg                                |
| Animations        | react-native-reanimated                         |
| Language          | TypeScript (strict mode)                        |
| Linting           | ESLint with eslint-config-expo                  |

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) (ships with Node.js)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npx expo` — no global install required)
- For device testing: [Expo Go](https://expo.dev/go) app on iOS or Android
- For emulator testing:
  - **Android**: [Android Studio & Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
  - **iOS** (macOS only): [Xcode & iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd SampleJapCounter
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm start
```

This runs `expo start` and opens the Expo dev tools. From there you can:

- Press **`a`** to open on an Android emulator
- Press **`i`** to open on the iOS simulator (macOS only)
- Scan the QR code with the **Expo Go** app on a physical device

### Platform-specific shortcuts

```bash
npm run android   # Launch on Android emulator
npm run ios       # Launch on iOS simulator
npm run web       # Launch in the browser
```

## Project Structure

```
SampleJapCounter/
├── app/                    # Screens (file-based routing)
│   ├── _layout.tsx         # Root layout (Stack navigator, DB init, i18n)
│   ├── +not-found.tsx      # 404 fallback screen
│   ├── japPage.tsx         # Jap counting screen (circular progress + timer)
│   └── (tabs)/             # Bottom tab navigator
│       ├── _layout.tsx     # Tab bar configuration
│       ├── index.tsx       # Home screen (stats dashboard + start button)
│       ├── statistics.tsx  # Session history (paginated list)
│       └── settings.tsx    # User preferences
├── components/             # Reusable UI components
│   ├── HistoryCard.tsx     # Session history list item
│   ├── LanguageSwitcher.tsx# Language selection component
│   └── StatsCard.tsx       # Stats display card
├── constants/
│   └── Colors.ts           # Dark theme color palette
├── locales/                # i18n translation files
│   ├── en/translation.json # English translations
│   └── hi/translation.json # Hindi translations
├── services/               # Business logic & data layer
│   ├── database.ts         # SQLite operations (init, CRUD, queries)
│   └── settings.ts         # User settings persistence (file system)
├── assets/
│   └── images/             # App icon and logo
├── i18n.ts                 # i18next configuration
├── app.json                # Expo app configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.js        # ESLint flat config
└── package.json
```

## Available Scripts

| Command                  | Description                                           |
| ------------------------ | ----------------------------------------------------- |
| `npm start`              | Start Expo dev server                                 |
| `npm run android`        | Start and open on Android emulator                    |
| `npm run ios`            | Start and open on iOS simulator                       |
| `npm run web`            | Start and open in the browser                         |
| `npm run lint`           | Run ESLint checks                                     |
| `npm run reset-project`  | Move starter code to `app-example/` and create blank `app/` |

## Architecture Overview

### Routing

The app uses **Expo Router** with file-based routing. The `app/` directory defines the route structure:

- `app/_layout.tsx` — Root `Stack` navigator. Initializes the SQLite database and loads persisted language settings on mount.
- `app/(tabs)/` — A `Tabs` navigator with three screens: Home, Statistics, and Settings.
- `app/japPage.tsx` — A standalone screen pushed onto the stack when the user starts a Jap session.

### Data Layer

- **SQLite** (`expo-sqlite`) stores all Jap session records in a `jap_sessions` table with columns for god name, date, timestamp, bead count, mala count, and duration.
- **File System** (`expo-file-system`) persists user settings as a JSON file in the app's document directory.

### Internationalization

Translations are managed via `i18next`. Language files live in `locales/{lang}/translation.json`. The selected language is persisted in user settings and restored on app launch.

## Configuration

### Path Aliases

The project uses the `@/*` path alias mapped to the project root, configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Usage: `import { Colors } from '@/constants/Colors';`

### EAS Build

The project is configured for [EAS Build](https://docs.expo.dev/build/introduction/) with the project ID defined in `app.json` under `extra.eas.projectId`.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run linting to verify code quality:
   ```bash
   npm run lint
   ```
5. Commit your changes (`git commit -m "Add your feature"`)
6. Push to the branch (`git push origin feature/your-feature`)
7. Open a Pull Request

## License

This project is private and not published under a public license.
