import { useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

type Cell = {
  key: string;
  date: Dayjs;
  inCurrentMonth: boolean;
  isToday: boolean;
};

export function useCalendar() {
  const [cursor, setCursor] = useState<Dayjs>(dayjs());
  const [selected, setSelected] = useState<Dayjs | null>(dayjs());

  const monthLabel = cursor.format('MMMM YYYY').toUpperCase();

  const cells: Cell[] = useMemo(() => {
    const startOfMonth = cursor.startOf('month');
    const startWeekday = startOfMonth.day();
    const gridStart = startOfMonth.subtract(startWeekday, 'day');

    return Array.from({ length: 42 }, (_, i) => {
      const d = gridStart.add(i, 'day');
      return {
        key: d.format('YYYY-MM-DD'),
        date: d,
        inCurrentMonth: d.isSame(cursor, 'month'),
        isToday: d.isSame(dayjs(), 'day'),
      };
    });
  }, [cursor]);

  const weeks = useMemo(
    () => Array.from({ length: 6 }, (_, r) => cells.slice(r * 7, r * 7 + 7)),
    [cells]
  );

  return { cursor, setCursor, selected, setSelected, monthLabel, weeks };
}
