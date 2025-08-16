import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../../Theme';

type Props = {
  monthLabel: string;
  onPrev: () => void;
  onNext: () => void;
};

export default function CalendarHeader({ monthLabel, onPrev, onNext }: Props) {
  const { theme } = useTheme();
  const s = getStyles(theme);

  return (
    <View style={s.header}>
      <Text style={s.monthText}>{monthLabel}</Text>
      <View style={s.controls}>
        <TouchableOpacity onPress={onPrev} style={s.iconBtn} activeOpacity={0.5}>
          <ChevronLeft color="#FFFFFF" size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext} style={s.iconBtn} activeOpacity={0.5}>
          <ChevronRight color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    header: {
      minHeight: 72,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    monthText: {
      color: theme.colors.text,
      fontSize: 22,
      letterSpacing: 1,
      fontFamily: 'Inter',
      fontWeight: '700',
    },
    controls: { flexDirection: 'row', gap: 14 },
    iconBtn: { padding: 6, borderRadius: 8 },
  });
