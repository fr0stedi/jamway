import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import OrganicBackground from '../../Components/OrganicBackground';
import dayjs, { Dayjs } from 'dayjs';
import { useTheme } from '../../Theme';
import { getStyles } from './styles';
import { useCalendar } from './hooks/useCalendar';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import Fab from './components/Fab';
import CreateEventSheet from './components/CreateEventSheet';

export default function Events() {
  const { theme } = useTheme();
  const s = getStyles(theme);

  // selection + month cursor via hook
  const { cursor, setCursor, selected, setSelected, monthLabel, weeks } = useCalendar();

  // (stub) which days have events?
  const eventDates = useMemo(() => new Set<string>([]), []);
  const hasEvent = (d: Dayjs) => eventDates.has(d.format('YYYY-MM-DD'));

  // modal
  const [showCreate, setShowCreate] = useState(false);
  const openCreate = () => setShowCreate(true);
  const closeCreate = () => setShowCreate(false);

  return (
    <OrganicBackground>
      {/* Title */}
      <View style={s.titleBox}>
        <Text style={s.titleText}>EVENTS</Text>
      </View>

      {/* Calendar bubble */}
      <View style={s.calendarWrap}>
        <CalendarHeader
          monthLabel={monthLabel}
          onPrev={() => setCursor(c => c.subtract(1, 'month'))}
          onNext={() => setCursor(c => c.add(1, 'month'))}
        />

        <CalendarGrid
          weeks={weeks}
          selected={selected}
          onSelect={(d, inMonth) => {
            if (!inMonth) setCursor(d);
            setSelected(d);
          }}
          hasEvent={hasEvent}
        />
      </View>

      {/* Placeholder below calendar */}
      <View style={s.content}>
        <Text style={s.bodyText}>Welcome to the Events Page 🎉</Text>
      </View>

      <Fab onPress={openCreate} />

      <CreateEventSheet
        visible={showCreate}
        onClose={closeCreate}
        defaultDate={selected ?? dayjs()}
        onSubmit={() => {
          // save then close
          closeCreate();
        }}
      />
    </OrganicBackground>
  );
}
