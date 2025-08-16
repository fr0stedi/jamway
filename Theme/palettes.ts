import { Theme } from './types';

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: '#F9F9F9',           // --color-bg
    card: '#FFFFFF',                 // --color-card
    bubble: '#39695C',
    bubbleborder:'#4d8f7dff',
    text: '#fcfcfcff',                  // --color-text
    muted: '#525252',                 // --color-text-muted
    primary: '#E66101',               // --color-primary
    primaryText: '#FFFFFF',
    border: '#E5E5E5',                // --color-border
    tabBarBg: '#FFFFFF',
    tabActive: '#E66101',
    tabInactive: '#525252',
    // Extra for subtle backgrounds
    subtleBg: '#F4F4F5',              // --color-bg-subtle
  },
};

// Optional: dark variant tuned for same accents
export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: '#1A1A1A',
    card: '#262626',
    bubble: '#39695C',
    bubbleborder:'#4d8f7dff',
    text: '#F9F9F9',
    muted: '#A3A3A3',
    primary: '#E66101',
    primaryText: '#FFFFFF',
    border: '#333333',
    tabBarBg: '#262626',
    tabActive: '#E66101',
    tabInactive: '#A3A3A3',
    subtleBg: '#2E2E2E',
  },
};
