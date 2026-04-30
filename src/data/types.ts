// src/types.ts

export interface BellSlot {
  num: number;
  start: string;  // "HH:MM"
  end: string;    // "HH:MM"
}

export interface Lesson {
  subject: string;
  teacher: string;
  room: string;
}

export interface DaySchedule {
  [day: string]: Lesson[];
}

export interface ScheduleRecord {
  [group: string]: DaySchedule;
}

export interface PhotoItem {
  url: string;
  caption: string;
  sub: string;
}

export interface SearchMatchItem extends Lesson {
  group: string;
  day: string;
  num: number;
  start: string;
  end: string;
}

export type LessonState = 'active' | 'next' | 'past' | 'normal';
export type ThemeType = 'light' | 'dark';