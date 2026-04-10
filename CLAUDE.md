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

Organized by domain: `auth/`, `dashboard/`, `properties/`, `tenants/`, `contracts/`, `reports/`. All screens fetch live data from the deployed API via `src/services/api.ts`. State is managed through React Context (`AppContext`).

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

#### Properties & Tenants — Long-Press Delete
Both `PropertiesListScreen` and `TenantsListScreen` support deletion via long-press on a card. A confirmation `Alert` is shown; on confirm the corresponding API endpoint (`DELETE /properties/:id` or `DELETE /tenants/:id`) is called and the list is refreshed.

### API Layer (`src/services/api.ts`)

Centralised API service for all server communication.

- **Base URL:** `https://estate-ledger-server.onrender.com/api/v1` (hardcoded — see Known Issues)
- **Token management:** In-memory `_token` variable with `setToken()` / `getToken()` accessors. The token is set on login and cleared on logout.
- **`apiFetch<T>(path, options)`** — Base fetch wrapper that adds `Content-Type: application/json` and `Authorization: Bearer <token>` headers, parses the JSON response, and throws on non-2xx status codes.
- **`buildQuery(params)`** — Builds URL query strings from a params object, filtering out undefined/empty values.
- **`derivePaymentStatus(p)`** — Maps API payment fields (`isVoided`, `paidDate`, `dueDate`) to UI status enum: `'paid' | 'overdue' | 'upcoming' | 'voided'`.

**Endpoint groups:**

| Group | Functions |
|---|---|
| Auth | `loginApi` |
| Properties | `getProperties`, `getPropertyById`, `createProperty`, `deleteProperty` |
| Tenants | `getTenants`, `createTenant`, `deleteTenant` |
| Contracts | `getContracts`, `getContractById`, `createContract`, `terminateContract` |
| Payments | `getPayments`, `collectPayment` |
| Reports | `getReportSummary`, `getReportMonthly`, `getReportBreakdown` |

### Constants (`src/data/index.ts`)

Exports `PAYMENT_INTERVAL_OPTIONS` — the list of payment interval choices (`Monthly`, `Quarterly`, `Semi-Annually`, `Annually`) used by `CreateContractScreen`.

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
| `token` | `string \| null` | Current auth JWT |
| `user` | `{ name, email } \| null` | Logged-in user info |
| `login` | `(email, password) => Promise<void>` | Authenticate and store token |
| `logout` | `() => void` | Clear token and user state |

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
| React Context API (built-in) | Global state — theme + locale + auth |
| `I18nManager` (RN built-in) | RTL layout flip for Arabic |
| `fetch` (built-in) | API calls to deployed server (`estate-ledger-server.onrender.com`) |

### Known Issues

#### Security
- **Hardcoded API URL** — Production URL is hardcoded in `api.ts`; should use environment variables (`EXPO_PUBLIC_API_URL`) for multi-environment builds
- **In-memory-only token** — Auth token is stored in a module-level variable; lost on app restart and not encrypted. Should use `expo-secure-store` for persistent secure storage
- **No 401 handling** — Expired tokens cause generic errors; `apiFetch` should detect 401 responses, clear the token, and redirect to login
- **Silent error swallowing** — Multiple screens use `.catch(() => {})`, hiding errors. Should at minimum log to console
- **Minimal input validation** — Login only checks non-empty fields (no email format). Create screens lack length limits and numeric validation

#### Performance
- **No list virtualization** — `PropertiesListScreen`, `TenantsListScreen`, and `ContractsListScreen` use `ScrollView` + `.map()` instead of `FlatList`
- **Missing `useMemo`** — `statusConfig` objects are recreated every render in 4+ screens; `payStatusConfig` in DashboardScreen and `totalValue` in ContractPaymentsScreen also lack memoization
- **Large monolithic DashboardScreen** — ~1000 lines handling data fetching, menus, language, dark mode, and cards; should be split into sub-components
- **No request cancellation** — No `AbortController` usage; unmounted components may attempt state updates after navigation
