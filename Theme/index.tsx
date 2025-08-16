import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Theme, ThemeMode } from './types';
import { darkTheme, lightTheme } from './palettes';

type ThemeContextValue = {
  theme: Theme;
  setMode: (m: ThemeMode) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'APP_THEME_MODE';

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const system = Appearance.getColorScheme(); // 'light' | 'dark' | null
  const [mode, setModeState] = useState<ThemeMode>((system ?? 'dark') as ThemeMode);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') setModeState(saved);
    })();
  }, []);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      // only follow system if user hasn't explicitly set a mode (optional logic)
      // comment this out if you want manual override only
      if (!AsyncStorage.getItem(STORAGE_KEY)) {
        setModeState((colorScheme ?? 'dark') as ThemeMode);
      }
    });
    return () => sub.remove();
  }, []);

  const setMode = async (m: ThemeMode) => {
    setModeState(m);
    await AsyncStorage.setItem(STORAGE_KEY, m);
  };

  const toggleMode = () => setMode(mode === 'dark' ? 'light' : 'dark');

  const theme = useMemo<Theme>(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

  const value = useMemo(() => ({ theme, setMode, toggleMode }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export const useThemeToggle = () => {
  const { toggleMode, setMode } = useTheme();
  return { toggleMode, setMode };
};
