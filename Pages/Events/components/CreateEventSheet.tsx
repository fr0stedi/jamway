import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Calendar as CalendarIcon } from 'lucide-react-native';
import { useTheme } from '../../../Theme';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import dayjs, { Dayjs } from 'dayjs';
import useTimeOptions from '../hooks/useTimeOptions';
import type { CreateEventForm } from '../types';
import TimeSelect from './TimeSelect';


type Props = {
  visible: boolean;
  onClose: () => void;
  defaultDate: Dayjs;
  onSubmit: (data: CreateEventForm & { endTime: string }) => void;
  /** 0..1 fraction of screen height */
  maxHeightPct?: number;
};

export default function CreateEventSheet({
  visible,
  onClose,
  defaultDate,
  onSubmit,
  maxHeightPct = 0.82,
}: Props) {
  const { theme } = useTheme();
  const { height } = useWindowDimensions();
  const maxHeightPx = Math.round(height * maxHeightPct);

  // ---------- animations ----------
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current; // slide up from 24px
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 180, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 24, duration: 180, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]).start(({ finished }) => finished && setMounted(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const closeAnimated = () => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 180, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 24, duration: 180, easing: Easing.in(Easing.quad), useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) {
        setMounted(false);
        onClose();
      }
    });
  };

  const s = useMemo(() => getStyles(theme, maxHeightPx), [theme, maxHeightPx]);

  // ---------- form state ----------
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [eventDate, setEventDate] = useState<Dayjs>(defaultDate ?? dayjs());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState('20:00');
  const [durationHrs, setDurationHrs] = useState('2');
  const [genre, setGenre] = useState('Rock');
  const [artistSlots, setArtistSlots] = useState('3');

  const timeOptions = useTimeOptions();
  const endTimeLabel = useMemo(() => {
    const d = eventDate || dayjs();
    const [hh, mm] = startTime.split(':').map(Number);
    const start = d.hour(hh).minute(mm).second(0);
    const end = start.add(Number(durationHrs || 0), 'hour');
    return end.format('HH:mm');
  }, [eventDate, startTime, durationHrs]);

  const onChangeDate = (_: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (date) setEventDate(dayjs(date));
  };

  const submit = () => {
    onSubmit({
      title,
      desc,
      venueName,
      venueAddress,
      eventDate,
      startTime,
      durationHrs,
      genre,
      artistSlots,
      endTime: endTimeLabel,
    });
    closeAnimated();
  };

  if (!mounted) return null;

  const placeholderColor = theme.colors.border ?? 'rgba(255,255,255,0.55)';
  const fieldBg = theme.colors.muted ?? theme.colors.subtleBg ?? '#2F5E52';

  return (
    <View style={s.overlayRoot} pointerEvents="box-none">
      {/* Blurred, tappable backdrop */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
        <BlurView intensity={38} tint="dark" style={StyleSheet.absoluteFill} />
        <TouchableWithoutFeedback onPress={closeAnimated}>
          <View style={s.scrim} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Floating container (insets from all edges) */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={s.floater}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[
            s.sheet,
            {
              backgroundColor: theme.colors.bubble,
              borderColor: theme.colors.bubbleborder,
              opacity,
              transform: [{ translateY }],
            },
          ]}
        >
          {/* Header */}
          <View style={s.sheetTopRow}>
            <Text style={s.sheetTitle}>CREATE  NEW  EVENT</Text>
            <TouchableOpacity onPress={closeAnimated} hitSlop={10} style={s.closeBtn}>
              <X size={18} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={s.form}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
          >
            {/* Event Title */}
            <Text style={s.label}>Event Title</Text>
            <TextInput
              style={[s.input, { backgroundColor: fieldBg }]}
              placeholder="Enter event title"
              placeholderTextColor={placeholderColor}
              value={title}
              onChangeText={setTitle}
              selectionColor={theme.colors.primary}
              {...(Platform.OS === 'ios' ? { caretColor: theme.colors.primary } : {})}
            />

            {/* Description */}
            <Text style={s.label}>Description</Text>
            <TextInput
              style={[s.input, s.multiline, { backgroundColor: fieldBg }]}
              placeholder="Describe your event..."
              placeholderTextColor={placeholderColor}
              value={desc}
              onChangeText={setDesc}
              multiline
              selectionColor={theme.colors.primary}
              {...(Platform.OS === 'ios' ? { caretColor: theme.colors.primary } : {})}
            />

            {/* Venue Name */}
            <Text style={s.label}>Venue Name</Text>
            <TextInput
              style={[s.input, { backgroundColor: fieldBg }]}
              placeholder="Venue name"
              placeholderTextColor={placeholderColor}
              value={venueName}
              onChangeText={setVenueName}
              selectionColor={theme.colors.primary}
              {...(Platform.OS === 'ios' ? { caretColor: theme.colors.primary } : {})}
            />

            {/* Venue Address */}
            <Text style={s.label}>Venue Address</Text>
            <TextInput
              style={[s.input, { backgroundColor: fieldBg }]}
              placeholder="Full address"
              placeholderTextColor={placeholderColor}
              value={venueAddress}
              onChangeText={setVenueAddress}
              selectionColor={theme.colors.primary}
              {...(Platform.OS === 'ios' ? { caretColor: theme.colors.primary } : {})}
            />

            {/* Event Date */}
            <Text style={s.label}>Event Date</Text>
            <TouchableOpacity
              style={[s.readonlyField, { backgroundColor: fieldBg, borderColor: theme.colors.bubbleborder }]}
              activeOpacity={0.7}
              onPress={() => setShowDatePicker(prev => !prev)}   // toggle
            >
              <CalendarIcon size={16} color={placeholderColor} />
              <Text style={s.readonlyText}>{(eventDate ?? dayjs()).format('YYYY-MM-DD')}</Text>
              <Text style={s.pickHint}>{showDatePicker ? 'Hide' : 'Pick a date'}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={(eventDate ?? dayjs()).toDate()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onChangeDate}
                // @ts-ignore - iOS only
                textColor={theme.colors.text}
              />
            )}

