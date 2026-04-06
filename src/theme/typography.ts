import { TextStyle } from 'react-native';

export const FontFamily = {
  manrope: 'Manrope_400Regular',
  manropeSemiBold: 'Manrope_600SemiBold',
  manropeBold: 'Manrope_700Bold',
  manropeExtraBold: 'Manrope_800ExtraBold',
  inter: 'Inter_400Regular',
  interMedium: 'Inter_500Medium',
  interSemiBold: 'Inter_600SemiBold',
} as const;

export const Typography = {
  displayLg: {
    fontFamily: FontFamily.manropeExtraBold,
    fontSize: 57,
    lineHeight: 64,
    letterSpacing: -0.25,
  } as TextStyle,
  displayMd: {
    fontFamily: FontFamily.manropeExtraBold,
    fontSize: 45,
    lineHeight: 52,
  } as TextStyle,
  displaySm: {
    fontFamily: FontFamily.manropeBold,
    fontSize: 36,
    lineHeight: 44,
  } as TextStyle,
  headlineLg: {
    fontFamily: FontFamily.manropeBold,
    fontSize: 32,
    lineHeight: 40,
  } as TextStyle,
  headlineMd: {
    fontFamily: FontFamily.manropeBold,
    fontSize: 28,
    lineHeight: 36,
  } as TextStyle,
  headlineSm: {
    fontFamily: FontFamily.manropeBold,
    fontSize: 24,
    lineHeight: 32,
  } as TextStyle,
  titleLg: {
    fontFamily: FontFamily.manropeSemiBold,
    fontSize: 22,
    lineHeight: 28,
  } as TextStyle,
  titleMd: {
    fontFamily: FontFamily.manropeSemiBold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  } as TextStyle,
  titleSm: {
    fontFamily: FontFamily.manropeSemiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,
  bodyLg: {
    fontFamily: FontFamily.inter,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  } as TextStyle,
  bodyMd: {
    fontFamily: FontFamily.inter,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  } as TextStyle,
  bodySm: {
    fontFamily: FontFamily.inter,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  } as TextStyle,
  labelLg: {
    fontFamily: FontFamily.interMedium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,
  labelMd: {
    fontFamily: FontFamily.interMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  } as TextStyle,
  labelSm: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 0.5,
  } as TextStyle,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  xxl: 16,
  xxxl: 24,
  full: 999,
} as const;
