import { Dayjs } from 'dayjs';

export type CalendarCell = {
  key: string;
  date: Dayjs;
  inCurrentMonth: boolean;
  isToday: boolean;
};

export type CreateEventForm = {
  title: string;
  desc: string;
  venueName: string;
  venueAddress: string;
  eventDate: Dayjs;
  startTime: string;     // 'HH:mm'
  durationHrs: string;   // number string
  genre: string;
  artistSlots: string;   // number string
};