{/* Start Time */}
<Text style={s.label}>Start Time</Text>
<TimeSelect value={startTime} onChange={setStartTime} options={timeOptions} />



            {/* Duration */}
            <Text style={s.label}>Duration (hours)</Text>
            <TextInput
              style={[s.input, { backgroundColor: fieldBg }]}
              placeholder="e.g. 2"
              placeholderTextColor={placeholderColor}
              keyboardType="numeric"
              value={durationHrs}
              onChangeText={setDurationHrs}
              selectionColor={theme.colors.primary}
              {...(Platform.OS === 'ios' ? { caretColor: theme.colors.primary } : {})}
            />

            <Text style={s.hint}>
              This event will end at <Text style={s.hintEm}>{endTimeLabel}</Text>
            </Text>

            {/* Genre */}
            <Text style={s.label}>Genre</Text>
            <View style={[s.pickerBox, { backgroundColor: fieldBg, borderColor: theme.colors.bubbleborder }]}>
              <Picker
                selectedValue={genre}
                onValueChange={(v) => setGenre(String(v))}
                dropdownIconColor={theme.colors.text}
                style={s.picker}
              >
                {['Rock', 'Pop', 'Hip-Hop', 'Electronic', 'Jazz', 'Classical'].map(g => (
                  <Picker.Item key={g} label={g} value={g} color={theme.colors.text} />
                ))}
              </Picker>
            </View>

            {/* Artist Slots */}
            <Text style={s.label}>Artist Slots</Text>
            <TextInput
              style={[s.input, { backgroundColor: fieldBg }]}
              placeholder="e.g. 3"
              placeholderTextColor={placeholderColor}
              keyboardType="numeric"
              value={artistSlots}
              onChangeText={setArtistSlots}
              selectionColor={theme.colors.primary}
              {...(Platform.OS === 'ios' ? { caretColor: theme.colors.primary } : {})}
            />

            {/* Actions */}
            <View style={s.actionsRow}>
              <TouchableOpacity style={s.cancelBtn} activeOpacity={0.85} onPress={closeAnimated}>
                <Text style={s.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.submitBtn} activeOpacity={0.9} onPress={submit}>
                <Text style={s.submitText}>Create Event</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const getStyles = (theme: any, maxHeightPx: number) =>
  StyleSheet.create({
    overlayRoot: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 999,
    },
    scrim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.25)',
    },
    floater: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 24,
      justifyContent: 'flex-end',
    },
    sheet: {
      borderRadius: 22,
      borderWidth: 1,
      maxHeight: maxHeightPx,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 12,
      overflow: 'hidden',
    },
    sheetTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 18,
      paddingTop: 20,
      paddingBottom: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.bubbleborder,
    },
    sheetTitle: {
      color: theme.colors.text,
      fontFamily: 'Inter',
      fontSize: 20,
      fontWeight: '800',   // <- string
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
    closeBtn: {
      padding: 8,
      borderRadius: 10,
      backgroundColor: 'transparent',
    },

    form: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
      gap: 10,
    },
    label: {
      color: theme.colors.text,
      fontFamily: 'Inter',
      fontWeight: '900',
      fontSize: 13.5,
      marginTop: 6,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.bubbleborder,
      color: theme.colors.text,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontFamily: 'Inter',
      fontSize: 14,
    },
    multiline: { minHeight: 100, textAlignVertical: 'top' },

    readonlyField: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    readonlyText: {
      color: theme.colors.text,
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 2,
    },
    pickHint: {
      marginLeft: 'auto',
      color: 'rgba(255,255,255,0.55)',
      fontFamily: 'Inter',
      fontSize: 12,
    },

    // Start time field / picker
    timeField: {
      borderWidth: 1,
      borderRadius: 12,
      height: 58,
      overflow: 'hidden',
      justifyContent: 'center',
      textAlign: 'center',
      alignItems: 'center',
      paddingHorizontal: Platform.OS === 'android' ? 8 : 0,
    },
    timePicker: {
      width: '100%',
      height: '100%',
      color: theme.colors.text,
    },

    pickerBox: {
      borderWidth: 1,
      borderColor: theme.colors.bubbleborder,
      borderRadius: 12,
      overflow: 'hidden',
    },
    picker: { height: 44, width: '100%' },

    hint: {
      color: 'rgba(255,255,255,0.7)',
      fontFamily: 'Inter',
      fontSize: 13,
      marginTop: -2,
    },
    hintEm: {
      color: theme.colors.text,
      fontFamily: 'Inter',
      fontWeight: '700',
    },

    actionsRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 10,
      marginBottom: 6,
    },
    cancelBtn: {
      flex: 1,
      backgroundColor: theme.colors.bubbleField ?? '#2F5E52',
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.bubbleborder,
    },
    cancelText: {
      color: theme.colors.text,
      fontFamily: 'Inter',
      fontWeight: '700',
      fontSize: 14,
    },
    submitBtn: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: 'center',
    },
    submitText: {
      color: theme.colors.primaryText ?? '#FFFFFF',
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: '800',
    },
  });
