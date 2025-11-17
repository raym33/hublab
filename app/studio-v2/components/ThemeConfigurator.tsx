'use client';

import React, { useState } from 'react';
import {
  ThemeConfig,
  DEFAULT_THEME,
  PRESET_THEMES,
  themeToTailwindConfig,
  themeToCSSVariables,
  validateTheme,
} from '@/lib/theme-system';

interface ThemeConfiguratorProps {
  currentTheme: ThemeConfig;
  onThemeChange: (theme: ThemeConfig) => void;
}

export function ThemeConfigurator({ currentTheme, onThemeChange }: ThemeConfiguratorProps) {
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof PRESET_THEMES>('default');
  const [showExport, setShowExport] = useState(false);

  const handlePresetChange = (presetName: keyof typeof PRESET_THEMES) => {
    setSelectedPreset(presetName);
    onThemeChange(PRESET_THEMES[presetName]);
  };

  const handleColorChange = (colorKey: keyof ThemeConfig['colors'], value: string) => {
    const newTheme = {
      ...currentTheme,
      colors: {
        ...currentTheme.colors,
        [colorKey]: value,
      },
    };

    const validation = validateTheme(newTheme);
    if (validation.valid) {
      onThemeChange(newTheme);
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 w-80 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Theme Settings</h2>
        <p className="text-sm text-gray-600 mt-1">
          Customize your design system
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Preset Themes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preset Themes
          </label>
          <select
            value={selectedPreset}
            onChange={(e) => handlePresetChange(e.target.value as keyof typeof PRESET_THEMES)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Default</option>
            <option value="dark">Dark Mode</option>
            <option value="ocean">Ocean</option>
            <option value="sunset">Sunset</option>
            <option value="forest">Forest</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>

        {/* Color Customization */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Colors</h3>
          <div className="space-y-3">
            {Object.entries(currentTheme.colors).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <label className="text-sm text-gray-600 w-24 capitalize">
                  {key}
                </label>
                <input
                  type="color"
                  value={value}
                  onChange={(e) =>
                    handleColorChange(key as keyof ThemeConfig['colors'], e.target.value)
                  }
                  className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    handleColorChange(key as keyof ThemeConfig['colors'], e.target.value)
                  }
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
          <div className="space-y-2">
            <button
              className="w-full py-2 px-4 rounded font-medium transition"
              style={{ backgroundColor: currentTheme.colors.primary, color: 'white' }}
            >
              Primary Button
            </button>
            <button
              className="w-full py-2 px-4 rounded font-medium transition"
              style={{ backgroundColor: currentTheme.colors.secondary, color: 'white' }}
            >
              Secondary Button
            </button>
            <div
              className="p-3 rounded"
              style={{ backgroundColor: currentTheme.colors.success + '20', color: currentTheme.colors.success }}
            >
              ✓ Success Alert
            </div>
            <div
              className="p-3 rounded"
              style={{ backgroundColor: currentTheme.colors.error + '20', color: currentTheme.colors.error }}
            >
              ✕ Error Alert
            </div>
          </div>
        </div>

        {/* Export Theme */}
        <div>
          <button
            onClick={() => setShowExport(!showExport)}
            className="w-full py-2 px-4 bg-gray-900 text-white rounded font-medium hover:bg-gray-800 transition"
          >
            {showExport ? 'Hide' : 'Export'} Theme Config
          </button>

          {showExport && (
            <div className="mt-3 space-y-3">
              {/* Tailwind Config */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tailwind Config
                </label>
                <div className="relative">
                  <pre className="p-3 bg-gray-900 text-gray-100 rounded text-xs overflow-x-auto max-h-40">
                    {JSON.stringify(themeToTailwindConfig(currentTheme), null, 2)}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(themeToTailwindConfig(currentTheme), null, 2));
                    }}
                    className="absolute top-2 right-2 px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* CSS Variables */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  CSS Variables
                </label>
                <div className="relative">
                  <pre className="p-3 bg-gray-900 text-gray-100 rounded text-xs overflow-x-auto max-h-40">
                    {themeToCSSVariables(currentTheme)}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(themeToCSSVariables(currentTheme));
                    }}
                    className="absolute top-2 right-2 px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* JSON */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  JSON
                </label>
                <div className="relative">
                  <pre className="p-3 bg-gray-900 text-gray-100 rounded text-xs overflow-x-auto max-h-40">
                    {JSON.stringify(currentTheme, null, 2)}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(currentTheme, null, 2));
                    }}
                    className="absolute top-2 right-2 px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            setSelectedPreset('default');
            onThemeChange(DEFAULT_THEME);
          }}
          className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 transition"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}
