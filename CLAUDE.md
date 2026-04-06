# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start the Expo dev server (opens QR code + browser)
npm start

# Run on specific platforms
npm run android   # Launch Android emulator
npm run ios       # Launch iOS simulator
npm run web       # Open in browser
```

There are no lint or test scripts configured yet.

## Architecture

This is a React Native + Expo app (TypeScript, strict mode) for managing rental properties — tracking properties, tenants, contracts, and payments.

### Entry & Bootstrap

- `index.ts` → registers root with Expo
- `App.tsx` → loads Google Fonts (Manrope, Inter), wraps `<AppNavigator>` in `<AppProvider>`

### Navigation (`src/navigation/index.tsx`)

Two root-level stacks managed by a single `NavigationContainer`:

- **Auth stack**: `LoginScreen`
- **Main stack**: Bottom tab navigator with 5 tabs, plus nested native stacks:
  - `PropertiesStack`: `PropertiesListScreen` → `PropertyDetailScreen`
  - `ContractsStack`: `ContractsListScreen` → `ContractPaymentsScreen` + `CreateContractScreen`

Navigation is fully typed with TypeScript param lists (`RootStackParamList`, `MainTabParamList`, etc.) defined at the top of the navigation file.

### Screens (`src/screens/`)

Organized by domain: `auth/`, `dashboard/`, `properties/`, `tenants/`, `contracts/`, `reports/`. All screens use mock/static data inline — there is no API layer or state management library yet.

#### Dashboard Avatar Menu
Tapping the `SC` avatar in the Dashboard header opens a modal dropdown with:
- **Language** — English / Arabic pill selector
- **Dark Mode** — toggle pill (ON/OFF)
- **Logout** — navigates back to Auth stack via `navigation.reset`

#### Contracts — Early Termination
The `ContractPaymentsScreen` supports early termination of an active contract:
- A **"Terminate Contract"** button (styled `errorContainer`) sits between the summary card and the payment history list.
- Tapping it shows a confirmation `Alert` with destructive confirm.
- On confirm: `isTerminated` state flips to `true`; all `upcoming` and `overdue` payments in the local list are set to `'voided'`.
- The button is replaced by a greyed-out **"CONTRACT TERMINATED"** banner.
- Voided payments render with a muted grey badge (`surfaceContainerLow` / `onSurfaceVariant`).
- `ContractsListScreen` `statusConfig` includes a `terminated` key (same error colours as `expired`, distinct label).

Contract status enum: `'active' | 'expiring' | 'expired' | 'terminated'`
Payment status enum: `'paid' | 'upcoming' | 'overdue' | 'voided'`

#### Dashboard Active Rentals List
Only contracts with `contractStatus === 'active'` are shown. Each card has two sections:

**Above the divider**
- Row 1: property thumbnail + name + ⋮ menu button
- Row 2: tenant name (left) + contract end badge (right)
  - Badge background: `surfaceContainerLow` (normal) or `tertiaryFixed` (warning, ≤ 2 months to expiry)
  - Warning text uses `onTertiaryFixed` for contrast on the peach background

**Below the divider**
- Due date label + value (left), pay status badge, rent amount (right)

Date parsing is handled by `parseContractDate(dateStr)` and `isExpiringSoon(contractEnd)` — module-level helpers in `DashboardScreen.tsx` that parse the `"DD MMM YYYY"` format used in the mock data.

### Theme (`src/theme/`)

Centralised design system exported from `src/theme/index.ts`:
- `colors.ts` — Material Design 3 light palette (primary, secondary, tertiary, surface, error tokens)
- `darkColors.ts` — Material Design 3 dark palette (same token names, dark values)
- `typography.ts` — type scale (Display → Label), font families, spacing scale, border radius constants

**Never use the static `Colors` export inside component files.** Instead call `useColors()` inside the component:

```ts
import { useColors } from '../../theme';

// Inside the component:
const Colors = useColors();
const styles = useMemo(() => makeStyles(Colors), [Colors]);
```

Then define styles as a factory function at module level:

```ts
function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { backgroundColor: C.background },
    // ...
  });
}
```

The static `Colors` export is reserved for `App.tsx`'s font-loading spinner (which runs before any hook can be called).

### Global State (`src/context/AppContext.tsx`)

A single `AppProvider` (in `App.tsx`) exposes:

| Value | Type | Description |
|---|---|---|
| `isDarkMode` | `boolean` | Active theme (light/dark) |
| `toggleDarkMode` | `() => void` | Flip dark mode |
| `language` | `'en' \| 'ar'` | Active locale |
| `setLanguage` | `(lang) => void` | Switch locale + trigger `I18nManager.forceRTL` |
| `isRTL` | `boolean` | Convenience alias for `language === 'ar'` |
| `t` | `(key: TranslationKey) => string` | Translate a string key |

Consume via:
```ts
import { useAppContext } from '../../context/AppContext';
const { isDarkMode, toggleDarkMode, t } = useAppContext();
```

### i18n (`src/i18n/translations.ts`)

All UI string literals are keyed in flat `en` / `ar` dictionaries. Keys follow the pattern `<screen>.<label>` (e.g. `dashboard.activeRentals`, `menu.logout`).

**RTL note:** `I18nManager.forceRTL(true)` is called when Arabic is selected, but the layout flip only takes effect after an app reload. The user is shown a localized alert explaining this.

Both `en` and `ar` dictionaries must stay in sync for every key. The `ar` object is typed as `typeof en` to enforce this at compile time.

### Key Dependencies

| Package | Purpose |
|---|---|
| `expo ~54` | Build tooling, font loading, status bar |
| `react-native 0.81` | Core framework (New Architecture enabled) |
| `@react-navigation/native-stack` + `bottom-tabs` | Navigation |
| `@expo-google-fonts/manrope` + `inter` | Typography |
| React Context API (built-in) | Global state — theme + locale, no external library needed |
| `I18nManager` (RN built-in) | RTL layout flip for Arabic |
