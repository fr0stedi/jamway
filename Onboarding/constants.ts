export const STORAGE_KEYS = {
  ONBOARDING_DONE: 'onboarding_done',
  LANGUAGE: 'onboarding_language',
  ROLE: 'onboarding_role',
} as const;

export type AppLanguage = 'fi' | 'sv' | 'en';
export type AppRole = 'listener' | 'artist';
