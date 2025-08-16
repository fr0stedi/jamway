import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useTheme } from '../../../Theme';

type Props = {
  value: string;                 // e.g. "20:00"
  onChange: (v: string) => void;
  options: string[];             // list of "HH:mm"
  label?: string;                // optional label above field (unused here)
};

export default function TimeSelect({ value, onChange, options }: Props) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  const s = useMemo(() => getStyles(theme), [theme]);

  const renderItem = ({ item }: { item: string }) => {
    const selected = item === value;
    return (
      <TouchableOpacity
        style={[s.row, selected && s.rowSelected]}
        onPress={() => {
          onChange(item);
          setOpen(false);
        }}
        activeOpacity={0.8}
      >
        <Text style={[s.rowText, selected && s.rowTextSelected]}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/* The field */}
      <TouchableOpacity
        style={s.field}
        activeOpacity={0.85}
        onPress={() => setOpen(true)}
      >
        <Text style={s.fieldText}>{value}</Text>
        <ChevronDown size={16} color={theme.colors.text} />
      </TouchableOpacity>

      {/* Simple centered modal list */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={s.backdrop}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>Select Start Time</Text>
            <FlatList
              data={options}
              keyExtractor={(t) => t}
              renderItem={renderItem}
              style={s.list}
              initialNumToRender={24}
              getItemLayout={(_, index) => ({ length: 44, offset: 44 * index, index })}
            />
            <TouchableOpacity style={s.closeBtn} onPress={() => setOpen(false)}>
              <Text style={s.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    field: {
      height: 48,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.bubbleborder,
      backgroundColor: theme.colors.bubbleField ?? theme.colors.subtleBg ?? '#2F5E52',
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',            // <-- vertically centers text
      justifyContent: 'space-between', // text left, chevron right
    },
    fieldText: {
      color: theme.colors.text,
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: '600',
    },

    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.35)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    sheet: {
      width: '100%',
      maxWidth: 420,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.bubbleborder,
      backgroundColor: theme.colors.bubble,
      overflow: 'hidden',
      maxHeight: '70%',
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
    },
    sheetTitle: {
      color: theme.colors.text,
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: '800',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.bubbleborder,
    },
    list: {
      maxHeight: 360,
    },
    row: {
      height: 44,
      paddingHorizontal: 16,
      justifyContent: 'center',
    },
    rowSelected: {
      backgroundColor: theme.colors.primary + (Platform.OS === 'ios' ? '22' : '33'), // soft overlay
    },
    rowText: {
      color: theme.colors.text,
      fontFamily: 'Inter',
      fontSize: 16,
    },
    rowTextSelected: {
      fontWeight: '800',
    },
    closeBtn: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: 'center',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.bubbleborder,
    },
    closeText: {
      color: theme.colors.text,
      fontFamily: 'Inter',
      fontWeight: '700',
      fontSize: 14,
    },
  });
