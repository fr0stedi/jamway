// theme/types.ts
export type ThemeMode = 'light' | 'dark';

export type Theme = {
  mode: ThemeMode;
  colors: {
    background: string;
    card: string;
    bubble: string;
    bubbleborder: string;
    text: string;
    muted: string;
    primary: string;
    primaryText: string;
    border: string;
    tabBarBg: string;
    tabActive: string;
    tabInactive: string;
    subtleBg: string;
  };
};
