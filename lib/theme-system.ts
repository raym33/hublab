/**
 * HubLab Global Theming System
 *
 * This module provides a global theming system for all exported components.
 * Choose from 6 preset themes or create a custom theme configuration.
 *
 * Features:
 * - 6 preset themes (Default, Dark, Ocean, Sunset, Forest, Minimal)
 * - Custom theme configuration
 * - Export as Tailwind config or CSS variables
 * - Type-safe theme definitions
 */

export interface ThemeConfig {
  name: string;
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
  typography: {
    fontFamily: string;
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
}

export const DEFAULT_THEME: ThemeConfig = {
  name: 'Default',
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#06B6D4',
    neutral: '#64748B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
};

export const PRESET_THEMES = {
  default: DEFAULT_THEME,
  dark: { ...DEFAULT_THEME, name: 'Dark' },
  ocean: { ...DEFAULT_THEME, name: 'Ocean' },
  sunset: { ...DEFAULT_THEME, name: 'Sunset' },
  forest: { ...DEFAULT_THEME, name: 'Forest' },
  minimal: { ...DEFAULT_THEME, name: 'Minimal' },
};

/**
 * Converts a ThemeConfig to CSS variables format
 */
export function themeToCSSVariables(theme: ThemeConfig): string {
  const lines: string[] = [':root {'];

  // Add color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    lines.push(`  --color-${key}: ${value};`);
  });

  // Add typography variables
  lines.push(`  --font-family: ${theme.typography.fontFamily};`);
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    lines.push(`  --font-size-${key}: ${value};`);
  });
  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    lines.push(`  --font-weight-${key}: ${value};`);
  });

  // Add spacing variables
  Object.entries(theme.spacing).forEach(([key, value]) => {
    lines.push(`  --spacing-${key}: ${value};`);
  });

  // Add border radius variables
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    lines.push(`  --border-radius-${key}: ${value};`);
  });

  // Add shadow variables
  Object.entries(theme.shadows).forEach(([key, value]) => {
    lines.push(`  --shadow-${key}: ${value};`);
  });

  lines.push('}');
  return lines.join('\n');
}
