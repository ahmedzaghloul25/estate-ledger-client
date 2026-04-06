export const Colors = {
  // Primary
  primary: '#032121',
  primaryContainer: '#fbfcfb',
  primaryFixed: '#cae8e8',
  primaryFixedDim: '#aecccc',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#829f9f',
  onPrimaryFixed: '#022020',
  onPrimaryFixedVariant: '#304b4b',
  inversePrimary: '#aecccc',

  // Secondary
  secondary: '#006c4a',
  secondaryContainer: '#82f5c1',
  secondaryFixed: '#85f8c4',
  secondaryFixedDim: '#68dba9',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#00714e',
  onSecondaryFixed: '#002114',
  onSecondaryFixedVariant: '#005137',

  // Tertiary
  tertiary: '#301600',
  tertiaryContainer: '#4f2700',
  tertiaryFixed: '#ffdcc3',
  tertiaryFixedDim: '#ffb77d',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#e48015',
  onTertiaryFixed: '#2f1500',
  onTertiaryFixedVariant: '#6e3900',

  // Surface
  surface: '#f8f9ff',
  surfaceBright: '#f8f9ff',
  surfaceDim: '#d0dbed',
  surfaceVariant: '#d9e3f6',
  surfaceContainer: '#e6eeff',
  surfaceContainerHigh: '#dee9fc',
  surfaceContainerHighest: '#d9e3f6',
  surfaceContainerLow: '#eff4ff',
  surfaceContainerLowest: '#ffffff',
  surfaceTint: '#476363',
  inverseOnSurface: '#eaf1ff',
  inverseSurface: '#27313f',

  // On Surface
  onSurface: '#121c2a',
  onSurfaceVariant: '#414848',
  onBackground: '#121c2a',
  background: '#f8f9ff',

  // Error
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onError: '#ffffff',
  onErrorContainer: '#93000a',

  // Outline
  outline: '#727878',
  outlineVariant: '#c1c8c7',

  // Gradients (as arrays for LinearGradient)
  signatureGradient: ['#032121', '#1a3636'] as string[],
} as const;

export type ColorKey = keyof typeof Colors;
