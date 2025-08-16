import { useMemo } from 'react';

export default function useTimeOptions() {
  return useMemo(() => {
    const list: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hh = String(h).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        list.push(`${hh}:${mm}`);
      }
    }
    return list;
  }, []);
}
