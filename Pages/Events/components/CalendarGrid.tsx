import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import dayjs, { Dayjs } from 'dayjs';
import { useTheme } from '../../../Theme';

const DAY_BOX = 48;

type Cell = {
  key: string;
  date: Dayjs;
  inCurrentMonth: boolean;
  isToday: boolean;
};

type Props = {
  weeks: Cell[][];
  selected: Dayjs | null;
  onSelect: (date: Dayjs, inCurrentMonth: boolean) => void;
  hasEvent: (d: Dayjs) => boolean;
};

export default function CalendarGrid({ weeks, selected, onSelect, hasEvent }: Props) {
  const { theme } = useTheme();
  const s = getStyles(theme);

  const isSelected = (d: Dayjs) => selected?.isSame(d, 'day');

  return (
    <>
      {/* Weekday row */}
      <View style={s.weekRow}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((w, idx) => (
          <Text key={`weekday-${idx}`} style={s.weekday}>
            {w}
          </Text>
        ))}
      </View>

      {/* Weeks */}
      <View style={s.weeks}>
        {weeks.map((week, i) => (
          <View key={`w-${i}`} style={s.weekLine}>
            {week.map(cell => {
              const inMonth = cell.inCurrentMonth;
              const today = cell.isToday;
              const selectedDay = isSelected(cell.date);
              const showEventDot = hasEvent(cell.date) && !selectedDay;

              return (
                <TouchableOpacity
                  key={cell.key}
                  style={s.dayCell}
                  activeOpacity={0.7}
                  onPress={() => onSelect(cell.date, inMonth)}
                >
                  <View
                    style={[
                      s.dayBox,
                      today && !selectedDay && s.todayBox,
                      selectedDay && s.selectedBox,
                    ]}
                  >
                    <Text
                      style={[
                        s.dayNum,
                        !inMonth && s.outsideMonthNum,
                        selectedDay && s.selectedNum,
                      ]}
                    >
                      {cell.date.date()}
                    </Text>
                    {showEventDot && <View style={s.eventDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    weekRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    weekday: {
      width: `${100 / 7}%`,
      textAlign: 'center',
      color: theme.colors.muted,
      fontSize: 12,
      fontFamily: 'Inter',
      fontWeight: '900',
    },
    weeks: { gap: 0 },
    weekLine: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dayCell: {
      width: `${100 / 7}%`,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayBox: {
      width: DAY_BOX,
      height: DAY_BOX,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    todayBox: {
      borderWidth: 2,
      borderColor: theme.colors.primary,
      backgroundColor: 'transparent',
    },
    selectedBox: {
      backgroundColor: theme.colors.primary,
    },
    dayNum: {
      color: theme.colors.text,
      fontSize: 16,
      fontFamily: 'SpaceMonoBold',
      fontWeight: '700',
    },
    outsideMonthNum: {
      color: theme.colors.muted,
    },
    selectedNum: {
      color: theme.colors.primaryText ?? '#FFFFFF',
      fontWeight: '700',
    },
    eventDot: {
      position: 'absolute',
      bottom: 4,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primaryText ?? '#FFFFFF',
      pointerEvents: 'none',
    },
  });
