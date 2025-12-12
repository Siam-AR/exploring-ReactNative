/**
 * Mini Bangladesh - Theme Configuration (TypeScript)
 * Production-ready design tokens for consistent styling
 */

export interface Colors {
  [x: string]: any;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  accentLight: string;
  accentDark: string;
  whatsapp: string;
  background: string;
  backgroundDark: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textWhite: string;
  border: string;
  borderLight: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  overlay: string;
  overlayLight: string;
}

export interface Typography {
  fontSize: {
    xs: number;
    sm: number;
    base: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
    '6xl': number;
  };
  fontWeight: {
    regular: '400';
    medium: '500';
    semibold: '600';
    bold: '700';
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  base: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
}

export interface BorderRadius {
  sm: number;
  base: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface Shadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface Shadows {
  sm: Shadow;
  md: Shadow;
  lg: Shadow;
  xl: Shadow;
}

export interface Layout {
  containerPadding: number;
  containerPaddingLarge: number;
  cardPadding: number;
  cardPaddingLarge: number;
  screenWidth: number;
  screenHeight: number;
  bottomNavHeight: number;
  headerHeight: number;
}

export const colors: Colors = {
  primary: '#006A4E',
  primaryLight: '#00A876',
  primaryDark: '#004A36',
  accent: '#F42A41',
  accentLight: '#FF5468',
  accentDark: '#D01F35',
  whatsapp: '#25D366',
  background: '#F9FAFB',
  backgroundDark: '#F3F4F6',
  card: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textWhite: '#FFFFFF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

export const typography: Typography = {
  fontSize: {
    xs: 12,
    sm: 13,
    base: 14,
    md: 15,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 26,
    '5xl': 32,
    '6xl': 48,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
};

export const borderRadius: BorderRadius = {
  sm: 8,
  base: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 9999,
};

export const shadows: Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
};

export const layout: Layout = {
  containerPadding: 16,
  containerPaddingLarge: 24,
  cardPadding: 16,
  cardPaddingLarge: 24,
  screenWidth: 390,
  screenHeight: 844,
  bottomNavHeight: 68,
  headerHeight: 56,
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
};
