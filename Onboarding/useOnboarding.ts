import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, AppLanguage, AppRole } from './constants';

export default function useOnboarding() {
  const [loading, setLoading] = useState(true);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const done = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE);
        setShouldShow(!done);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveSelections = useCallback(
    async (lang: AppLanguage, role: AppRole) => {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.LANGUAGE, lang],
        [STORAGE_KEYS.ROLE, role],
      ]);
    },
    []
  );

  const markDone = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, '1');
    setShouldShow(false);
  }, []);

  return { loading, shouldShow, saveSelections, markDone };
}
