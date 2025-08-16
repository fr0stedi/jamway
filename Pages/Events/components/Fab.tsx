import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTheme } from '../../../Theme';

type Props = { onPress: () => void };

export default function Fab({ onPress }: Props) {
  const { theme } = useTheme();
  const s = getStyles(theme);
  return (
    <TouchableOpacity style={s.fab} activeOpacity={0.85} onPress={onPress}>
      <Plus color={theme.colors.primaryText ?? '#FFFFFF'} size={28} />
    </TouchableOpacity>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 28,
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },
  });
