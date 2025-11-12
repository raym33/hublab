import {
  ThemeConfig,
  DEFAULT_THEME,
  PRESET_THEMES,
} from '@/lib/theme-system'

describe('Theme System', () => {
  describe('DEFAULT_THEME', () => {
    it('should have all required color properties', () => {
      expect(DEFAULT_THEME.colors).toHaveProperty('primary')
      expect(DEFAULT_THEME.colors).toHaveProperty('secondary')
      expect(DEFAULT_THEME.colors).toHaveProperty('accent')
      expect(DEFAULT_THEME.colors).toHaveProperty('neutral')
      expect(DEFAULT_THEME.colors).toHaveProperty('success')
      expect(DEFAULT_THEME.colors).toHaveProperty('warning')
      expect(DEFAULT_THEME.colors).toHaveProperty('error')
      expect(DEFAULT_THEME.colors).toHaveProperty('info')
    })

    it('should have valid hex color values', () => {
      const hexColorRegex = /^#[0-9A-F]{6}$/i
      Object.values(DEFAULT_THEME.colors).forEach(color => {
        expect(color).toMatch(hexColorRegex)
      })
    })

    it('should have typography configuration', () => {
      expect(DEFAULT_THEME.typography).toHaveProperty('fontFamily')
      expect(DEFAULT_THEME.typography).toHaveProperty('fontSize')
      expect(DEFAULT_THEME.typography).toHaveProperty('fontWeight')
    })

    it('should have valid font sizes', () => {
      const fontSize = DEFAULT_THEME.typography.fontSize
      expect(fontSize.xs).toBe('0.75rem')
      expect(fontSize.sm).toBe('0.875rem')
      expect(fontSize.base).toBe('1rem')
      expect(fontSize.lg).toBe('1.125rem')
      expect(fontSize.xl).toBe('1.25rem')
    })

    it('should have valid font weights', () => {
      const fontWeight = DEFAULT_THEME.typography.fontWeight
      expect(fontWeight.light).toBe(300)
      expect(fontWeight.normal).toBe(400)
      expect(fontWeight.medium).toBe(500)
      expect(fontWeight.semibold).toBe(600)
      expect(fontWeight.bold).toBe(700)
    })

    it('should have spacing configuration', () => {
      const spacing = DEFAULT_THEME.spacing
      expect(spacing).toHaveProperty('xs')
      expect(spacing).toHaveProperty('sm')
      expect(spacing).toHaveProperty('md')
      expect(spacing).toHaveProperty('lg')
      expect(spacing).toHaveProperty('xl')
    })

    it('should have border radius configuration', () => {
      const borderRadius = DEFAULT_THEME.borderRadius
      expect(borderRadius).toHaveProperty('none')
      expect(borderRadius).toHaveProperty('sm')
      expect(borderRadius).toHaveProperty('md')
      expect(borderRadius).toHaveProperty('lg')
      expect(borderRadius).toHaveProperty('full')
    })

    it('should have shadows configuration', () => {
      const shadows = DEFAULT_THEME.shadows
      expect(shadows).toHaveProperty('sm')
      expect(shadows).toHaveProperty('md')
      expect(shadows).toHaveProperty('lg')
    })
  })

  describe('PRESET_THEMES', () => {
    it('should have all preset themes', () => {
      expect(PRESET_THEMES).toHaveProperty('default')
      expect(PRESET_THEMES).toHaveProperty('dark')
      expect(PRESET_THEMES).toHaveProperty('ocean')
      expect(PRESET_THEMES).toHaveProperty('sunset')
      expect(PRESET_THEMES).toHaveProperty('forest')
      expect(PRESET_THEMES).toHaveProperty('minimal')
    })

    it('should have unique names for each theme', () => {
      const names = Object.values(PRESET_THEMES).map(theme => theme.name)
      const uniqueNames = new Set(names)
      expect(uniqueNames.size).toBe(names.length)
    })

    it('each preset should have the same structure as DEFAULT_THEME', () => {
      Object.values(PRESET_THEMES).forEach(theme => {
        expect(theme).toHaveProperty('name')
        expect(theme).toHaveProperty('colors')
        expect(theme).toHaveProperty('typography')
        expect(theme).toHaveProperty('spacing')
        expect(theme).toHaveProperty('borderRadius')
        expect(theme).toHaveProperty('shadows')
      })
    })
  })

  describe('Type Safety', () => {
    it('should conform to ThemeConfig interface', () => {
      const testTheme: ThemeConfig = {
        name: 'Test',
        colors: {
          primary: '#000000',
          secondary: '#111111',
          accent: '#222222',
          neutral: '#333333',
          success: '#444444',
          warning: '#555555',
          error: '#666666',
          info: '#777777',
        },
        typography: {
          fontFamily: 'Arial',
          fontSize: { base: '1rem' },
          fontWeight: { normal: 400 },
        },
        spacing: { md: '1rem' },
        borderRadius: { md: '0.5rem' },
        shadows: { md: 'none' },
      }

      expect(testTheme).toBeDefined()
    })
  })
})
