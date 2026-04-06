import { Colors } from './colors';

export const DarkColors: typeof Colors = {
  // Primary — light teal on dark background
  primary: '#aecccc',
  primaryContainer: '#304b4b',
  primaryFixed: '#2a4d4d',
  primaryFixedDim: '#1e3838',
  onPrimary: '#032121',
  onPrimaryContainer: '#cae8e8',
  onPrimaryFixed: '#cae8e8',
  onPrimaryFixedVariant: '#aecccc',
  inversePrimary: '#032121',

  // Secondary
  secondary: '#68dba9',
  secondaryContainer: '#005137',
  secondaryFixed: '#85f8c4',
  secondaryFixedDim: '#68dba9',
  onSecondary: '#002114',
  onSecondaryContainer: '#85f8c4',
  onSecondaryFixed: '#002114',
  onSecondaryFixedVariant: '#005137',

  // Tertiary
  tertiary: '#ffb77d',
  tertiaryContainer: '#6e3900',
  tertiaryFixed: '#ffdcc3',
  tertiaryFixedDim: '#ffb77d',
  onTertiary: '#2f1500',
  onTertiaryContainer: '#ffdcc3',
  onTertiaryFixed: '#2f1500',
  onTertiaryFixedVariant: '#6e3900',

  // Surface
  surface: '#0f1923',
  surfaceBright: '#1e2a38',
  surfaceDim: '#0f1923',
  surfaceVariant: '#2a353f',
  surfaceContainer: '#182330',
  surfaceContainerHigh: '#1e2c3a',
  surfaceContainerHighest: '#253342',
  surfaceContainerLow: '#141e2b',
  surfaceContainerLowest: '#0a1520',
  surfaceTint: '#aecccc',
  inverseOnSurface: '#121c2a',
  inverseSurface: '#d0dbed',

  // On Surface
  onSurface: '#dce6f4',
  onSurfaceVariant: '#bbc8c7',
  onBackground: '#dce6f4',
  background: '#0f1923',

  // Error
  error: '#ffb4ab',
  errorContainer: '#93000a',
  onError: '#690005',
  onErrorContainer: '#ffdad6',

  // Outline
  outline: '#8a9393',
  outlineVariant: '#3f4948',

  // Gradients
  signatureGradient: ['#1a3636', '#304b4b'] as string[],
} as const as typeof Colors;
