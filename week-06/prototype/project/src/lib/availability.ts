import type { AvailabilityDecision, Booking, Room } from './types';

const MINUTES_PER_DAY = 1440;
const MAX_DURATION_MINUTES = 120;

// Two intervals overlap if one starts strictly before the other ends.
// Touching endpoints (a.end === b.start) are allowed.
function overlaps(a: { start: number; end: number }, b: { start: number; end: number }): boolean {
  return a.start < b.end && b.start < a.end;
}

/**
 * Checks whether a proposed interval is bookable for the selected room.
 * Pure function: does not mutate bookings or rooms.
 */
export function checkAvailability(
  room: Room | undefined,
  start: number,
  end: number,
  nowMinutes: number,
  bookings: Booking[]
): AvailabilityDecision {
  if (!room) {
    return { available: false, reason: 'Please select a room.' };
  }

  // AC1: bounds and ordering — 0 ≤ start < end ≤ 1440.
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start < 0 ||
    end > MINUTES_PER_DAY
  ) {
    return { available: false, reason: 'Enter a time range within the same day (00:00–24:00).' };
  }
  if (start >= end) {
    return { available: false, reason: 'The start time must be before the end time.' };
  }
  if (start <= nowMinutes) {
    return { available: false, reason: 'The start time must be later than the current time.' };
  }

  // AC2: no booking longer than 120 minutes.
  if (end - start > MAX_DURATION_MINUTES) {
    return { available: false, reason: 'Bookings may not exceed 120 minutes.' };
  }

  // AC3: reject when room is blocked.
  if (room.blocked) {
    return { available: false, reason: `${room.name} is currently blocked and cannot be booked.` };
  }

  // AC4: reject overlapping intervals (touching allowed).
  const conflict = bookings
    .filter((b) => b.roomId === room.id)
    .find((b) => overlaps({ start, end }, { start: b.start, end: b.end }));

  if (conflict) {
    return {
      available: false,
      reason: `Overlaps an existing booking (${fmt(conflict.start)}–${fmt(conflict.end)}).`,
    };
  }

  return { available: true };
}

export function fmt(minutes: number): string {
  const m = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
