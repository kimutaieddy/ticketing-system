// 🎨 ULTRA-ADVANCED THEME SYSTEM
// Revolutionary design system with dynamic theming and accessibility

import { useColorScheme } from 'react-native';
import { useThemeStore } from '../store';

// 🌈 Color palettes
const lightColors = {
  // Primary colors
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  
  // Secondary colors
  secondary: '#8B5CF6',
  secondaryLight: '#A78BFA',
  secondaryDark: '#7C3AED',
  
  // Accent colors
  accent: '#F59E0B',
  accentLight: '#FCD34D',
  accentDark: '#D97706',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F8FAFC',
  backgroundTertiary: '#F1F5F9',
  
  // Surface colors
  surface: '#FFFFFF',
  surfaceSecondary: '#F8FAFC',
  surfaceTertiary: '#E2E8F0',
  
  // Text colors
  text: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // Status colors
  success: '#10B981',
  successLight: '#34D399',
  successDark: '#047857',
  
  warning: '#F59E0B',
  warningLight: '#FCD34D',
  warningDark: '#D97706',
  
  error: '#EF4444',
  errorLight: '#F87171',
  errorDark: '#DC2626',
  
  info: '#3B82F6',
  infoLight: '#60A5FA',
  infoDark: '#2563EB',
  
  // Border colors
  border: '#E5E7EB',
  borderSecondary: '#D1D5DB',
  borderTertiary: '#9CA3AF',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.25)',
  overlayDark: 'rgba(0, 0, 0, 0.75)',
};

const darkColors = {
  // Primary colors
  primary: '#818CF8',
  primaryLight: '#A5B4FC',
  primaryDark: '#6366F1',
  
  // Secondary colors
  secondary: '#A78BFA',
  secondaryLight: '#C4B5FD',
  secondaryDark: '#8B5CF6',
  
  // Accent colors
  accent: '#FCD34D',
  accentLight: '#FDE68A',
  accentDark: '#F59E0B',
  
  // Background colors
  background: '#0F172A',
  backgroundSecondary: '#1E293B',
  backgroundTertiary: '#334155',
  
  // Surface colors
  surface: '#1E293B',
  surfaceSecondary: '#334155',
  surfaceTertiary: '#475569',
  
  // Text colors
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  textInverse: '#1F2937',
  
  // Status colors
  success: '#34D399',
  successLight: '#6EE7B7',
  successDark: '#10B981',
  
  warning: '#FCD34D',
  warningLight: '#FDE68A',
  warningDark: '#F59E0B',
  
  error: '#F87171',
  errorLight: '#FCA5A5',
  errorDark: '#EF4444',
  
  info: '#60A5FA',
  infoLight: '#93C5FD',
  infoDark: '#3B82F6',
  
  // Border colors
  border: '#475569',
  borderSecondary: '#64748B',
  borderTertiary: '#94A3B8',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.9)',
};

// 🎭 Typography system
export const typography = {
  // Headlines
  h1: {
    fontSize: 32,
    fontWeight: '800' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.25,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    letterSpacing: 0,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: 0,
  },
  h5: {
    fontSize: 18,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  h6: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 22,
    letterSpacing: 0,
  },
  
  // Body text
  body1: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
  
  // Captions
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  
  // Buttons
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 18,
    letterSpacing: 0.25,
  },
  
  // Labels
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
};

// 📐 Spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// 🔲 Border radius system
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// 🌊 Shadow system
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
  },
};

// 🎨 Gradient system
export const gradients = {
  primary: ['#6366F1', '#8B5CF6'],
  secondary: ['#8B5CF6', '#EC4899'],
  accent: ['#F59E0B', '#EF4444'],
  success: ['#10B981', '#059669'],
  ocean: ['#0EA5E9', '#06B6D4'],
  sunset: ['#F97316', '#EF4444'],
  forest: ['#22C55E', '#16A34A'],
  purple: ['#8B5CF6', '#3B82F6'],
  rainbow: ['#6366F1', '#8B5CF6', '#EC4899', '#EF4444'],
};

// 🎯 Animation timings
export const animations = {
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 700,
  slowest: 1000,
};

// 🎪 Easing curves
export const easings = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  bounce: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
};

// 🌟 Theme hook
export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const { currentTheme, animations: animationsEnabled, hapticFeedback } = useThemeStore();
  
  // Determine effective theme
  const effectiveTheme = currentTheme === 'auto' ? systemColorScheme || 'light' : currentTheme;
  const isDark = effectiveTheme === 'dark';
  
  // Get colors based on theme
  const colors = isDark ? darkColors : lightColors;
  
  return {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows: isDark ? {
      ...shadows,
      sm: { ...shadows.sm, shadowColor: '#000', shadowOpacity: 0.3 },
      md: { ...shadows.md, shadowColor: '#000', shadowOpacity: 0.4 },
      lg: { ...shadows.lg, shadowColor: '#000', shadowOpacity: 0.5 },
      xl: { ...shadows.xl, shadowColor: '#000', shadowOpacity: 0.6 },
    } : shadows,
    gradients,
    animations,
    easings,
    isDark,
    theme: effectiveTheme,
    animationsEnabled,
    hapticFeedback,
  };
};

// 🎨 Theme utilities
export const createStyleSheet = (styleCreator: (theme: ReturnType<typeof useTheme>) => any) => {
  return (theme: ReturnType<typeof useTheme>) => styleCreator(theme);
};

export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getContrastColor = (backgroundColor: string): string => {
  // Simple contrast calculation
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};
