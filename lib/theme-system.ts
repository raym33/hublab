/**
 * Global Theme System for HubLab
 *
 * This system allows users to:
 * 1. Define a theme once (colors, fonts, spacing)
 * 2. Apply it to all exported components automatically
 * 3. Export theme-aware code
 */

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeTypography {
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Default HubLab theme
export const DEFAULT_THEME: ThemeConfig = {
  colors: {
    primary: '#3B82F6',      // Blue
    secondary: '#8B5CF6',     // Purple
    accent: '#F59E0B',        // Amber
    neutral: '#6B7280',       // Gray
    success: '#10B981',       // Green
    warning: '#F59E0B',       // Yellow
    error: '#EF4444',         // Red
    info: '#3B82F6',          // Blue
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      serif: 'Georgia, serif',
      mono: 'Monaco, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
};

// Preset themes
export const PRESET_THEMES: Record<string, ThemeConfig> = {
  default: DEFAULT_THEME,

  dark: {
    ...DEFAULT_THEME,
    colors: {
      primary: '#60A5FA',
      secondary: '#A78BFA',
      accent: '#FBBF24',
      neutral: '#9CA3AF',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA',
    },
  },

  ocean: {
    ...DEFAULT_THEME,
    colors: {
      primary: '#0EA5E9',      // Sky blue
      secondary: '#06B6D4',     // Cyan
      accent: '#14B8A6',        // Teal
      neutral: '#64748B',       // Slate
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#0EA5E9',
    },
  },

  sunset: {
    ...DEFAULT_THEME,
    colors: {
      primary: '#F97316',      // Orange
      secondary: '#EC4899',     // Pink
      accent: '#FBBF24',        // Yellow
      neutral: '#78716C',       // Stone
      success: '#10B981',
      warning: '#F59E0B',
      error: '#DC2626',
      info: '#3B82F6',
    },
  },

  forest: {
    ...DEFAULT_THEME,
    colors: {
      primary: '#16A34A',      // Green
      secondary: '#059669',     // Emerald
      accent: '#84CC16',        // Lime
      neutral: '#57534E',       // Warm gray
      success: '#22C55E',
      warning: '#EAB308',
      error: '#DC2626',
      info: '#0EA5E9',
    },
  },

  minimal: {
    ...DEFAULT_THEME,
    colors: {
      primary: '#18181B',      // Zinc
      secondary: '#52525B',     // Zinc
      accent: '#A1A1AA',        // Zinc
      neutral: '#71717A',       // Zinc
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },
};

/**
 * Convert theme config to Tailwind CSS variables
 */
export function themeToTailwindConfig(theme: ThemeConfig): string {
  return `
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${theme.colors.primary}',
        secondary: '${theme.colors.secondary}',
        accent: '${theme.colors.accent}',
        neutral: '${theme.colors.neutral}',
        success: '${theme.colors.success}',
        warning: '${theme.colors.warning}',
        error: '${theme.colors.error}',
        info: '${theme.colors.info}',
      },
      fontFamily: {
        sans: ['${theme.typography.fontFamily.sans}'],
        serif: ['${theme.typography.fontFamily.serif}'],
        mono: ['${theme.typography.fontFamily.mono}'],
      },
      fontSize: ${JSON.stringify(theme.typography.fontSize, null, 2)},
      spacing: ${JSON.stringify(theme.spacing, null, 2)},
      borderRadius: ${JSON.stringify(theme.borderRadius, null, 2)},
      boxShadow: ${JSON.stringify(theme.shadows, null, 2)},
    },
  },
}
  `.trim();
}

/**
 * Convert theme to CSS custom properties
 */
export function themeToCSSVariables(theme: ThemeConfig): string {
  return `
:root {
  /* Colors */
  --color-primary: ${theme.colors.primary};
  --color-secondary: ${theme.colors.secondary};
  --color-accent: ${theme.colors.accent};
  --color-neutral: ${theme.colors.neutral};
  --color-success: ${theme.colors.success};
  --color-warning: ${theme.colors.warning};
  --color-error: ${theme.colors.error};
  --color-info: ${theme.colors.info};

  /* Typography */
  --font-sans: ${theme.typography.fontFamily.sans};
  --font-serif: ${theme.typography.fontFamily.serif};
  --font-mono: ${theme.typography.fontFamily.mono};

  /* Spacing */
  --spacing-xs: ${theme.spacing.xs};
  --spacing-sm: ${theme.spacing.sm};
  --spacing-md: ${theme.spacing.md};
  --spacing-lg: ${theme.spacing.lg};
  --spacing-xl: ${theme.spacing.xl};
  --spacing-2xl: ${theme.spacing['2xl']};

  /* Border Radius */
  --radius-sm: ${theme.borderRadius.sm};
  --radius-md: ${theme.borderRadius.md};
  --radius-lg: ${theme.borderRadius.lg};
  --radius-full: ${theme.borderRadius.full};

  /* Shadows */
  --shadow-sm: ${theme.shadows.sm};
  --shadow-md: ${theme.shadows.md};
  --shadow-lg: ${theme.shadows.lg};
  --shadow-xl: ${theme.shadows.xl};
}
  `.trim();
}

/**
 * Map Tailwind classes to theme-aware classes
 */
export function applyThemeToClasses(
  className: string,
  theme: ThemeConfig
): string {
  const classMap: Record<string, string> = {
    'bg-blue-500': `bg-[${theme.colors.primary}]`,
    'bg-blue-600': `bg-[${theme.colors.primary}]`,
    'text-blue-500': `text-[${theme.colors.primary}]`,
    'text-blue-600': `text-[${theme.colors.primary}]`,
    'border-blue-500': `border-[${theme.colors.primary}]`,

    'bg-purple-500': `bg-[${theme.colors.secondary}]`,
    'bg-purple-600': `bg-[${theme.colors.secondary}]`,
    'text-purple-500': `text-[${theme.colors.secondary}]`,

    'bg-green-500': `bg-[${theme.colors.success}]`,
    'bg-green-600': `bg-[${theme.colors.success}]`,
    'text-green-500': `text-[${theme.colors.success}]`,
    'text-green-600': `text-[${theme.colors.success}]`,

    'bg-red-500': `bg-[${theme.colors.error}]`,
    'bg-red-600': `bg-[${theme.colors.error}]`,
    'text-red-500': `text-[${theme.colors.error}]`,
    'text-red-600': `text-[${theme.colors.error}]`,

    'bg-yellow-500': `bg-[${theme.colors.warning}]`,
    'text-yellow-500': `text-[${theme.colors.warning}]`,
  };

  const classes = className.split(' ');
  return classes
    .map(cls => classMap[cls] || cls)
    .join(' ');
}

/**
 * Generate React ThemeProvider component
 */
export function generateThemeProvider(theme: ThemeConfig): string {
  return `
import React, { createContext, useContext, ReactNode } from 'react';

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = React.useState<ThemeConfig>(${JSON.stringify(theme, null, 2)});

  React.useEffect(() => {
    // Apply CSS variables
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-success', theme.colors.success);
    root.style.setProperty('--color-warning', theme.colors.warning);
    root.style.setProperty('--color-error', theme.colors.error);
    root.style.setProperty('--color-info', theme.colors.info);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}
  `.trim();
}

/**
 * Validate theme configuration
 */
export function validateTheme(theme: Partial<ThemeConfig>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate colors
  if (theme.colors) {
    const colorKeys = ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info'];
    for (const key of colorKeys) {
      const color = theme.colors[key as keyof ThemeColors];
      if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
        errors.push(`Invalid color format for ${key}: ${color}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Merge theme with defaults
 */
export function mergeTheme(
  customTheme: Partial<ThemeConfig>
): ThemeConfig {
  return {
    colors: { ...DEFAULT_THEME.colors, ...customTheme.colors },
    typography: {
      fontFamily: { ...DEFAULT_THEME.typography.fontFamily, ...customTheme.typography?.fontFamily },
      fontSize: { ...DEFAULT_THEME.typography.fontSize, ...customTheme.typography?.fontSize },
    },
    spacing: { ...DEFAULT_THEME.spacing, ...customTheme.spacing },
    borderRadius: { ...DEFAULT_THEME.borderRadius, ...customTheme.borderRadius },
    shadows: { ...DEFAULT_THEME.shadows, ...customTheme.shadows },
  };
}
